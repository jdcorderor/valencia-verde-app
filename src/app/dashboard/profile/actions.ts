"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!first_name || !last_name || !phone || !email) {
    return { error: "Todos los campos son requeridos." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El correo electrónico no es válido." };
  }

  const service = createServiceClient();

  // Update public.users (service client bypasses RLS)
  const { error: dbError } = await service
    .from("users")
    .update({ first_name, last_name, phone, email })
    .eq("id", user.id);

  if (dbError) return { error: "Error al actualizar el perfil." };

  // Update email in auth if changed
  if (email !== user.email) {
    const { error: authError } = await supabase.auth.updateUser({ email });
    if (authError) return { error: "Perfil actualizado, pero el correo no pudo cambiarse: " + authError.message };
    revalidatePath("/dashboard/profile");
    return { success: true, emailChanged: true };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}
