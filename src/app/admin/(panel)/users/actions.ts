"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function toggleUserStatus(userId: string, disabled: boolean) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("users")
    .update({ disabled })
    .eq("id", userId);

  if (error) return { error: "Error al actualizar el estado del usuario." };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: "Error al actualizar el rol." };
  revalidatePath("/admin/users");
  return { success: true };
}
