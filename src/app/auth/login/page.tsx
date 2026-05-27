import { Flame, ShieldCheck, MapPin, Bell } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Iniciar Sesión — Valencia Verde" };

export default function LoginPage() {
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
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-8"
            style={{ background: "white" }}
          />
          <div
            className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full opacity-5"
            style={{ background: "white" }}
          />
        </div>

        {/* Logo */}
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

        {/* Hero content */}
        <div className="relative space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Protege los bosques
              <br />
              <span style={{ color: "hsl(142.1 76.2% 75%)" }}>de Valencia</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-md">
              Reporta incendios forestales de forma rápida y segura. Tu acción puede salvar vidas y ecosistemas.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: MapPin, text: "Ubicación precisa" },
              { icon: Bell, text: "Alertas inmediatas" },
              { icon: ShieldCheck, text: "Respuesta rápida" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white font-medium"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-white/50 text-sm">
            Sistema oficial de reporte de incendios forestales · Valencia, Venezuela
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div
        className="flex-1 flex flex-col"
        style={{ background: "var(--color-background)" }}
      >
        {/* Mobile hero (shown only on mobile) */}
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
              className="flex h-18 w-18 mx-auto mb-5 items-center justify-center rounded-3xl shadow-2xl"
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
              Sistema de Reporte de Incendios
            </p>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-8 rounded-t-[2rem]"
            style={{ background: "var(--color-background)" }}
          />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
          <div className="w-full max-w-sm">
            {/* Desktop logo (visible only on desktop above the form) */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Bienvenido</h2>
              <p className="text-[--color-muted-foreground] mt-2 text-base">
                Ingresa tu cédula de identidad para continuar
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
