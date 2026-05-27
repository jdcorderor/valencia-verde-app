"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Phone,
  Leaf,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    label: "Usuarios",
    icon: Users,
  },
  {
    href: "/admin/reports",
    label: "Reportes",
    icon: FileText,
  },
  {
    href: "/admin/contacts",
    label: "Contactos",
    icon: Phone,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-950 border-r border-slate-800/60">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-900/40 flex-shrink-0">
          <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-white leading-tight tracking-tight">
            Valencia Verde
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Panel de Administración
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Menú
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-emerald-600/20 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 transition-colors",
                  active
                    ? "bg-emerald-600/30 text-emerald-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
              >
                <Icon
                  className="h-4 w-4"
                  strokeWidth={active ? 2.25 : 1.75}
                />
              </span>
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="p-3 border-t border-slate-800/60">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-950/40 hover:text-red-400 transition-all duration-150 group"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 group-hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </span>
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
