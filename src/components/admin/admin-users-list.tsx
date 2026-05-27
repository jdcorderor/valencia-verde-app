"use client";

import { useTransition } from "react";
import {
  User,
  ShieldCheck,
  UserX,
  UserCheck,
  Crown,
  UserMinus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-bar";
import { Pagination } from "@/components/admin/pagination";
import {
  toggleUserStatus,
  updateUserRole,
} from "@/app/admin/(panel)/users/actions";
import { formatDate } from "@/lib/utils";
import type { User as UserType } from "@/types";

interface AdminUsersListProps {
  users: UserType[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function AdminUsersList({
  users,
  totalCount,
  currentPage,
  pageSize,
}: AdminUsersListProps) {
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleToggle = (userId: string, disabled: boolean) => {
    startTransition(async () => {
      await toggleUserStatus(userId, disabled);
    });
  };

  const handleRole = (userId: string, role: "user" | "admin") => {
    startTransition(async () => {
      await updateUserRole(userId, role);
    });
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5">
        <SearchBar
          placeholder="Buscar por nombre, cédula o teléfono…"
          paramName="q"
          className="max-w-sm"
        />
        <p className="hidden sm:block text-xs text-[--color-muted-foreground] shrink-0">
          {totalCount} usuario{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Empty state ── */}
      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[--color-secondary]">
            <Users className="h-6 w-6 text-[--color-muted-foreground]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-[--color-foreground]">Sin resultados</p>
          <p className="mt-1 text-xs text-[--color-muted-foreground]">
            Intenta ajustar la búsqueda
          </p>
        </div>
      )}

      {users.length > 0 && (
        <>
          {/* ── Desktop table ── */}
          <div className="hidden md:block rounded-2xl border border-[--color-border] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-secondary]/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Cédula
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border] bg-[--color-card]">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`group hover:bg-[--color-secondary]/40 transition-colors ${user.disabled ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[--color-secondary] flex-shrink-0">
                          {user.role === "admin" ? (
                            <ShieldCheck
                              className="h-4 w-4 text-[--color-primary]"
                              strokeWidth={1.75}
                            />
                          ) : (
                            <User
                              className="h-4 w-4 text-[--color-muted-foreground]"
                              strokeWidth={1.75}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-[--color-muted-foreground]">
                            Desde {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[--color-foreground]">
                        V-{user.national_id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[--color-muted-foreground] font-mono">
                      {user.phone}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                      >
                        {user.role === "admin" ? "Admin" : "Usuario"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.disabled ? "destructive" : "done"}
                      >
                        {user.disabled ? "Inhabilitado" : "Activo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleToggle(user.id, !user.disabled)}
                          className="h-7 px-2.5 text-xs gap-1.5"
                          title={user.disabled ? "Habilitar usuario" : "Inhabilitar usuario"}
                        >
                          {user.disabled ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Habilitar</span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Inhabilitar</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            handleRole(
                              user.id,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                          className="h-7 px-2.5 text-xs gap-1.5"
                          title={
                            user.role === "admin"
                              ? "Quitar rol de admin"
                              : "Hacer administrador"
                          }
                        >
                          {user.role === "admin" ? (
                            <>
                              <UserMinus className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Quitar Admin</span>
                            </>
                          ) : (
                            <>
                              <Crown className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Hacer Admin</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="md:hidden space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`rounded-2xl border border-[--color-border] bg-[--color-card] p-4 ${user.disabled ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[--color-secondary] flex-shrink-0">
                    {user.role === "admin" ? (
                      <ShieldCheck
                        className="h-5 w-5 text-[--color-primary]"
                        strokeWidth={1.75}
                      />
                    ) : (
                      <User
                        className="h-5 w-5 text-[--color-muted-foreground]"
                        strokeWidth={1.75}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-medium text-sm">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-[--color-muted-foreground] font-mono mt-0.5">
                          V-{user.national_id} · {user.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={user.disabled ? "destructive" : "done"}
                        >
                          {user.disabled ? "Inhabilitado" : "Activo"}
                        </Badge>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "Admin" : "Usuario"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-[--color-muted-foreground] mt-1">
                      Registrado {formatDate(user.created_at)}
                    </p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleToggle(user.id, !user.disabled)}
                      >
                        {user.disabled ? "Habilitar" : "Inhabilitar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          handleRole(
                            user.id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                      >
                        {user.role === "admin" ? "Quitar Admin" : "Hacer Admin"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
    </>
  );
}
