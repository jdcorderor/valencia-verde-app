import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import { AdminUsersList } from "@/components/admin/admin-users-list";

export const metadata = { title: "Gestión de Usuarios — Valencia Verde" };

const PAGE_SIZE = 10;

export default async function AdminUsersPage({
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

  let dbQuery = supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    // Search by first_name, last_name, national_id, or phone
    dbQuery = dbQuery.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,national_id.ilike.%${query}%,phone.ilike.%${query}%`
    );
  }

  const { data: users, count } = await dbQuery;

  return (
    <div>
      <TopBar title="Gestión de Usuarios" />
      <div className="p-4 lg:p-6 max-w-6xl">
        <AdminUsersList
          users={users ?? []}
          totalCount={count ?? 0}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}
