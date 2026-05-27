"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { adminSignIn } from "@/app/admin/actions";

type ActionState = { error?: string } | null;

async function adminSignInAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
 return adminSignIn(formData);
}

export function AdminLoginForm() {
 const [state, action, pending] = useActionState<ActionState, FormData>(
 adminSignInAction,
 null
 );
 const [showPassword, setShowPassword] = useState(false);

 return (
 <div className="w-full max-w-sm space-y-6 animate-[fade-in_0.4s_ease-out]">
 <div className="flex flex-col items-center gap-3">
 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
 <ShieldCheck className="h-7 w-7 text-white" strokeWidth={2} />
 </div>
 <div className="text-center">
 <h1 className="text-2xl font-bold tracking-tight">
 Panel Administrativo
 </h1>
 <p className="text-sm text-[--color-muted-foreground]">
 Valencia Verde
 </p>
 </div>
 </div>

 <Card className="shadow-sm">
 <CardHeader className="pb-4">
 <CardTitle className="text-base">Acceso Restringido</CardTitle>
 <CardDescription>Solo para personal autorizado</CardDescription>
 </CardHeader>
 <CardContent>
 <form action={action} className="space-y-4">
 <div className="space-y-2">
 <Label htmlFor="email">Correo Electrónico</Label>
 <Input
 id="email"
 name="email"
 type="email"
 autoComplete="email"
 placeholder="admin@valenciaVerde.gob.ve"
 required
 autoFocus
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="password">Contraseña</Label>
 <div className="relative">
 <Input
 id="password"
 name="password"
 type={showPassword ? "text" : "password"}
 autoComplete="current-password"
 required
 className="pr-10"
 />
 <button
 type="button"
 onClick={() => setShowPassword((v) => !v)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors"
 tabIndex={-1}
 >
 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </button>
 </div>
 </div>

 {state?.error && (
 <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
 <p className="text-sm text-red-700">
 {state.error}
 </p>
 </div>
 )}

 <Button
 type="submit"
 size="lg"
 className="w-full bg-slate-900 hover:bg-slate-800"
 disabled={pending}
 >
 {pending ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" />
 Autenticando...
 </>
 ) : (
 "Ingresar al Panel"
 )}
 </Button>
 </form>
 </CardContent>
 </Card>

 <Link
 href="/auth/login"
 className="flex items-center justify-center gap-1.5 text-sm text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors"
 >
 <ArrowLeft className="h-4 w-4" />
 Volver al inicio de sesión
 </Link>
 </div>
 );
}
