"use client";

import { use, useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, UserRound, Phone, Mail, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/app/auth/actions";

type ActionState = { error?: string } | null;

async function registerUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return registerUser(formData);
}

export function RegisterForm({
  searchParams,
}: {
  searchParams: Promise<{ cedula?: string }>;
}) {
  const params = use(searchParams);
  const cedula = params.cedula ?? "";

  const [state, action, pending] = useActionState<ActionState, FormData>(
    registerUserAction,
    null
  );

  return (
    <div className="space-y-6">
      {/* Mobile heading */}
      <div className="lg:hidden">
        <h2 className="text-2xl font-bold tracking-tight">Tus datos</h2>
        <p className="text-[--color-muted-foreground] mt-1 text-sm">
          Completa tu información para registrarte
        </p>
      </div>

      {/* Cedula display */}
      {cedula && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "hsl(142.1 76.2% 36.3% / 0.08)",
            border: "1px solid hsl(142.1 76.2% 36.3% / 0.2)",
          }}
        >
          <IdCard className="h-4 w-4 text-[--color-primary] flex-shrink-0" strokeWidth={2} />
          <p className="text-sm font-medium">
            Cédula:{" "}
            <span className="font-mono font-bold text-[--color-primary]">V-{cedula}</span>
          </p>
        </div>
      )}

      <form action={action} className="space-y-4">
        <input type="hidden" name="national_id" value={cedula} />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="first_name" className="block text-sm font-semibold text-[--color-foreground]">
              Nombre
            </label>
            <div className="relative">
              <UserRound
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                strokeWidth={1.75}
              />
              <Input
                id="first_name"
                name="first_name"
                placeholder="Juan"
                required
                autoFocus
                className="h-11 pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="block text-sm font-semibold text-[--color-foreground]">
              Apellido
            </label>
            <div className="relative">
              <UserRound
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
                strokeWidth={1.75}
              />
              <Input
                id="last_name"
                name="last_name"
                placeholder="García"
                required
                className="h-11 pl-9"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-[--color-foreground]">
            Teléfono
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
              strokeWidth={1.75}
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="0414-1234567"
              required
              className="h-11 pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[--color-foreground]">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-muted-foreground] pointer-events-none"
              strokeWidth={1.75}
            />
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              placeholder="correo@ejemplo.com"
              required
              className="h-11 pl-9"
            />
          </div>
          <p className="text-xs text-[--color-muted-foreground]">
            Recibirás un código de verificación en este correo
          </p>
        </div>

        {state?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:bg-red-950/30 dark:border-red-800 animate-[scale-in_0.2s_ease-out]">
            <p className="text-sm text-red-700 dark:text-red-400">{state.error}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full h-13 text-base font-semibold rounded-2xl mt-2"
          style={{ height: "3.25rem" }}
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Registrarse"
          )}
        </Button>
      </form>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors py-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio de sesión
      </Link>
    </div>
  );
}
