"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupCedula } from "@/app/auth/actions";

type ActionState = { error?: string } | null;

async function lookupCedulaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return lookupCedula(formData);
}

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    lookupCedulaAction,
    null
  );

  return (
    <div className="space-y-8">
      {/* Mobile heading (hidden on desktop — the page renders it there) */}
      <div className="lg:hidden">
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
        <p className="text-[--color-muted-foreground] mt-1 text-sm">
          Ingresa tu cédula de identidad para continuar
        </p>
      </div>

      <form action={action} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="cedula"
            className="block text-sm font-semibold text-[--color-foreground]"
          >
            Cédula de Identidad
          </label>
          <div className="relative">
            <IdCard
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[--color-muted-foreground] pointer-events-none"
              strokeWidth={1.75}
            />
            <Input
              id="cedula"
              name="cedula"
              type="text"
              inputMode="numeric"
              pattern="\d{6,10}"
              placeholder="12345678"
              required
              autoFocus
              className="h-13 pl-12 text-lg tracking-widest text-center font-mono"
              style={{ height: "3.25rem" }}
            />
          </div>
          <p className="text-xs text-[--color-muted-foreground]">
            Solo el número, sin la V- al inicio
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
          className="w-full h-13 text-base font-semibold rounded-2xl gap-2"
          style={{ height: "3.25rem" }}
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Ingresar
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-3">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[--color-border]" />
          <span className="text-xs text-[--color-muted-foreground] px-2">o</span>
          <div className="flex-1 h-px bg-[--color-border]" />
        </div>
        <p className="text-center text-sm text-[--color-muted-foreground]">
          ¿Eres administrador?{" "}
          <Link
            href="/admin/login"
            className="text-[--color-primary] font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
