"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export async function adminSignIn(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Correo y contraseña son requeridos." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error("[adminSignIn] error:", error);
    return { error: "Credenciales incorrectas." };
  }

  const service = createServiceClient();
  const { data: profile } = await service
    .from("users")
    .select("role, disabled")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "No tienes permisos de administrador." };
  }

  if (profile.disabled) {
    await supabase.auth.signOut();
    return { error: "Tu cuenta ha sido deshabilitada." };
  }

  redirect("/admin/dashboard");
}
