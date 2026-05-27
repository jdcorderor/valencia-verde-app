import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import { AdminContactsList } from "@/components/admin/admin-contacts-list";

export const metadata = { title: "Gestión de Contactos — Valencia Verde" };

const PAGE_SIZE = 10;

export default async function AdminContactsPage({
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
    .from("contacts")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to);

  if (query) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query}%,phone.ilike.%${query}%`
    );
  }

  const { data: contacts, count } = await dbQuery;

  return (
    <div>
      <TopBar title="Gestión de Contactos" />
      <div className="p-4 lg:p-6 max-w-4xl">
        <AdminContactsList
          contacts={contacts ?? []}
          totalCount={count ?? 0}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}
