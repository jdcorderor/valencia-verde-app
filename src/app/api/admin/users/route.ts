import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/api-auth";

export async function GET() {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const { data: users, error: dbError } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ users: users ?? [] });
}
