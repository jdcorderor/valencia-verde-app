import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

type Portal = "admin" | "user";

/**
 * Returns the active portal based on hostname or explicit env override.
 * Returns null on plain localhost (no override) so dev mode uses the original
 * role-based routing without portal separation.
 */
function getPortal(request: NextRequest): Portal | null {
  const envPortal = process.env.NEXT_PUBLIC_PORTAL;
  if (envPortal === "admin" || envPortal === "user") return envPortal;

  const host = request.headers.get("host") ?? "";
  if (host.startsWith("intranet.")) return "admin";
  if (host.startsWith("www.")) return "user";

  // Plain localhost / unknown host → no portal enforcement
  return null;
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const portal = getPortal(request);
  const pathname = request.nextUrl.pathname;

  // Enforce API route delimitation only when a portal is active
  if (portal !== null) {
    if (pathname.startsWith("/api/admin/") && portal !== "admin") {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }
    if (pathname.startsWith("/api/user/") && portal !== "user") {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    // Block cross-portal page routes
    if (portal === "user" && pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    if (
      portal === "admin" &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/api/")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public paths differ by portal context
  const publicPaths =
    portal === "admin"
      ? ["/admin/login"]
      : portal === "user"
        ? ["/auth/login", "/auth/register", "/auth/verify", "/auth/callback"]
        : [
            // No portal (dev localhost): include all public paths
            "/auth/login",
            "/auth/register",
            "/auth/verify",
            "/auth/callback",
            "/admin/login",
          ];

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = portal === "admin" ? "/admin/login" : "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await service
      .from("users")
      .select("role, disabled")
      .eq("id", user.id)
      .single();

    if (profile?.disabled) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = portal === "admin" ? "/admin/login" : "/auth/login";
      url.searchParams.set("error", "cuenta_deshabilitada");
      return NextResponse.redirect(url);
    }

    const isAdmin = profile?.role === "admin";

    if (portal !== null) {
      // Non-admin on admin portal → sign out and send to user portal
      if (portal === "admin" && !isAdmin) {
        await supabase.auth.signOut();
        const userHost = process.env.NEXT_PUBLIC_USER_HOST;
        if (userHost) {
          const protocol = request.nextUrl.protocol;
          return NextResponse.redirect(
            new URL(`${protocol}//${userHost}/auth/login?error=sin_permisos`)
          );
        }
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("error", "sin_permisos");
        return NextResponse.redirect(url);
      }

      // Admin on user portal → send to admin portal
      if (portal === "user" && isAdmin && !isPublic) {
        const adminHost = process.env.NEXT_PUBLIC_ADMIN_HOST;
        if (adminHost) {
          const protocol = request.nextUrl.protocol;
          return NextResponse.redirect(
            new URL(`${protocol}//${adminHost}/admin/dashboard`)
          );
        }
        // Fallback if NEXT_PUBLIC_ADMIN_HOST is not set
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("info", "usa_intranet");
        return NextResponse.redirect(url);
      }

      // Redirect away from login pages if already authenticated
      if (isPublic) {
        const url = request.nextUrl.clone();
        url.pathname =
          portal === "admin" ? "/admin/dashboard" : "/dashboard/reports";
        return NextResponse.redirect(url);
      }
    } else {
      // No portal (dev localhost) → original role-based routing
      const isAdminRoute = pathname.startsWith("/admin");
      const isAuthRoute = isPublic;

      if (isAdmin && !isAdminRoute && !isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
      if (!isAdmin && isAdminRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/reports";
        return NextResponse.redirect(url);
      }
      if (isAuthRoute && !isAdminRoute) {
        const url = request.nextUrl.clone();
        url.pathname = isAdmin ? "/admin/dashboard" : "/dashboard/reports";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
