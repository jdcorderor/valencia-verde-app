"use client";

import { use, useActionState, useRef } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyOtp } from "@/app/auth/actions";

type ActionState = { error?: string } | null;

async function verifyOtpAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return verifyOtp(formData);
}

export function OtpForm({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = use(searchParams);
  const email = params.email ?? "";
  const maskedEmail = email.replace(/(.{2}).+(@.+)/, "$1***$2");

  const [state, action, pending] = useActionState<ActionState, FormData>(
    verifyOtpAction,
    null
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = val.slice(-1);
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    text.split("").forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = char;
      }
    });
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  return (
    <div className="w-full max-w-sm space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Mobile logo (hidden on desktop — shown in panel) */}
      <div className="lg:hidden flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[--color-primary] shadow-lg">
          <Flame className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Valencia Verde</h1>
          <p className="text-sm text-[--color-muted-foreground]">
            Verificación de Identidad
          </p>
        </div>
      </div>

      {/* Desktop heading */}
      <div className="hidden lg:block">
        <h2 className="text-3xl font-bold tracking-tight">Código de verificación</h2>
        <p className="text-[--color-muted-foreground] mt-2 text-base">
          Ingresa el código que enviamos a tu correo
        </p>
      </div>

      {/* Email info card */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
        style={{
          background: "hsl(142.1 76.2% 36.3% / 0.08)",
          border: "1px solid hsl(142.1 76.2% 36.3% / 0.2)",
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[--color-primary]/10 flex-shrink-0">
          <MailCheck className="h-4.5 w-4.5 text-[--color-primary]" strokeWidth={2} style={{ width: "1.125rem", height: "1.125rem" }} />
        </div>
        <div>
          <p className="text-xs font-medium text-[--color-muted-foreground]">Código enviado a</p>
          <p className="text-sm font-semibold">{maskedEmail || "tu correo"}</p>
        </div>
      </div>

      <form
        action={(formData) => {
          const digits = Array.from({ length: 6 }, (_, i) =>
            inputRefs.current[i]?.value ?? ""
          ).join("");
          formData.set("token", digits);
          formData.set("email", email);
          return action(formData);
        }}
        className="space-y-5"
      >
        <input type="hidden" name="email" value={email} />

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[--color-foreground]">
            Código de verificación
          </label>
          <div
            className="flex gap-2 justify-between"
            onPaste={handlePaste}
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <Input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                pattern="\d"
                className="h-12 w-full text-center text-xl font-mono font-bold p-0 rounded-xl border-2 focus:border-[--color-primary] transition-colors"
                onChange={(e) => handleDigitInput(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          <p className="text-xs text-[--color-muted-foreground]">
            Ingresa los 6 dígitos del correo que recibiste
          </p>
        </div>

        {state?.error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 dark:bg-red-950/30 dark:border-red-800 animate-[scale-in_0.2s_ease-out]">
            <p className="text-sm text-red-700 dark:text-red-400">
              {state.error}
            </p>
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
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verificar e Ingresar
            </>
          )}
        </Button>
      </form>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-1.5 text-sm text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Usar otra cédula
      </Link>
    </div>
  );
}
