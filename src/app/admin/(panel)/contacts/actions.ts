"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function createContact(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name || !phone) return { error: "Nombre y teléfono son requeridos." };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("contacts")
    .insert({ name, phone, description: description ?? "" });

  if (error) return { error: "Error al crear el contacto." };
  revalidatePath("/admin/contacts");
  revalidatePath("/dashboard/contacts");
  return { success: true };
}

export async function updateContact(formData: FormData) {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!id || !name || !phone) return { error: "Datos incompletos." };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("contacts")
    .update({ name, phone, description: description ?? "" })
    .eq("id", id);

  if (error) return { error: "Error al actualizar el contacto." };
  revalidatePath("/admin/contacts");
  revalidatePath("/dashboard/contacts");
  return { success: true };
}

export async function deleteContact(contactId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId);

  if (error) return { error: "Error al eliminar el contacto." };
  revalidatePath("/admin/contacts");
  revalidatePath("/dashboard/contacts");
  return { success: true };
}
