"use client";

import { useState, useTransition, useActionState } from "react";
import { Plus, Pencil, Trash2, Phone, Loader2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SearchBar } from "@/components/admin/search-bar";
import { Pagination } from "@/components/admin/pagination";
import {
  createContact,
  updateContact,
  deleteContact,
} from "@/app/admin/(panel)/contacts/actions";
import type { Contact } from "@/types";

type ActionState = { error?: string; success?: boolean } | null;

/* ─── Contact form ────────────────────────────────────────────────────────── */

function ContactForm({
  contact,
  onClose,
}: {
  contact?: Contact;
  onClose: () => void;
}) {
  const action = contact ? updateContact : createContact;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_, fd) => {
      const result = await action(fd);
      if (result.success) onClose();
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {contact && <input type="hidden" name="id" value={contact.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre / Organismo</Label>
        <Input
          id="name"
          name="name"
          defaultValue={contact?.name}
          placeholder="Bomberos Valencia"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Número de Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={contact?.phone}
          placeholder="0241-123-4567"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input
          id="description"
          name="description"
          defaultValue={contact?.description}
          placeholder="Emergencias 24h"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-[--color-destructive]">{state.error}</p>
      )}

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : contact ? (
            "Guardar Cambios"
          ) : (
            "Crear Contacto"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

interface AdminContactsListProps {
  contacts: Contact[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function AdminContactsList({
  contacts,
  totalCount,
  currentPage,
  pageSize,
}: AdminContactsListProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      await deleteContact(deleting.id);
      setDeleting(null);
    });
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-5">
        <SearchBar
          placeholder="Buscar por nombre o teléfono…"
          paramName="q"
          className="max-w-xs"
        />
        <p className="hidden sm:block text-xs text-[--color-muted-foreground] shrink-0">
          {totalCount} contacto{totalCount !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onClick={() => setShowCreate(true)} className="ml-auto shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </Button>
      </div>

      {/* ── Empty state ── */}
      {contacts.length === 0 && totalCount === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[--color-secondary]">
            <Phone className="h-6 w-6 text-[--color-muted-foreground]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-[--color-foreground]">
            Sin contactos
          </p>
          <p className="mt-1 text-xs text-[--color-muted-foreground]">
            Agrega el primer contacto de emergencia
          </p>
          <Button
            size="sm"
            className="mt-4"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Agregar Contacto
          </Button>
        </div>
      )}

      {contacts.length === 0 && totalCount > 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[--color-secondary]">
            <Phone className="h-6 w-6 text-[--color-muted-foreground]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-[--color-foreground]">Sin resultados</p>
          <p className="mt-1 text-xs text-[--color-muted-foreground]">
            Intenta ajustar la búsqueda
          </p>
        </div>
      )}

      {contacts.length > 0 && (
        <>
          {/* ── Desktop table ── */}
          <div className="hidden sm:block rounded-2xl border border-[--color-border] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-secondary]/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[--color-muted-foreground] uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border] bg-[--color-card]">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="group hover:bg-[--color-secondary]/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-primary]/10 flex-shrink-0">
                          <PhoneCall
                            className="h-3.5 w-3.5 text-[--color-primary]"
                            strokeWidth={1.75}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {contact.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[--color-foreground]">
                        {contact.phone}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[--color-muted-foreground] max-w-xs truncate">
                      {contact.description || (
                        <span className="italic opacity-50">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(contact)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[--color-muted-foreground] hover:bg-[--color-secondary] hover:text-[--color-foreground] transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleting(contact)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[--color-muted-foreground] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="sm:hidden space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-2xl border border-[--color-border] bg-[--color-card] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[--color-primary]/10 flex-shrink-0">
                    <PhoneCall
                      className="h-5 w-5 text-[--color-primary]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs font-mono text-[--color-muted-foreground]">
                      {contact.phone}
                    </p>
                    {contact.description && (
                      <p className="text-xs text-[--color-muted-foreground] mt-0.5">
                        {contact.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(contact)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[--color-muted-foreground] hover:bg-[--color-secondary] hover:text-[--color-foreground] transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleting(contact)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[--color-muted-foreground] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

      {/* ── Create dialog ── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Contacto</DialogTitle>
          </DialogHeader>
          <ContactForm onClose={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contacto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ContactForm
              contact={editing}
              onClose={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Contacto</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[--color-muted-foreground]">
            ¿Seguro que deseas eliminar{" "}
            <span className="font-semibold text-[--color-foreground]">
              {deleting?.name}
            </span>
            ? Esta acción no se puede deshacer.
          </p>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
