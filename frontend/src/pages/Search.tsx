import { Search as SearchIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { api } from "../api";

type SearchItem = {
  id?: number;
  title?: string;
  company_name?: string;
  summary?: string;
  description?: string;
  body?: string;
  industry?: string;
  report_type?: string;
};

export function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Record<string, SearchItem[]>>({});
  async function submit(event: FormEvent) {
    event.preventDefault();
    const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
    setResults(data);
  }
  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="card flex gap-3">
        <input className="input" placeholder="Search competitors, articles, updates, insights, reports" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary"><SearchIcon size={16} /> Search</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(results).map(([group, items]) => (
          <section className="card" key={group}>
            <h2 className="mb-3 font-semibold capitalize text-slate-950 dark:text-white">{group}</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
                  <p className="font-medium text-slate-950 dark:text-white">{item.title ?? item.company_name}</p>
                  <p className="mt-1 text-slate-500">{item.summary ?? item.description ?? item.body ?? item.industry ?? item.report_type}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
