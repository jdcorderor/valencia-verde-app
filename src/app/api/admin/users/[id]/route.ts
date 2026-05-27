import { type NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/api-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { disabled, role } = body as {
    disabled?: boolean;
    role?: "user" | "admin";
  };

  const updates: Record<string, unknown> = {};
  if (typeof disabled === "boolean") updates.disabled = disabled;
  if (role === "admin" || role === "user") updates.role = role;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin cambios válidos" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
