import { type NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/api-auth";

export async function GET() {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const { data: contacts, error: dbError } = await supabase
    .from("contacts")
    .select("*")
    .order("name");

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ contacts: contacts ?? [] });
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const body = await request.json();
  const { name, phone, description } = body as {
    name?: string;
    phone?: string;
    description?: string;
  };

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "Nombre y teléfono son requeridos" },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("contacts")
    .insert({
      name: name.trim(),
      phone: phone.trim(),
      description: description?.trim() ?? "",
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ contact: data }, { status: 201 });
}
