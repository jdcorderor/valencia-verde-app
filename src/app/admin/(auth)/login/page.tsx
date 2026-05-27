import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata = {
  title: "Admin — Valencia Verde",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[--color-background]">
      <AdminLoginForm />
    </main>
  );
}
