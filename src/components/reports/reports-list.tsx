"use client";

import Link from "next/link";
import {
 Flame, MapPin, Calendar, ChevronRight, Plus, Trees, Building2,
 Factory, Wheat, HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCoord } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";

const statusLabels: Record<string, string> = {
 pending: "Pendiente",
 "in progress": "En Progreso",
 done: "Resuelto",
};

const statusVariants: Record<string, "pending" | "progress" | "done"> = {
 pending: "pending",
 "in progress": "progress",
 done: "done",
};

const typeConfig: Record<
 string,
 { label: string; icon: React.ElementType; color: string }
> = {
 forest: { label: "Forestal", icon: Trees, color: "text-green-600" },
 urban: { label: "Urbano", icon: Building2, color: "text-blue-600" },
 industrial: { label: "Industrial", icon: Factory, color: "text-orange-600" },
 grassland: { label: "Pastizal", icon: Wheat, color: "text-yellow-600" },
 other: { label: "Otro", icon: HelpCircle, color: "text-slate-600" },
};

const priorityConfig: Record<
 string,
 { border: string; bar: string; bg: string; dot: string; label: string; badge: "critical" | "high" | "medium" | "low" }
> = {
 critical: {
 border: "border-l-red-500",
 bar: "bg-red-500",
 bg: "bg-red-50",
 dot: "bg-red-500",
 label: "Crítica",
 badge: "critical",
 },
 high: {
 border: "border-l-orange-500",
 bar: "bg-orange-500",
 bg: "bg-orange-50",
 dot: "bg-orange-500",
 label: "Alta",
 badge: "high",
 },
 medium: {
 border: "border-l-yellow-400",
 bar: "bg-yellow-400",
 bg: "bg-yellow-50",
 dot: "bg-yellow-400",
 label: "Media",
 badge: "medium",
 },
 low: {
 border: "border-l-slate-300",
 bar: "bg-slate-300",
 bg: "bg-slate-50",
 dot: "bg-slate-300",
 label: "Baja",
 badge: "low",
 },
};

export function ReportsList({ reports }: { reports: Report[] }) {
 if (reports.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-[fade-in_0.4s_ease-out]">
 <div
 className="flex h-24 w-24 items-center justify-center rounded-3xl"
 style={{ background: "var(--color-secondary)" }}
 >
 <Flame
 className="h-11 w-11 text-[--color-muted-foreground]"
 strokeWidth={1.25}
 />
 </div>
 <div className="space-y-2">
 <p className="font-bold text-lg">Sin reportes aún</p>
 <p className="text-sm text-[--color-muted-foreground] max-w-[240px] mx-auto leading-relaxed">
 Cuando reportes un incendio, aparecerá aquí con su estado y detalles.
 </p>
 </div>
 <Button asChild size="lg" className="rounded-xl gap-2 shadow-sm">
 <Link href="/dashboard/report">
 <Plus className="h-4 w-4" />
 Crear Primer Reporte
 </Link>
 </Button>
 </div>
 );
 }

 return (
 <div className="space-y-4 animate-[slide-up_0.3s_ease-out]">
 {/* List header */}
 <div className="flex items-center justify-between">
 <div>
 <p className="font-bold text-base">Tus reportes</p>
 <p className="text-xs text-[--color-muted-foreground] mt-0.5">
 {reports.length} reporte{reports.length !== 1 ? "s" : ""} registrado{reports.length !== 1 ? "s" : ""}
 </p>
 </div>
 <Button asChild size="sm" className="gap-1.5 h-9 px-4 rounded-xl">
 <Link href="/dashboard/report">
 <Plus className="h-3.5 w-3.5" />
 Nuevo
 </Link>
 </Button>
 </div>

 {/* Report cards */}
 <div className="space-y-3">
 {reports.map((report, i) => {
 const priority = priorityConfig[report.priority] ?? priorityConfig.low;
 const typeInfo = typeConfig[report.type] ?? typeConfig.other;
 const TypeIcon = typeInfo.icon;

 return (
 <div
 key={report.id}
 className={cn(
 "group rounded-2xl border border-[--color-border] bg-[--color-card] border-l-4 overflow-hidden",
 "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
 "animate-[slide-up_0.3s_ease-out]",
 priority.border
 )}
 style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
 >
 <div className="p-4 space-y-3">
 {/* Top row: type + status + priority */}
 <div className="flex items-start justify-between gap-2">
 <div className="flex items-center gap-2 flex-wrap">
 {/* Type badge with icon */}
 <div
 className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[--color-border]"
 style={{ background: "var(--color-secondary)" }}
 >
 <TypeIcon className={cn("h-3.5 w-3.5 flex-shrink-0", typeInfo.color)} strokeWidth={2} />
 <span>{typeInfo.label}</span>
 </div>

 <Badge variant={statusVariants[report.status]}>
 {statusLabels[report.status] ?? report.status}
 </Badge>
 </div>

 {/* Priority indicator */}
 <div className="flex items-center gap-1.5 flex-shrink-0">
 <Badge variant={priority.badge} className="text-[10px] px-2 py-0.5">
 {priority.label}
 </Badge>
 <ChevronRight
 className="h-4 w-4 text-[--color-muted-foreground] opacity-0 group-hover:opacity-100 transition-opacity"
 />
 </div>
 </div>

 {/* Description */}
 <p className="text-sm text-[--color-foreground] line-clamp-2 leading-relaxed">
 {report.description}
 </p>

 {/* Footer: location + date */}
 <div className="flex items-center justify-between gap-3 pt-1 border-t border-[--color-border]">
 <span className="flex items-center gap-1.5 text-xs text-[--color-muted-foreground]">
 <MapPin className="h-3.5 w-3.5 text-[--color-primary] flex-shrink-0" />
 <span className="font-mono text-[11px]">
 {formatCoord(report.latitude)}, {formatCoord(report.longitude)}
 </span>
 </span>
 <span className="flex items-center gap-1.5 text-xs text-[--color-muted-foreground] flex-shrink-0">
 <Calendar className="h-3 w-3" />
 {formatDate(report.created_at)}
 </span>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}
