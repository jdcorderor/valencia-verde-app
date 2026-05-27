import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const { error } = await requireAuthUser();
  if (error) return error;

  const service = createServiceClient();
  const { data: contacts, error: dbError } = await service
    .from("contacts")
    .select("*")
    .order("name");

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ contacts: contacts ?? [] });
}
