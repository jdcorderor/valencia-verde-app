import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/api-auth";

export async function GET() {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const { data: reports, error: dbError } = await supabase
    .from("reports")
    .select("*, users(first_name, last_name, national_id)")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ reports: reports ?? [] });
}
