import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard Admin — Valencia Verde" };

type ReportUser = { first_name: string; last_name: string };

const statusVariants: Record<string, "pending" | "progress" | "done"> = {
  pending: "pending",
  "in progress": "progress",
  done: "done",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  "in progress": "En Progreso",
  done: "Resuelto",
};

const typeLabels: Record<string, string> = {
  forest: "Forestal",
  urban: "Urbano",
  industrial: "Industrial",
  grassland: "Pastizal",
  other: "Otro",
};

const priorityDot: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-400",
  low: "bg-slate-400",
};

const priorityLabels: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const [
    { count: totalReports },
    { count: pendingReports },
    { count: inProgressReports },
    { count: doneReports },
    { count: totalUsers },
    { data: recentReports },
  ] = await Promise.all([
    supabase.from("reports").select("*", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "in progress"),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "done"),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select(
        "id, type, priority, status, description, created_at, users(first_name, last_name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const total = totalReports ?? 0;
  const pending = pendingReports ?? 0;
  const inProgress = inProgressReports ?? 0;
  const done = doneReports ?? 0;
  const users = totalUsers ?? 0;

  const resolutionRate =
    total > 0 ? Math.round((done / total) * 100) : 0;

  const stats = [
    {
      label: "Total Reportes",
      value: total,
      icon: FileText,
      iconClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
      accent: "border-l-blue-500",
      sub: `${resolutionRate}% resueltos`,
    },
    {
      label: "Pendientes",
      value: pending,
      icon: Clock,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
      accent: "border-l-amber-500",
      sub: pending === 0 ? "Al día" : "Requieren atención",
    },
    {
      label: "En Progreso",
      value: inProgress,
      icon: Flame,
      iconClass: "text-orange-500",
      bgClass: "bg-orange-500/10",
      accent: "border-l-orange-500",
      sub: "Atención activa",
    },
    {
      label: "Resueltos",
      value: done,
      icon: CheckCircle2,
      iconClass: "text-green-500",
      bgClass: "bg-green-500/10",
      accent: "border-l-green-500",
      sub:
        total > 0 ? `${resolutionRate}% del total` : "Sin reportes aún",
    },
    {
      label: "Usuarios",
      value: users,
      icon: Users,
      iconClass: "text-purple-500",
      bgClass: "bg-purple-500/10",
      accent: "border-l-purple-500",
      sub: "Registrados",
    },
  ];

  return (
    <div>
      <TopBar title="Dashboard" />
      <div className="p-4 lg:p-6 space-y-6 max-w-6xl">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, value, icon: Icon, iconClass, bgClass, accent, sub }) => (
            <div
              key={label}
              className={`relative rounded-2xl border border-[--color-border] bg-[--color-card] p-4 border-l-4 ${accent} overflow-hidden`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgClass}`}>
                  <Icon className={`h-4.5 w-4.5 ${iconClass}`} strokeWidth={1.75} />
                </div>
                <TrendingUp className="h-3.5 w-3.5 text-[--color-muted-foreground] opacity-40" />
              </div>
              <p className="text-2xl font-bold tabular-nums text-[--color-foreground]">
                {value}
              </p>
              <p className="text-xs font-semibold text-[--color-foreground] mt-0.5 truncate">
                {label}
              </p>
              <p className="text-xs text-[--color-muted-foreground] mt-0.5 truncate">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Recent reports table ── */}
        <div className="rounded-2xl border border-[--color-border] bg-[--color-card] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[--color-border]">
            <div>
              <h2 className="text-sm font-semibold text-[--color-foreground]">
                Reportes Recientes
              </h2>
              <p className="text-xs text-[--color-muted-foreground] mt-0.5">
                Últimos 10 incidentes registrados
              </p>
            </div>
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1 text-xs font-medium text-[--color-primary] hover:opacity-80 transition-opacity"
            >
              Ver todos
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {!recentReports || recentReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText
                className="h-8 w-8 text-[--color-muted-foreground] mb-3 opacity-40"
                strokeWidth={1.5}
              />
              <p className="text-sm text-[--color-muted-foreground]">
                Sin reportes aún
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[--color-border] bg-[--color-secondary]/50">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                        Fecha
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                        Tipo
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                        Prioridad
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                        Estado
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                        Descripción
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                        Reportado por
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--color-border]">
                    {recentReports.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-[--color-secondary]/40 transition-colors"
                      >
                        <td className="px-5 py-3 text-xs text-[--color-muted-foreground] whitespace-nowrap">
                          {formatDate(r.created_at)}
                        </td>
                        <td className="px-5 py-3 text-xs font-medium">
                          {typeLabels[r.type] ?? r.type}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`h-2 w-2 rounded-full flex-shrink-0 ${priorityDot[r.priority] ?? "bg-slate-400"}`}
                            />
                            <span className="text-xs">
                              {priorityLabels[r.priority] ?? r.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={statusVariants[r.status]}>
                            {statusLabels[r.status]}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-xs text-[--color-foreground] max-w-xs">
                          <p className="truncate">{r.description}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-[--color-muted-foreground]">
                          {Array.isArray(r.users) && r.users[0]
                            ? `${(r.users[0] as ReportUser).first_name} ${(r.users[0] as ReportUser).last_name}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="md:hidden divide-y divide-[--color-border]">
                {recentReports.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 px-5 py-3">
                    <div
                      className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${priorityDot[r.priority] ?? "bg-slate-400"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant={statusVariants[r.status]}>
                          {statusLabels[r.status]}
                        </Badge>
                        <span className="text-xs text-[--color-muted-foreground]">
                          {typeLabels[r.type] ?? r.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        {r.description}
                      </p>
                      <p className="text-xs text-[--color-muted-foreground] mt-0.5">
                        {formatDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
