// scripts/clear.js
// Wipe all seed data from the Valencia Verde Supabase database.
// The admin user (id: 13024a48-7027-4abc-821e-8364433d040b) is preserved.
// Usage: node scripts/clear.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zaecnvkwbinuyqsxlpew.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZWNudmt3YmludXlxc3hscGV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc1NTYzMywiZXhwIjoyMDk0MzMxNjMzfQ.4t4qH79-m_n4dTp_yFmblQIHqMbYGRbw8dxYXLiU-gM';

const ADMIN_ID = '13024a48-7027-4abc-821e-8364433d040b';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fetch all auth users except the admin, handling Supabase pagination. */
async function listNonAdminAuthUsers() {
  const ids = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw new Error(`Failed to list auth users: ${error.message}`);

    const users = data?.users ?? [];
    for (const u of users) {
      if (u.id !== ADMIN_ID) ids.push(u.id);
    }

    // Supabase returns fewer items than perPage when we've reached the last page
    if (users.length < perPage) break;
    page++;
  }

  return ids;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function clearReports() {
  console.log('\n[1/4] Deleting all reports …');
  const { error, count } = await supabase
    .from('reports')
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // match-all guard

  if (error) throw new Error(`Failed to delete reports: ${error.message}`);
  console.log(`  Deleted ${count ?? 'all'} report(s).`);
}

async function clearContacts() {
  console.log('\n[2/4] Deleting all contacts …');
  const { error, count } = await supabase
    .from('contacts')
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // match-all guard

  if (error) throw new Error(`Failed to delete contacts: ${error.message}`);
  console.log(`  Deleted ${count ?? 'all'} contact(s).`);
}

async function clearPublicUsers() {
  console.log('\n[3/4] Deleting non-admin rows from public.users …');
  const { error, count } = await supabase
    .from('users')
    .delete({ count: 'exact' })
    .neq('id', ADMIN_ID);

  if (error) throw new Error(`Failed to delete public users: ${error.message}`);
  console.log(`  Deleted ${count ?? 'unknown'} public user row(s).`);
}

async function clearAuthUsers() {
  console.log('\n[4/4] Deleting non-admin auth users …');

  const ids = await listNonAdminAuthUsers();
  console.log(`  Found ${ids.length} auth user(s) to delete.`);

  let deleted = 0;
  let failed = 0;

  for (const id of ids) {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      console.warn(`  [warn] Could not delete auth user ${id}: ${error.message}`);
      failed++;
    } else {
      deleted++;
    }
  }

  console.log(`  Deleted: ${deleted}  |  Failed: ${failed}`);
}

(async () => {
  console.log('Starting database clear (admin user will be preserved) …');
  try {
    await clearReports();
    await clearContacts();
    await clearPublicUsers();
    await clearAuthUsers();
    console.log('\nDatabase cleared successfully.\n');
  } catch (err) {
    console.error('\nClear failed:', err.message);
    process.exit(1);
  }
})();
