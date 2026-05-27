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
  const { name, phone, description } = body as {
    name?: string;
    phone?: string;
    description?: string;
  };

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("contacts")
    .update({
      name: name.trim(),
      phone: phone.trim(),
      description: description?.trim() ?? "",
    })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;

  const { error: dbError } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
