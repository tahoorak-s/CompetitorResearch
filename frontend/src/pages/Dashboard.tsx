import { Activity, Building2, Newspaper, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";

type DashboardData = {
  total_competitors: number;
  recent_updates: number;
  latest_news: number;
  active_trends: number;
  timeline: { date: string; changes: number }[];
};

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);
  const cards: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Competitors", value: data?.total_competitors ?? 0, icon: Building2 },
    { label: "Recent updates", value: data?.recent_updates ?? 0, icon: Activity },
    { label: "News mentions", value: data?.latest_news ?? 0, icon: Newspaper },
    { label: "Active trends", value: data?.active_trends ?? 0, icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <section key={label} className="card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <Icon className="text-brand" size={18} />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
          </section>
        ))}
      </div>
      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">Activity timeline</h2>
            <p className="text-sm text-slate-500">Detected competitor changes over time</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.timeline ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="changes" stroke="#2563eb" fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
