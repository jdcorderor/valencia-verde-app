"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  User,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/admin/search-bar";
import { Pagination } from "@/components/admin/pagination";
import { updateReportStatus } from "@/app/admin/(panel)/reports/actions";
import { formatDate, formatCoord } from "@/lib/utils";
import type { Report, ReportStatus } from "@/types";

/* ─── Labels / mappings ─────────────────────────────────────────────────── */

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

const typeLabels: Record<string, string> = {
  forest: "Forestal",
  urban: "Urbano",
  industrial: "Industrial",
  grassland: "Pastizal",
  other: "Otro",
};

const priorityVariants: Record<
  string,
  "critical" | "high" | "medium" | "low"
> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

const priorityLabels: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

const priorityDot: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-slate-400",
};

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface AdminReportsListProps {
  reports: Report[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function AdminReportsList({
  reports,
  totalCount,
  currentPage,
  pageSize,
}: AdminReportsListProps) {
  const [selected, setSelected] = useState<Report | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleStatusChange = (reportId: string, status: ReportStatus) => {
    startTransition(async () => {
      await updateReportStatus(reportId, status);
      if (selected?.id === reportId) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }
    });
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5">
        <SearchBar
          placeholder="Buscar por descripción, tipo o estado…"
          paramName="q"
          className="max-w-sm"
        />
        <p className="hidden sm:block text-xs text-[--color-muted-foreground] shrink-0">
          {totalCount} reporte{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Empty state ── */}
      {reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[--color-secondary]">
            <Filter className="h-6 w-6 text-[--color-muted-foreground]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-[--color-foreground]">Sin resultados</p>
          <p className="mt-1 text-xs text-[--color-muted-foreground]">
            Intenta ajustar la búsqueda
          </p>
        </div>
      )}

      {reports.length > 0 && (
        <>
          {/* ── Desktop table ── */}
          <div className="hidden md:block rounded-2xl border border-[--color-border] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-secondary]/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Reportado por
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border] bg-[--color-card]">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="group hover:bg-[--color-secondary]/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[--color-muted-foreground] whitespace-nowrap">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${priorityDot[report.priority] ?? "bg-slate-400"}`}
                        />
                        <span className="text-xs font-medium">
                          {typeLabels[report.type] ?? report.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityVariants[report.priority] ?? "low"}>
                        {priorityLabels[report.priority] ?? report.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={report.status}
                        onValueChange={(v) =>
                          handleStatusChange(report.id, v as ReportStatus)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-7 w-36 text-xs border-transparent hover:border-[--color-border] bg-transparent">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={statusVariants[report.status]}
                              className="pointer-events-none"
                            >
                              {statusLabels[report.status]}
                            </Badge>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="in progress">En Progreso</SelectItem>
                          <SelectItem value="done">Resuelto</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-xs text-[--color-muted-foreground]">
                      {report.users
                        ? `${report.users.first_name} ${report.users.last_name}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(report)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[--color-muted-foreground] hover:bg-[--color-secondary] hover:text-[--color-foreground] transition-colors"
                      >
                        Ver
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="md:hidden space-y-3">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelected(report)}
                className="w-full text-left rounded-2xl border border-[--color-border] bg-[--color-card] p-4 hover:shadow-sm active:scale-[0.99] transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={statusVariants[report.status]}>
                      {statusLabels[report.status]}
                    </Badge>
                    <Badge variant="outline">
                      {typeLabels[report.type] ?? report.type}
                    </Badge>
                    <Badge variant={priorityVariants[report.priority] ?? "low"}>
                      {priorityLabels[report.priority] ?? report.priority}
                    </Badge>
                    {report.has_injured && (
                      <Badge variant="critical">Con heridos</Badge>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-[--color-muted-foreground] flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-[--color-foreground] line-clamp-2 mb-2">
                  {report.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[--color-muted-foreground]">
                  {report.users && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {report.users.first_name} {report.users.last_name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.created_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Pagination ── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
          />
        </>
      )}

      {/* ── Detail dialog ── */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Reporte</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusVariants[selected.status]}>
                  {statusLabels[selected.status]}
                </Badge>
                <Badge variant="outline">
                  {typeLabels[selected.type] ?? selected.type}
                </Badge>
                <Badge variant={priorityVariants[selected.priority] ?? "low"}>
                  {priorityLabels[selected.priority] ?? selected.priority}
                </Badge>
                {selected.has_injured && (
                  <Badge variant="critical">Con heridos</Badge>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide mb-1">
                  Descripción
                </p>
                <p className="text-sm leading-relaxed">{selected.description}</p>
              </div>

              {selected.has_injured && selected.injured_details && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 dark:bg-red-950/30 dark:border-red-800">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                    Personas Heridas
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {selected.injured_details}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[--color-secondary] p-3">
                <div>
                  <p className="text-xs text-[--color-muted-foreground] mb-0.5">
                    Coordenadas
                  </p>
                  <p className="font-mono text-xs">
                    {formatCoord(selected.latitude)},{" "}
                    {formatCoord(selected.longitude)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[--color-muted-foreground] mb-0.5">
                    Fecha
                  </p>
                  <p className="text-xs">{formatDate(selected.created_at)}</p>
                </div>
                {selected.users && (
                  <div className="col-span-2">
                    <p className="text-xs text-[--color-muted-foreground] mb-0.5">
                      Reportado por
                    </p>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-[--color-muted-foreground]" />
                      <p className="text-xs">
                        {selected.users.first_name} {selected.users.last_name}{" "}
                        <span className="font-mono text-[--color-muted-foreground]">
                          (V-{selected.users.national_id})
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selected.image_url && (
                <div>
                  <p className="text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide mb-2">
                    Fotografía
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.image_url}
                    alt="Reporte"
                    className="w-full h-48 object-cover rounded-xl border border-[--color-border]"
                  />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide mb-2">
                  Actualizar estado
                </p>
                <Select
                  value={selected.status}
                  onValueChange={(v) =>
                    handleStatusChange(selected.id, v as ReportStatus)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in progress">En Progreso</SelectItem>
                    <SelectItem value="done">Resuelto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
