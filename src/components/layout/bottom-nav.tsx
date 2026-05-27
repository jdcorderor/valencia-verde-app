"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Phone, User, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const sideItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard/reports",  label: "Reportes",  icon: FileText },
  { href: "/dashboard/contacts", label: "Contactos", icon: Phone    },
  { href: "/dashboard/profile",  label: "Perfil",    icon: User     },
];

export function BottomNav() {
  const pathname = usePathname();
  const isReportActive =
    pathname === "/dashboard/report" || pathname.startsWith("/dashboard/report/");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Blur backdrop */}
      <div
        className="relative flex items-end justify-around border-t border-[--color-border] px-1"
        style={{
          background: "var(--color-card)",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          paddingTop: "0.375rem",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left items */}
        {sideItems.slice(0, 2).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <NavItem key={href} href={href} label={label} icon={Icon} active={active} />
          );
        })}

        {/* Center FAB — Reportar */}
        <Link
          href="/dashboard/report"
          className="flex flex-col items-center gap-1 -mt-6 px-3"
          aria-label="Nuevo reporte"
        >
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200",
              "ring-4 ring-[--color-background]",
              isReportActive
                ? "scale-105 shadow-green-500/30"
                : "hover:opacity-90 active:scale-95"
            )}
            style={{
              background: isReportActive
                ? "linear-gradient(135deg, hsl(142.1 76.2% 30%) 0%, hsl(155 60% 42%) 100%)"
                : "linear-gradient(135deg, hsl(142.1 76.2% 34%) 0%, hsl(155 60% 44%) 100%)",
            }}
          >
            <Flame
              className="h-6 w-6 text-white drop-shadow-sm"
              strokeWidth={isReportActive ? 2.5 : 2}
            />
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold",
              isReportActive
                ? "text-[--color-primary]"
                : "text-[--color-muted-foreground]"
            )}
          >
            Reportar
          </span>
        </Link>

        {/* Right items */}
        {sideItems.slice(2).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <NavItem key={href} href={href} label={label} icon={Icon} active={active} />
          );
        })}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[56px]",
        active
          ? "text-[--color-primary]"
          : "text-[--color-muted-foreground] hover:text-[--color-foreground]"
      )}
    >
      <div className="relative">
        {active && (
          <span
            className="absolute inset-0 rounded-lg opacity-15"
            style={{ background: "var(--color-primary)" }}
          />
        )}
        <Icon
          className={cn(
            "h-5 w-5 transition-transform relative",
            active && "scale-110"
          )}
          strokeWidth={active ? 2.5 : 1.75}
        />
      </div>
      <span className={cn("text-[10px] font-medium leading-none", active && "font-semibold")}>
        {label}
      </span>
      {active && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-[--color-primary]"
        />
      )}
    </Link>
  );
}
