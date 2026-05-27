import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import { ReportsList } from "@/components/reports/reports-list";

export const metadata = { title: "Mis Reportes — Valencia Verde" };

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const service = createServiceClient();
  const { data: reports } = await service
    .from("reports")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <TopBar title="Mis Reportes" />
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <ReportsList reports={reports ?? []} />
      </div>
    </div>
  );
}
