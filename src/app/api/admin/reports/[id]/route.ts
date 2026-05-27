import { type NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/api-auth";

const VALID_STATUSES = ["pending", "in progress", "done"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { status } = body as { status?: string };

  if (!status || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json(
      { error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const { error: dbError } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
