"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, FileText, Phone, User, Flame, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import type { LucideIcon } from "lucide-react";

interface SidebarProfile {
 first_name: string;
 last_name: string;
 national_id: string;
 role: string;
}

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
 { href: "/dashboard/report", label: "Nuevo Reporte", icon: PlusCircle },
 { href: "/dashboard/reports", label: "Mis Reportes", icon: FileText },
 { href: "/dashboard/contacts", label: "Contactos", icon: Phone },
 { href: "/dashboard/profile", label: "Mi Perfil", icon: User },
];

export function Sidebar({ profile }: { profile?: SidebarProfile | null }) {
 const pathname = usePathname();

 const initials = profile
 ? ((profile.first_name?.[0] ?? "") + (profile.last_name?.[0] ?? "")).toUpperCase() || "?"
 : "?";

 const displayName = profile
 ? `${profile.first_name} ${profile.last_name}`
 : "Cargando...";

 const isAdmin = profile?.role === "admin";

 return (
 <aside
 className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-[--color-border]"
 style={{ background: "var(--color-card)" }}
 >
 {/* Logo header */}
 <div className="flex items-center gap-3 px-5 py-5 border-b border-[--color-border]">
 <div
 className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm flex-shrink-0"
 style={{
 background:
 "linear-gradient(135deg, hsl(142.1 76.2% 28%) 0%, hsl(155 60% 40%) 100%)",
 }}
 >
 <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
 </div>
 <div className="min-w-0">
 <p className="font-bold text-sm leading-tight truncate">Valencia Verde</p>
 <p className="text-xs text-[--color-muted-foreground] truncate">
 Incendios Forestales
 </p>
 </div>
 </div>

 {/* Navigation */}
 <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
 {navItems.map(({ href, label, icon: Icon }) => {
 const active = pathname === href || pathname.startsWith(href + "/");
 return (
 <Link
 key={href}
 href={href}
 className={cn(
 "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
 active
 ? "bg-green-100 text-[--color-primary] font-semibold"
 : "text-[--color-muted-foreground] hover:[background:var(--color-accent)] hover:text-[--color-foreground]"
 )}
 >
 <div
 className={cn(
 "flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 transition-colors",
 active
 ? "bg-[--color-primary]/15"
 : "bg-transparent"
 )}
 >
 <Icon
 className={cn("h-4 w-4", active ? "text-[--color-primary]" : "")}
 strokeWidth={active ? 2.5 : 1.75}
 />
 </div>
 {label}
 {active && (
 <span
 className="ml-auto h-1.5 w-1.5 rounded-full bg-[--color-primary] flex-shrink-0"
 />
 )}
 </Link>
 );
 })}
 </nav>

 {/* User info + sign out */}
 <div className="p-3 border-t border-[--color-border] space-y-1">
 {/* User card */}
 <Link
 href="/dashboard/profile"
 className={cn(
 "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
 pathname.startsWith("/dashboard/profile")
 ? "bg-green-100"
 : "hover:[background:var(--color-accent)]"
 )}
 >
 <div
 className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold flex-shrink-0 shadow-sm"
 style={{
 background:
 "linear-gradient(135deg, hsl(142.1 76.2% 28%) 0%, hsl(155 60% 40%) 100%)",
 }}
 >
 {initials}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-semibold leading-tight truncate">{displayName}</p>
 <div className="flex items-center gap-1 mt-0.5">
 {isAdmin ? (
 <>
 <ShieldCheck className="h-3 w-3 text-[--color-primary] flex-shrink-0" strokeWidth={2} />
 <span className="text-[10px] text-[--color-primary] font-medium">Administrador</span>
 </>
 ) : (
 <span className="text-[10px] text-[--color-muted-foreground]">
 V-{profile?.national_id ?? "---"}
 </span>
 )}
 </div>
 </div>
 </Link>

 {/* Sign out */}
 <form action={signOut}>
 <Button
 type="submit"
 variant="ghost"
 className="w-full justify-start gap-3 text-[--color-muted-foreground] hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-3 text-sm"
 >
 <LogOut className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
 Cerrar Sesión
 </Button>
 </form>
 </div>
 </aside>
 );
}
