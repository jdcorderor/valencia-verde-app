"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Camera,
  X,
  ImagePlus,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPicker } from "./map-picker";
import { submitReport } from "@/app/dashboard/report/actions";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Ubicación",  icon: MapPin,        description: "Marca el punto en el mapa" },
  { id: 2, label: "Detalles",   icon: ClipboardList, description: "Describe el incendio"      },
  { id: 3, label: "Heridos",    icon: AlertCircle,   description: "Info de víctimas"           },
];

export function ReportWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Step 1
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Step 2
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 3
  const [hasInjured, setHasInjured] = useState(false);
  const [injuredDetails, setInjuredDetails] = useState("");

  const canProceedStep1 = coords !== null;
  const canProceedStep2 = type && priority && description.trim().length > 10 && imagePreview !== null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setError(null);
    const formData = new FormData();
    formData.set("latitude",  String(coords!.lat));
    formData.set("longitude", String(coords!.lng));
    formData.set("type",      type);
    formData.set("priority",  priority);
    formData.set("description", description);
    formData.set("has_injured", String(hasInjured));
    if (hasInjured) formData.set("injured_details", injuredDetails);
    if (imageFile)  formData.set("image", imageFile);

    startTransition(async () => {
      const result = await submitReport(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/reports"), 1800);
      }
    });
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center animate-[scale-in_0.3s_ease-out]">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: "hsl(142.1 76.2% 36.3%)" }}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-2xl font-bold">¡Reporte Enviado!</p>
          <p className="text-[--color-muted-foreground]">
            Las autoridades han sido notificadas.
          </p>
          <p className="text-sm text-[--color-muted-foreground]">
            Redirigiendo a tus reportes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Step indicator ── */}
      <div className="space-y-4">
        <div className="flex items-center">
          {steps.map(({ id, label, icon: Icon }, idx) => {
            const done    = id < step;
            const current = id === step;
            const future  = id > step;

            return (
              <div key={id} className="flex items-center flex-1 last:flex-none">
                {/* Step circle */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                      done
                        ? "bg-[--color-primary] text-white shadow-sm"
                        : current
                          ? "bg-[--color-primary] text-white shadow-md ring-4 ring-[--color-primary]/20"
                          : "bg-[--color-secondary] text-[--color-muted-foreground]"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4.5 w-4.5" style={{ width: "1.125rem", height: "1.125rem" }} />
                    ) : (
                      <Icon className="h-4 w-4" strokeWidth={current ? 2.5 : 1.75} />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold leading-none",
                      current ? "text-[--color-primary]" : "text-[--color-muted-foreground]"
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-[--color-border]">
                    <div
                      className="h-full bg-[--color-primary] transition-all duration-500"
                      style={{ width: done ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current step info */}
        <div
          className="px-4 py-3 rounded-xl"
          style={{ background: "var(--color-secondary)" }}
        >
          <p className="text-xs text-[--color-muted-foreground] font-medium">
            Paso {step} de {steps.length}
          </p>
          <p className="text-sm font-semibold mt-0.5">
            {steps[step - 1].description}
          </p>
        </div>
      </div>

      {/* ── Step 1: Map ── */}
      {step === 1 && (
        <div className="space-y-4 animate-[slide-up_0.25s_ease-out]">
          <div>
            <h2 className="font-bold text-xl">Ubicación del Incendio</h2>
            <p className="text-sm text-[--color-muted-foreground] mt-1">
              Toca en el mapa para marcar el punto exacto del siniestro
            </p>
          </div>
          <MapPicker value={coords} onChange={setCoords} />
          {!coords && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{
                background: "hsl(45 93% 47% / 0.1)",
                border: "1px solid hsl(45 93% 47% / 0.25)",
              }}
            >
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" strokeWidth={2} />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Debes seleccionar una ubicación para continuar
              </p>
            </div>
          )}
          <Button
            size="lg"
            className="w-full rounded-2xl h-13 font-semibold"
            style={{ height: "3.25rem" }}
            disabled={!canProceedStep1}
            onClick={() => setStep(2)}
          >
            Continuar a Detalles
          </Button>
        </div>
      )}

      {/* ── Step 2: Details ── */}
      {step === 2 && (
        <div className="space-y-5 animate-[slide-up_0.25s_ease-out]">
          <div>
            <h2 className="font-bold text-xl">Detalles del Siniestro</h2>
            <p className="text-sm text-[--color-muted-foreground] mt-1">
              Describe lo que observas con la mayor precisión posible
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-semibold">Tipo de Incendio</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forest">🌳 Forestal</SelectItem>
                  <SelectItem value="urban">🏙️ Urbano</SelectItem>
                  <SelectItem value="industrial">🏭 Industrial</SelectItem>
                  <SelectItem value="grassland">🌾 Pastizal</SelectItem>
                  <SelectItem value="other">❓ Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Baja</SelectItem>
                  <SelectItem value="medium">🟡 Media</SelectItem>
                  <SelectItem value="high">🟠 Alta</SelectItem>
                  <SelectItem value="critical">🔴 Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Descripción</Label>
            <Textarea
              placeholder="Describe la situación: tamaño aproximado, dirección del viento, acceso al lugar, estructuras cercanas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[110px] resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-[--color-muted-foreground]">
                Mín. 10 caracteres
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  description.length >= 10
                    ? "text-green-600 dark:text-green-400"
                    : "text-[--color-muted-foreground]"
                )}
              >
                {description.length} caracteres
              </p>
            </div>
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Fotografía del incendio{" "}
              <span className="text-[--color-destructive] font-normal text-xs">(requerida)</span>
            </Label>
            {imagePreview ? (
              <div className="relative group/photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Previsualización"
                  className="w-full h-44 object-cover rounded-2xl border border-[--color-border]"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover/photo:bg-black/20 transition-colors" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-lg"
                  aria-label="Quitar foto"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    Foto agregada
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all duration-200",
                  "text-[--color-muted-foreground] border-[--color-border]",
                  "hover:border-[--color-primary] hover:text-[--color-primary]",
                  "hover:bg-green-50 dark:hover:bg-green-950/10",
                  "active:scale-[0.98]"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[--color-secondary]">
                  <ImagePlus className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Agregar foto del incendio</p>
                  <p className="text-xs mt-0.5 opacity-75">
                    Toca para seleccionar o capturar
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-60">
                  <Camera className="h-3.5 w-3.5" />
                  <span>JPG, PNG, HEIC</span>
                </div>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-2xl"
              onClick={() => setStep(1)}
            >
              Atrás
            </Button>
            <Button
              size="lg"
              className="flex-1 rounded-2xl"
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Injured ── */}
      {step === 3 && (
        <div className="space-y-5 animate-[slide-up_0.25s_ease-out]">
          <div>
            <h2 className="font-bold text-xl">¿Hay Personas Heridas?</h2>
            <p className="text-sm text-[--color-muted-foreground] mt-1">
              Esta información ayuda a priorizar la respuesta de emergencia
            </p>
          </div>

          {/* Toggle card */}
          <div
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl border transition-colors duration-200",
              hasInjured
                ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                : "bg-[--color-card] border-[--color-border]"
            )}
          >
            <div className="space-y-0.5">
              <p className="font-semibold text-sm">
                {hasInjured ? "⚠️ Hay víctimas reportadas" : "Personas heridas o atrapadas"}
              </p>
              <p className="text-xs text-[--color-muted-foreground]">
                Activa si hay víctimas en el lugar
              </p>
            </div>
            <Switch
              checked={hasInjured}
              onCheckedChange={setHasInjured}
            />
          </div>

          {hasInjured && (
            <div className="space-y-2 animate-[slide-up_0.2s_ease-out]">
              <Label className="font-semibold">Descripción de heridos</Label>
              <Textarea
                placeholder="Número aproximado de personas, condición, ubicación exacta dentro del área..."
                value={injuredDetails}
                onChange={(e) => setInjuredDetails(e.target.value)}
                className="min-h-[90px] resize-none border-red-200 dark:border-red-800 focus:border-red-400"
              />
            </div>
          )}

          {/* Emergency reminder */}
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{
              background: "hsl(0 84.2% 60.2% / 0.08)",
              border: "1px solid hsl(0 84.2% 60.2% / 0.2)",
            }}
          >
            <Flame className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
              Si hay heridos graves, llama al{" "}
              <strong>171 (Bomberos)</strong> o{" "}
              <strong>911 (Emergencias)</strong> antes de enviar este reporte.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 dark:bg-red-950/30 dark:border-red-800 animate-[scale-in_0.2s_ease-out]">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-2xl"
              onClick={() => setStep(2)}
              disabled={isPending}
            >
              Atrás
            </Button>
            <Button
              size="lg"
              className="flex-1 rounded-2xl gap-2"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Reporte"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
