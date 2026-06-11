import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { api, Insight } from "../api";

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const load = () => api.get("/insights").then((res) => setInsights(res.data));
  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">AI analysis engine</h2>
          <p className="text-sm text-slate-500">Executive summaries, opportunities, trends, and SWOT-style signals</p>
        </div>
        <button className="btn-primary" onClick={async () => { await api.post("/insights/generate"); load(); }}><Sparkles size={16} /> Generate</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((item) => (
          <section key={item.id} className="card">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium uppercase text-brand dark:bg-slate-800">{item.insight_type}</span>
              <span className="text-sm text-slate-500">{item.confidence}% confidence</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
