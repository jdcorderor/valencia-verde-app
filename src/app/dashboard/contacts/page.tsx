import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import { Phone, PhoneCall, AlertTriangle, Siren } from "lucide-react";
import type { Contact } from "@/types";

export const metadata = { title: "Contactos de Emergencia — Valencia Verde" };

export default async function ContactsPage() {
  const supabase = createServiceClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("name");

  return (
    <div>
      <TopBar title="Contactos de Emergencia" />
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-5">

        {/* Emergency banner */}
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, hsl(0 84.2% 40%) 0%, hsl(15 90% 50%) 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-15"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full opacity-10"
            style={{ background: "white" }}
          />

          <div className="relative flex items-start gap-4">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 shadow-lg"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Siren className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">
                ¡En caso de emergencia actúa rápido!
              </p>
              <p className="text-white/80 text-sm mt-1 leading-relaxed">
                Cada segundo cuenta. Llama de inmediato al contacto correspondiente antes de completar el reporte.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href="tel:171"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-700 transition-colors"
                  style={{ background: "rgba(255,255,255,0.9)" }}
                >
                  <Phone className="h-3 w-3" />
                  171 · Bomberos
                </a>
                <a
                  href="tel:911"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-700 transition-colors"
                  style={{ background: "rgba(255,255,255,0.9)" }}
                >
                  <Phone className="h-3 w-3" />
                  911 · Emergencias
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section label */}
        {contacts && contacts.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[--color-muted-foreground]">
              Directorio de contactos
            </p>
            <p className="text-sm text-[--color-muted-foreground] mt-0.5">
              {contacts.length} contacto{contacts.length !== 1 ? "s" : ""} disponible{contacts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {!contacts || contacts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl mx-auto"
              style={{ background: "var(--color-secondary)" }}
            >
              <Phone className="h-9 w-9 text-[--color-muted-foreground]" strokeWidth={1.25} />
            </div>
            <div>
              <p className="font-bold text-base">No hay contactos registrados</p>
              <p className="text-sm text-[--color-muted-foreground] mt-1">
                El administrador aún no ha agregado contactos de emergencia.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact: Contact, i: number) => (
              <a
                key={contact.id}
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-[--color-border] bg-[--color-card] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Avatar icon */}
                <div
                  className="flex h-13 w-13 items-center justify-center rounded-2xl flex-shrink-0 transition-colors duration-200 group-hover:scale-105"
                  style={{
                    width: "3.25rem",
                    height: "3.25rem",
                    background: "hsl(142.1 76.2% 36.3% / 0.1)",
                    border: "1.5px solid hsl(142.1 76.2% 36.3% / 0.2)",
                  }}
                >
                  <Phone className="h-5 w-5 text-[--color-primary]" strokeWidth={2} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight">{contact.name}</p>
                  <p
                    className="text-base font-mono font-bold mt-0.5 leading-tight"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {contact.phone}
                  </p>
                  {contact.description && (
                    <p className="text-xs text-[--color-muted-foreground] mt-1 leading-snug line-clamp-2">
                      {contact.description}
                    </p>
                  )}
                </div>

                {/* Call button */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
                  style={{
                    background: "hsl(142.1 76.2% 36.3%)",
                  }}
                >
                  <PhoneCall className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
