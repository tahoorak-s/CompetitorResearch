import { Plus, Radar, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api, Competitor } from "../api";

export function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [form, setForm] = useState({ company_name: "", website_url: "", industry: "", notes: "", scan_frequency: "weekly" });
  const load = () => api.get("/competitors").then((res) => setCompetitors(res.data));
  useEffect(() => {
    void load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/competitors", form);
    setForm({ company_name: "", website_url: "", industry: "", notes: "", scan_frequency: "weekly" });
    load();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <section className="card h-fit">
        <h2 className="font-semibold text-slate-950 dark:text-white">Add competitor</h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input className="input" placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
          <input className="input" placeholder="Website URL" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
          <input className="input" placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <select className="input" value={form.scan_frequency} onChange={(e) => setForm({ ...form, scan_frequency: e.target.value })}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button className="btn-primary w-full justify-center"><Plus size={16} /> Add competitor</button>
        </form>
      </section>
      <section className="card overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-950 dark:text-white">Monitored competitors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-3">Company</th><th>Industry</th><th>Schedule</th><th>Last scan</th><th></th></tr>
            </thead>
            <tbody>
              {competitors.map((item) => (
                <tr key={item.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-4 font-medium text-slate-950 dark:text-white">{item.company_name}<p className="font-normal text-slate-500">{item.website_url}</p></td>
                  <td>{item.industry}</td>
                  <td>{item.scan_frequency}</td>
                  <td>{item.last_scanned_at ? new Date(item.last_scanned_at).toLocaleDateString() : "Not scanned"}</td>
                  <td className="flex gap-2 py-4">
                    <button title="Run scan" className="btn-secondary" onClick={() => api.post(`/competitors/${item.id}/scan`)}><Radar size={16} /></button>
                    <button title="Delete" className="btn-secondary" onClick={async () => { await api.delete(`/competitors/${item.id}`); load(); }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
