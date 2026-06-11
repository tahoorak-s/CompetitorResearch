import { BarChart3, Building2, FileText, LayoutDashboard, LogOut, Moon, Newspaper, Search, Sparkles, Sun } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/competitors", label: "Competitors", icon: Building2 },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/search", label: "Search", icon: Search }
];

export function Layout({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-white">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">Competitor Intel</p>
            <p className="text-xs text-slate-500">Market signal OS</p>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${isActive ? "bg-blue-50 text-brand dark:bg-slate-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:px-8">
          <div>
            <p className="text-sm text-slate-500">Competitive monitoring workspace</p>
            <h1 className="text-lg font-semibold text-slate-950 dark:text-white">Competitor Intelligence Platform</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" title="Toggle dark mode" onClick={() => setDark((value) => !value)}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="btn-secondary" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

