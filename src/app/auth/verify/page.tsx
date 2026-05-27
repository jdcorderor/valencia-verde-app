import { Flame, Mail } from "lucide-react";
import { OtpForm } from "@/components/auth/otp-form";

export const metadata = {
  title: "Verificación — Valencia Verde",
};

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (desktop hero) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, hsl(142.1 76.2% 18%) 0%, hsl(142.1 76.2% 30%) 45%, hsl(155 65% 38%) 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-[0.08]"
            style={{ background: "white" }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg">Valencia Verde</span>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Verificación
              <br />
              <span style={{ color: "hsl(142.1 76.2% 75%)" }}>de identidad</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-md">
              Revisa tu correo electrónico e ingresa el código de 6 dígitos que te enviamos.
            </p>
          </div>

          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <Mail className="h-5 w-5 text-white/80 flex-shrink-0" strokeWidth={2} />
            <p className="text-white/80 text-sm">
              El código expira en 10 minutos. Si no lo ves, revisa tu carpeta de spam.
            </p>
          </div>
        </div>

        <div className="relative">
          <p className="text-white/50 text-sm">
            Sistema oficial de reporte de incendios forestales · Valencia, Venezuela
          </p>
        </div>
      </div>

      {/* ── Right panel (OTP form) ── */}
      <div
        className="flex-1 flex flex-col"
        style={{ background: "var(--color-background)" }}
      >
        {/* Mobile hero */}
        <div
          className="lg:hidden relative flex flex-col items-center justify-center px-6 pt-14 pb-16"
          style={{
            background:
              "linear-gradient(160deg, hsl(142.1 76.2% 22%) 0%, hsl(142.1 76.2% 34%) 50%, hsl(155 65% 40%) 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 h-36 w-36 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
            style={{ background: "white" }}
          />
          <div className="relative text-center text-white">
            <div
              className="flex mx-auto mb-5 items-center justify-center rounded-3xl shadow-2xl"
              style={{
                width: "4.5rem",
                height: "4.5rem",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Flame className="h-9 w-9 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Valencia Verde</h1>
            <p className="text-white/70 mt-1.5 text-sm font-medium tracking-wide uppercase">
              Verificación de Identidad
            </p>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-8 rounded-t-[2rem]"
            style={{ background: "var(--color-background)" }}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
          <OtpForm searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
