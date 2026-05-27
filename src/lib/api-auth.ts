import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

type AuthResult =
  | { error: NextResponse; user: null; supabase: SupabaseClient }
  | { error: null; user: User; supabase: SupabaseClient };

export async function requireAdminUser(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
      user: null,
      supabase: supabase as unknown as SupabaseClient,
    };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, disabled")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || profile.disabled) {
    return {
      error: NextResponse.json(
        { error: "Sin permisos de administrador" },
        { status: 403 }
      ),
      user: null,
      supabase: supabase as unknown as SupabaseClient,
    };
  }

  return { error: null, user, supabase: supabase as unknown as SupabaseClient };
}

export async function requireAuthUser(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
      user: null,
      supabase: supabase as unknown as SupabaseClient,
    };
  }

  return { error: null, user, supabase: supabase as unknown as SupabaseClient };
}
