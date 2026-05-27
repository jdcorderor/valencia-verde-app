import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[--color-background]">
      <AdminSidebar />
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
