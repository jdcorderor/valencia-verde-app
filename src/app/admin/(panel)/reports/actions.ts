"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import type { ReportStatus } from "@/types";

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId);

  if (error) return { error: "Error al actualizar el estado." };

  revalidatePath("/admin/reports");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
