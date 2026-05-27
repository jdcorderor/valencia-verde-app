"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function submitReport(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado." };

  const lat = parseFloat(formData.get("latitude") as string);
  const lng = parseFloat(formData.get("longitude") as string);

  if (isNaN(lat) || isNaN(lng)) {
    return { error: "Debes seleccionar una ubicación en el mapa." };
  }

  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  const description = (formData.get("description") as string)?.trim();
  const has_injured = formData.get("has_injured") === "true";

  if (!type || !priority || !description) {
    return { error: "Completa todos los campos requeridos." };
  }

  const imageFile = formData.get("image") as File | null;

  const service = createServiceClient();

  if (!imageFile || imageFile.size === 0) {
    return { error: "La fotografía del incendio es obligatoria." };
  }

const ext = imageFile.name.split(".").pop() ?? "jpg";
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await service.storage
    .from("reports")
    .upload(fileName, imageFile, { contentType: imageFile.type });

  if (uploadError) {
    console.error("[submitReport] upload error:", uploadError);
    return { error: "Error al subir la imagen." };
  }

  const { data: urlData } = service.storage
    .from("reports")
    .getPublicUrl(fileName);

  const image_url = urlData.publicUrl;

  const { error } = await service.from("reports").insert({
    user_id: user.id,
    date: new Date().toISOString(),
    type,
    description,
    latitude: lat,
    longitude: lng,
    priority,
    image_url,
    has_injured,
    status: "pending",
  });

  if (error) {
    console.error("[submitReport] insert error:", error);
    return { error: "Error al guardar el reporte." };
  }

  revalidatePath("/dashboard/reports");
  return { success: true };
}
