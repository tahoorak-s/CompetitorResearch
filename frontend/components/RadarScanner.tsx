"use client";

import { motion } from "framer-motion";
import { Plus, Trash2, Wifi } from "lucide-react";
import { useState } from "react";
import { PixelButton } from "@/components/PixelButton";

export type Competitor = {
  id: number;
  name: string;
  url: string;
  status: "monitoring" | "queued" | "alert";
  x: number;
  y: number;
};

const initialCompetitors: Competitor[] = [
  { id: 1, name: "OpenAI", url: "https://openai.com", status: "alert", x: 62, y: 32 },
  { id: 2, name: "Anthropic", url: "https://anthropic.com", status: "monitoring", x: 34, y: 52 },
  { id: 3, name: "Google AI", url: "https://ai.google", status: "monitoring", x: 71, y: 69 },
  { id: 4, name: "Perplexity", url: "https://perplexity.ai", status: "queued", x: 43, y: 25 }
];

export function RadarScanner() {
  const [competitors, setCompetitors] = useState(initialCompetitors);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  function addCompetitor() {
    if (!name.trim() || !url.trim()) return;
    setCompetitors((items) => [
      ...items,
      {
        id: Date.now(),
        name,
        url,
        status: "queued",
        x: 24 + Math.random() * 52,
        y: 22 + Math.random() * 56
      }
    ]);
    setName("");
    setUrl("");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="relative min-h-[420px] overflow-hidden border-2 border-arcade-green bg-black shadow-[0_0_34px_rgba(0,255,136,.25)]">
        <div className="absolute inset-6 rounded-full border border-arcade-green/40" />
        <div className="absolute inset-20 rounded-full border border-arcade-green/30" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-arcade-green/25" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-arcade-green/25" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[620px] w-1 origin-top bg-gradient-to-b from-arcade-green via-arcade-green/40 to-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 border-2 border-arcade-cyan bg-arcade-cyan/10"
          animate={{ scale: [1, 1.28, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <Wifi className="m-auto mt-3 text-arcade-cyan" />
        </motion.div>
        {competitors.map((competitor) => (
          <motion.div
            key={competitor.id}
            className="absolute"
            style={{ left: `${competitor.x}%`, top: `${competitor.y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <span className={`block h-4 w-4 border-2 ${competitor.status === "alert" ? "border-arcade-pink bg-arcade-pink" : "border-arcade-cyan bg-arcade-cyan"} shadow-[0_0_18px_currentColor]`} />
            <span className="mt-2 block whitespace-nowrap bg-black px-2 font-terminal text-xl text-white">{competitor.name}</span>
          </motion.div>
        ))}
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="font-pixel text-[9px] text-arcade-cyan">COMPETITOR</span>
          <input className="mt-2 w-full border-2 border-arcade-cyan bg-black px-3 py-3 font-terminal text-2xl text-white outline-none focus:border-arcade-yellow" value={name} onChange={(event) => setName(event.target.value)} placeholder="New rival" />
        </label>
        <label className="block">
          <span className="font-pixel text-[9px] text-arcade-cyan">WEBSITE URL</span>
          <input className="mt-2 w-full border-2 border-arcade-cyan bg-black px-3 py-3 font-terminal text-2xl text-white outline-none focus:border-arcade-yellow" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://rival.dev" />
        </label>
        <PixelButton onClick={addCompetitor} className="w-full">
          <Plus size={16} /> Add Competitor
        </PixelButton>
        <div className="max-h-52 space-y-2 overflow-auto pr-1">
          {competitors.map((competitor) => (
            <div key={competitor.id} className="flex items-center justify-between border border-slate-800 bg-slate-950 px-3 py-2">
              <div>
                <p className="font-terminal text-2xl text-white">{competitor.name}</p>
                <p className="text-lg uppercase text-arcade-green">{competitor.status}</p>
              </div>
              <button aria-label={`Remove ${competitor.name}`} className="text-arcade-pink hover:text-white" onClick={() => setCompetitors((items) => items.filter((item) => item.id !== competitor.id))}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

