"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Build page numbers with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-xs text-[--color-muted-foreground] tabular-nums">
        Mostrando{" "}
        <span className="font-medium text-[--color-foreground]">
          {from}–{to}
        </span>{" "}
        de{" "}
        <span className="font-medium text-[--color-foreground]">{totalItems}</span>
      </p>

      <div className={cn("flex items-center gap-1", isPending && "opacity-60 pointer-events-none")}>
        <button
          onClick={() => navigate(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--color-border] text-[--color-muted-foreground] hover:bg-[--color-accent] hover:text-[--color-foreground] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-[--color-muted-foreground]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                p === currentPage
                  ? "bg-[--color-primary] text-[--color-primary-foreground]"
                  : "border border-[--color-border] text-[--color-foreground] hover:bg-[--color-accent]"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--color-border] text-[--color-muted-foreground] hover:bg-[--color-accent] hover:text-[--color-foreground] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
