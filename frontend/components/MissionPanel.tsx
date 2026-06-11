"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const levels = [
  ["01", "Mission Control", "#mission-control"],
  ["02", "Rival Scanner", "#rival-scanner"],
  ["03", "Signals", "#signals"],
  ["04", "AI Terminal", "#ai-terminal"],
  ["05", "Report Forge", "#report-forge"]
] as const;

export function MissionPanel() {
  return (
    <aside className="sticky top-6 hidden h-fit min-w-72 lg:block">
      <div className="pixel-corners border-2 border-arcade-purple bg-black/80 p-4 shadow-[0_0_28px_rgba(139,92,246,.35)]">
        <p className="mb-4 font-pixel text-[10px] text-arcade-yellow">QUEST LOG</p>
        <nav aria-label="Mission levels" className="space-y-3">
          {levels.map(([level, label, href], index) => (
            <motion.a
              key={href}
              href={href}
              whileHover={{ x: 6 }}
              className={cn(
                "flex items-center gap-3 border-2 px-3 py-3 font-pixel text-[9px] transition",
                index === 0
                  ? "border-arcade-green bg-arcade-green/10 text-arcade-green shadow-[0_0_18px_rgba(0,255,136,.45)]"
                  : "border-slate-800 text-slate-400 hover:border-arcade-cyan hover:text-arcade-cyan"
              )}
            >
              <span>LVL {level}</span>
              <span>{label}</span>
            </motion.a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

