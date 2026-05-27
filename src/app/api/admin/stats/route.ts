import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/api-auth";

export async function GET() {
  const { error, supabase } = await requireAdminUser();
  if (error) return error;

  const [
    { count: totalReports },
    { count: pendingReports },
    { count: inProgressReports },
    { count: doneReports },
    { count: totalUsers },
    { data: recentReports },
  ] = await Promise.all([
    supabase.from("reports").select("*", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "in progress"),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "done"),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select("id, type, priority, status, description, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    totalReports: totalReports ?? 0,
    pendingReports: pendingReports ?? 0,
    inProgressReports: inProgressReports ?? 0,
    doneReports: doneReports ?? 0,
    totalUsers: totalUsers ?? 0,
    recentReports: recentReports ?? [],
  });
}
