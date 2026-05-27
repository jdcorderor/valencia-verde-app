"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Buscar…",
  paramName = "q",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = searchParams.get(paramName) ?? "";

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = current;
    }
  }, [current]);

  const navigate = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    // Reset page when searching
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate(e.target.value.trim()), 400);
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    navigate("");
  };

  return (
    <div className={cn("relative flex-1 min-w-0", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        {isPending ? (
          <Loader2 className="h-4 w-4 text-[--color-muted-foreground] animate-spin" />
        ) : (
          <Search className="h-4 w-4 text-[--color-muted-foreground]" />
        )}
      </div>
      <input
        ref={inputRef}
        type="search"
        defaultValue={current}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-[--color-border] bg-[--color-background] pl-9 pr-8 text-sm text-[--color-foreground] placeholder:text-[--color-muted-foreground] focus:outline-none focus:ring-2 focus:ring-[--color-ring] focus:ring-offset-0 transition-all"
      />
      {current && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-2 flex items-center px-1 text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
