import { type NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const { error, user } = await requireAuthUser();
  if (error) return error;

  const service = createServiceClient();
  const { data: reports, error: dbError } = await service
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ reports: reports ?? [] });
}

export async function POST(request: NextRequest) {
  const { error, user } = await requireAuthUser();
  if (error) return error;

  const body = await request.json();
  const { type, priority, description, latitude, longitude, has_injured, injured_details } =
    body as {
      type?: string;
      priority?: string;
      description?: string;
      latitude?: number;
      longitude?: number;
      has_injured?: boolean;
      injured_details?: string;
    };

  if (!type || !priority || !description || latitude == null || longitude == null) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Coordenadas inválidas" },
      { status: 400 }
    );
  }

  const service = createServiceClient();
  const { data, error: dbError } = await service
    .from("reports")
    .insert({
      user_id: user.id,
      date: new Date().toISOString(),
      type,
      priority,
      description,
      latitude,
      longitude,
      has_injured: has_injured ?? false,
      injured_details: has_injured ? (injured_details ?? null) : null,
      status: "pending",
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ report: data }, { status: 201 });
}
