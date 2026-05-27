"use client";

import { useActionState } from "react";
import { Loader2, CheckCircle2, IdCard, Phone, User, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/app/dashboard/profile/actions";
import { signOut } from "@/app/auth/actions";
import type { User as UserType } from "@/types";

type ActionState = { error?: string; success?: boolean; emailChanged?: boolean } | null;

async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return updateProfile(formData);
}

export function ProfileForm({ profile, email }: { profile: UserType; email: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateProfileAction,
    null
  );

  const initials = (
    (profile.first_name?.[0] ?? "") + (profile.last_name?.[0] ?? "")
  ).toUpperCase() || "?";

  const isAdmin = profile.role === "admin";

  return (
    <div className="space-y-6">
      {/* Avatar / identity card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[--color-border] p-6"
        style={{ background: "var(--color-card)" }}
      >
        {/* Subtle gradient background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              "linear-gradient(135deg, hsl(142.1 76.2% 36.3%) 0%, hsl(155 60% 42%) 100%)",
          }}
        />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-white text-2xl font-bold shadow-lg flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(142.1 76.2% 28%) 0%, hsl(155 60% 42%) 100%)",
            }}
          >
            {initials}
          </div>

          {/* Identity info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xl leading-tight truncate">
              {profile.first_name} {profile.last_name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <IdCard className="h-3.5 w-3.5 text-[--color-muted-foreground] flex-shrink-0" strokeWidth={1.75} />
              <p className="text-sm text-[--color-muted-foreground] font-mono">
                V-{profile.national_id}
              </p>
            </div>
            <div className="mt-2">
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className="gap-1"
              >
                {isAdmin && (
                  <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                )}
                {isAdmin ? "Administrador" : "Usuario"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div
        className="rounded-2xl border border-[--color-border] p-5 space-y-5"
        style={{ background: "var(--color-card)" }}
      >
        <div>
          <h3 className="font-bold text-base">Datos Personales</h3>
          <p className="text-sm text-[--color-muted-foreground] mt-0.5">
            Actualiza tu nombre y teléfono de contacto
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="font-semibold">Nombre</Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                  strokeWidth={1.75}
                />
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={profile.first_name}
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="font-semibold">Apellido</Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                  strokeWidth={1.75}
                />
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={profile.last_name}
                  required
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Cédula de Identidad</Label>
            <div className="relative">
              <IdCard
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                strokeWidth={1.75}
              />
              <Input
                value={`V-${profile.national_id}`}
                readOnly
                className="pl-9 font-mono bg-[--color-secondary] text-[--color-muted-foreground] cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-[--color-muted-foreground]">
              La cédula no puede modificarse
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-semibold">Teléfono</Label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                strokeWidth={1.75}
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone}
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">Correo Electrónico</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                strokeWidth={1.75}
              />
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                required
                className="pl-9"
              />
            </div>
            <p className="text-xs text-[--color-muted-foreground]">
              Si cambias el correo recibirás un enlace de confirmación
            </p>
          </div>

          {state?.error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 dark:bg-red-950/30 dark:border-red-800 animate-[scale-in_0.2s_ease-out]">
              <p className="text-sm text-red-700 dark:text-red-400">{state.error}</p>
            </div>
          )}

          {state?.success && (
            <div className="flex items-center gap-2.5 rounded-xl bg-green-50 border border-green-100 px-4 py-3 dark:bg-green-950/30 dark:border-green-900 animate-[scale-in_0.2s_ease-out]">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                {state.emailChanged
                  ? "Perfil actualizado. Revisa tu nuevo correo para confirmar el cambio."
                  : "Perfil actualizado correctamente."}
              </p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-2xl font-semibold gap-2"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </form>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl border border-[--color-border] p-5 space-y-4"
        style={{ background: "var(--color-card)" }}
      >
        <div>
          <h3 className="font-bold text-base text-[--color-destructive]">Zona Peligrosa</h3>
          <p className="text-sm text-[--color-muted-foreground] mt-0.5">
            Acciones que no pueden deshacerse fácilmente
          </p>
        </div>
        <form action={signOut}>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="w-full rounded-2xl font-semibold text-[--color-destructive] border-[--color-destructive]/25 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-[--color-destructive]/50"
          >
            Cerrar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
