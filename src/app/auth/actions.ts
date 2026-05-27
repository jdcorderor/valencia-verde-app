"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export async function lookupCedula(formData: FormData) {
  const cedula = (formData.get("cedula") as string)?.trim();

  if (!cedula || !/^\d{6,10}$/.test(cedula)) {
    return { error: "Ingresa una cédula válida (solo números, 6–10 dígitos)." };
  }

  const service = createServiceClient();

  const { data: user, error } = await service
    .from("users")
    .select("id, first_name, last_name, disabled, email, role")
    .eq("national_id", cedula)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: "Error al consultar la base de datos." };
  }

  if (!user) {
    redirect(`/auth/register?cedula=${encodeURIComponent(cedula)}`);
  }

  if (user.disabled) {
    return { error: "Tu cuenta ha sido deshabilitada. Contacta al administrador." };
  }

  const email = user.email as string | undefined;

  if (!email) {
    return { error: "No se encontró un correo asociado a esta cédula." };
  }

  const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData) {
    console.error("[lookupCedula] generateLink error:", linkError);
    return { error: "Error al iniciar sesión. Intenta de nuevo." };
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: linkData.properties.email_otp,
    type: "magiclink",
  });

  if (verifyError) {
    console.error("[lookupCedula] verifyOtp error:", verifyError);
    return { error: "Error al iniciar sesión. Intenta de nuevo." };
  }

  redirect((user.role as string) === "admin" ? "/admin/dashboard" : "/dashboard/reports");
}

export async function sendOtpForRegisteredUser(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error) {
    return { error: "Error al enviar el código OTP." };
  }

  return { success: true };
}

export async function registerUser(formData: FormData) {
  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  const national_id = (formData.get("national_id") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!first_name || !last_name || !national_id || !phone || !email) {
    return { error: "Todos los campos son obligatorios." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El correo electrónico no es válido." };
  }

  const service = createServiceClient();

  const { data: existing } = await service
    .from("users")
    .select("id")
    .eq("national_id", national_id)
    .single();

  if (existing) {
    return { error: "Ya existe un usuario con esa cédula." };
  }

  const { data: authData, error: createError } = await service.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { first_name, last_name, national_id, phone },
  });

  if (createError) {
    console.error("[registerUser] createUser error:", createError);
    return { error: "Error al crear la cuenta. Intenta con otro correo." };
  }

  await service.from("users").insert({
    id: authData.user.id,
    first_name,
    last_name,
    national_id,
    phone,
    email,
    role: "user",
    disabled: false,
  });

  const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData) {
    console.error("[registerUser] generateLink error:", linkError);
    return { error: "Cuenta creada, pero no se pudo iniciar sesión. Intenta ingresar." };
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: linkData.properties.email_otp,
    type: "magiclink",
  });

  if (verifyError) {
    console.error("[registerUser] verifyOtp error:", verifyError);
    return { error: "Cuenta creada, pero no se pudo iniciar sesión. Intenta ingresar." };
  }

  redirect("/dashboard/reports");
}

export async function verifyOtp(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const token = (formData.get("token") as string)?.trim();

  if (!email || !token || token.length !== 6) {
    return { error: "Código inválido. Debe ser de 6 dígitos." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.session) {
    return { error: "Código incorrecto o expirado. Solicita uno nuevo." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user!.id)
    .single();

  if (!profile) {
    const userData = data.user?.user_metadata;
    await supabase.from("users").insert({
      id: data.user!.id,
      first_name: userData?.first_name ?? "",
      last_name: userData?.last_name ?? "",
      national_id: userData?.national_id ?? "",
      phone: userData?.phone ?? "",
      email: email,
      role: "user",
      disabled: false,
    });
  }

  const role = profile?.role ?? "user";
  redirect(role === "admin" ? "/admin/dashboard" : "/dashboard/reports");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
