import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import { AdminReportsList } from "@/components/admin/admin-reports-list";

export const metadata = { title: "Gestión de Reportes — Valencia Verde" };

const PAGE_SIZE = 10;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q = "", page = "1" } = await searchParams;

  const query = Array.isArray(q) ? q[0] : q;
  const currentPage = Math.max(1, parseInt(Array.isArray(page) ? page[0] : page, 10) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServiceClient();

  // Build the query
  let dbQuery = supabase
    .from("reports")
    .select("*, users(first_name, last_name, national_id)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    // Search by description, type, or status
    dbQuery = dbQuery.or(
      `description.ilike.%${query}%,type.ilike.%${query}%,status.ilike.%${query}%`
    );
  }

  const { data: reports, count } = await dbQuery;

  return (
    <div>
      <TopBar title="Gestión de Reportes" />
      <div className="p-4 lg:p-6 max-w-6xl">
        <AdminReportsList
          reports={reports ?? []}
          totalCount={count ?? 0}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}
