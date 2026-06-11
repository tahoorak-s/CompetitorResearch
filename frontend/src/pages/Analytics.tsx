import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";

type AnalyticsData = {
  changes_over_time: { date: string; count: number }[];
  news_frequency: { date: string; count: number }[];
  change_categories: { name: string; value: number }[];
};

export function Analytics() {
  const [data, setData] = useState<AnalyticsData>();
  useEffect(() => { api.get("/analytics/activity").then((res) => setData(res.data)); }, []);
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card">
        <h2 className="font-semibold text-slate-950 dark:text-white">Change frequency</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.changes_over_time ?? []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#2563eb" /></BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="card">
        <h2 className="font-semibold text-slate-950 dark:text-white">Trend categories</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={data?.change_categories ?? []} dataKey="value" nameKey="name" outerRadius={110}>{(data?.change_categories ?? []).map((_, i) => <Cell key={i} fill={["#2563eb", "#10b981", "#f97316", "#64748b"][i % 4]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

