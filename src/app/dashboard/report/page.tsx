import { TopBar } from "@/components/layout/top-bar";
import { ReportWizard } from "@/components/reports/report-wizard";

export const metadata = { title: "Nuevo Reporte — Valencia Verde" };

export default function ReportPage() {
  return (
    <div>
      <TopBar title="Nuevo Reporte" />
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <ReportWizard />
      </div>
    </div>
  );
}
