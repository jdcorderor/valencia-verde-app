import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const service = createServiceClient();
    const { data } = await service
      .from("users")
      .select("first_name, last_name, national_id, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-[--color-background]">
      <Sidebar profile={profile} />
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <main>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
