import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api";

type Report = { id: number; title: string; report_type: string; file_path: string; created_at: string };

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const load = () => api.get("/reports").then((res) => setReports(res.data));
  useEffect(() => {
    void load();
  }, []);
  async function create(type: "pdf" | "csv") {
    await api.post(`/reports?report_type=${type}`);
    load();
  }
  return (
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950 dark:text-white">Reports</h2>
          <p className="text-sm text-slate-500">Professional exports for stakeholders and portfolio demos</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => create("csv")}><FileSpreadsheet size={16} /> CSV</button>
          <button className="btn-primary" onClick={() => create("pdf")}><FileText size={16} /> PDF</button>
        </div>
      </div>
      <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-950 dark:text-white">{report.title}</p>
              <p className="text-sm text-slate-500">{report.report_type.toUpperCase()} · {new Date(report.created_at).toLocaleString()}</p>
            </div>
            <a className="btn-secondary" href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/reports/${report.id}/download`}><Download size={16} /> Download</a>
          </div>
        ))}
      </div>
    </section>
  );
}
