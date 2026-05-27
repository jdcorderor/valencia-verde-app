"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
 Menu, X, Flame, PlusCircle, FileText, Phone, User, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";
import type { LucideIcon } from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon; description: string }[] = [
 { href: "/dashboard/report", label: "Nuevo Reporte", icon: PlusCircle, description: "Reportar un incendio" },
 { href: "/dashboard/reports", label: "Mis Reportes", icon: FileText, description: "Ver tu historial" },
 { href: "/dashboard/contacts", label: "Contactos de Emergencia", icon: Phone, description: "Números de emergencia" },
 { href: "/dashboard/profile", label: "Mi Perfil", icon: User, description: "Tu información" },
];

export function TopBar({ title }: { title: string }) {
 const [open, setOpen] = useState(false);
 const pathname = usePathname();

 return (
 <>
 {/* ── Header bar ── */}
 <header
 className="sticky top-0 z-[900] flex h-14 items-center border-b border-[--color-border] px-4 lg:px-6 gap-3"
 style={{ background: "var(--color-background)" }}
 >
 {/* Hamburger — mobile only */}
 <button
 onClick={() => setOpen(true)}
 className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[--color-accent] transition-colors lg:hidden flex-shrink-0"
 aria-label="Abrir menú"
 >
 <Menu className="h-5 w-5" />
 </button>

 {/* Title */}
 <h1 className="flex-1 font-bold text-base tracking-tight">{title}</h1>
 </header>

 {/* ── Backdrop ── */}
 <div
 onClick={() => setOpen(false)}
 className={cn(
 "fixed inset-0 z-[1000] bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
 open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
 )}
 />

 {/* ── Drawer ── */}
 <aside
 className={cn(
 "fixed inset-y-0 left-0 z-[1001] w-72 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
 open ? "translate-x-0" : "-translate-x-full"
 )}
 style={{ background: "var(--color-card)" }}
 >
 {/* Drawer header */}
 <div
 className="flex items-center justify-between px-5 border-b border-[--color-border] flex-shrink-0"
 style={{ height: "4rem" }}
 >
 <div className="flex items-center gap-3">
 <div
 className="flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0"
 style={{
 background:
 "linear-gradient(135deg, hsl(142.1 76.2% 28%), hsl(155 60% 40%))",
 }}
 >
 <Flame className="h-4 w-4 text-white" strokeWidth={2.5} />
 </div>
 <span className="font-bold text-sm">Valencia Verde</span>
 </div>
 <button
 onClick={() => setOpen(false)}
 className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-[--color-accent] transition-colors"
 aria-label="Cerrar menú"
 >
 <X className="h-4 w-4" />
 </button>
 </div>

 {/* Section label */}
 <div className="px-5 pt-4 pb-1">
 <p className="text-[10px] font-semibold uppercase tracking-widest text-[--color-muted-foreground]">
 Navegación
 </p>
 </div>

 {/* Nav items */}
 <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-3">
 {navItems.map(({ href, label, icon: Icon, description }) => {
 const active = pathname === href || pathname.startsWith(href + "/");
 return (
 <Link
 key={href}
 href={href}
 onClick={() => setOpen(false)}
 className={cn(
 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
 active
 ? "bg-green-100 text-[--color-primary]"
 : "text-[--color-muted-foreground] hover:[background:var(--color-accent)] hover:text-[--color-foreground]"
 )}
 >
 <div
 className={cn(
 "flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 transition-colors",
 active
 ? "bg-[--color-primary]/15"
 : "bg-[--color-secondary]"
 )}
 >
 <Icon
 className={cn("h-4 w-4", active ? "text-[--color-primary]" : "")}
 strokeWidth={active ? 2.5 : 1.75}
 />
 </div>
 <div className="flex-1 min-w-0">
 <p className={cn("leading-tight", active && "font-semibold")}>{label}</p>
 <p className="text-[11px] text-[--color-muted-foreground] leading-tight mt-0.5">
 {description}
 </p>
 </div>
 {active && (
 <span className="h-1.5 w-1.5 rounded-full bg-[--color-primary] flex-shrink-0" />
 )}
 </Link>
 );
 })}
 </nav>

 {/* Sign out */}
 <div className="flex-shrink-0 p-3 border-t border-[--color-border]">
 <form action={signOut}>
 <button
 type="submit"
 className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[--color-muted-foreground] hover:text-red-600 hover:bg-red-50 transition-all"
 >
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-secondary] flex-shrink-0">
 <LogOut className="h-4 w-4" strokeWidth={1.75} />
 </div>
 <div>
 <p className="leading-tight">Cerrar Sesión</p>
 <p className="text-[11px] text-[--color-muted-foreground] leading-tight mt-0.5">
 Salir de tu cuenta
 </p>
 </div>
 </button>
 </form>
 </div>
 </aside>
 </>
 );
}
