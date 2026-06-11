"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Binary, Bot, Boxes, FileBarChart2, FileDown, Gem, RadioTower, ScrollText, ShieldCheck, Sparkles, Swords, Trophy } from "lucide-react";
import { MissionPanel } from "@/components/MissionPanel";
import { NotificationBadge } from "@/components/NotificationBadge";
import { PixelButton } from "@/components/PixelButton";
import { PixelCard } from "@/components/PixelCard";
import { RadarScanner } from "@/components/RadarScanner";
import { RetroTerminal } from "@/components/RetroTerminal";
import { StatCard } from "@/components/StatCard";
import { XPBar } from "@/components/XPBar";

const metrics = [
  { label: "Tracked Competitors", value: "04", icon: Swords, color: "cyan" as const },
  { label: "Alerts Today", value: "12", icon: AlertTriangle, color: "pink" as const },
  { label: "Changes Detected", value: "37", icon: RadioTower, color: "green" as const },
  { label: "Reports Generated", value: "09", icon: FileBarChart2, color: "yellow" as const }
];

const signals = [
  ["News Signals", 8, Sparkles, "New Anthropic enterprise partner mention"],
  ["SEO Changes", 4, Binary, "Perplexity ranking page refreshed"],
  ["Pricing Updates", 3, Gem, "OpenAI API packaging shifted"],
  ["Product Launches", 5, Boxes, "Google AI workspace release detected"],
  ["Social Activity", 11, Bot, "Spike in launch conversation velocity"]
] as const;

function FloatingPixels() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 bg-arcade-cyan"
          style={{ left: `${(index * 37) % 100}%`, top: `${(index * 19) % 88}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2.6 + (index % 4), repeat: Infinity, delay: index * 0.08 }}
        />
      ))}
      <motion.div className="absolute left-12 top-28 h-8 w-24 border-2 border-arcade-purple bg-arcade-purple/10" animate={{ x: [0, 24, 0] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div className="absolute right-20 top-36 h-6 w-20 border-2 border-arcade-pink bg-arcade-pink/10" animate={{ x: [0, -28, 0] }} transition={{ duration: 4.5, repeat: Infinity }} />
    </div>
  );
}

export default function MarketQuestPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-arcade-black text-white crt-grid">
      <FloatingPixels />
      <div className="relative mx-auto flex max-w-7xl gap-8 px-4 py-6 lg:px-8">
        <MissionPanel />
        <div className="w-full space-y-10">
          <motion.section
            id="hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="scanlines relative overflow-hidden pixel-corners border-4 border-arcade-cyan bg-black/88 p-5 shadow-pixel md:p-8"
          >
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
              <div className="border-2 border-arcade-yellow bg-black px-4 py-3">
                <p className="font-pixel text-[10px] text-arcade-yellow">XP: 1250</p>
                <p className="mt-2 font-terminal text-2xl text-arcade-green">Analyst Level 7</p>
              </div>
              <XPBar value={92} />
            </div>
            <div className="relative z-10 mx-auto flex min-h-[430px] max-w-5xl flex-col items-center justify-center text-center">
              <motion.p animate={{ opacity: [0.65, 1, 0.65] }} transition={{ duration: 1.8, repeat: Infinity }} className="mb-5 font-pixel text-[11px] text-arcade-green">
                INSERT MARKET DATA
              </motion.p>
              <h1 className="font-pixel text-3xl leading-relaxed text-arcade-yellow drop-shadow-[0_0_16px_rgba(255,215,0,.45)] md:text-5xl">
                2026 MARKET QUEST
              </h1>
              <p className="mt-6 font-pixel text-sm leading-8 text-arcade-cyan md:text-xl">Competitor Intelligence Platform</p>
              <p className="mt-7 max-w-2xl font-terminal text-3xl leading-none text-slate-200">
                Track rivals, decode signals, forge reports, and level up strategic decisions with AI-powered market reconnaissance.
              </p>
              <PixelButton className="mt-8 px-7 py-4 text-xs">
                <Trophy size={18} /> START MISSION
              </PixelButton>
            </div>
          </motion.section>

          <section id="mission-control" className="space-y-5">
            <div>
              <p className="font-pixel text-[10px] text-arcade-pink">LEVEL 01</p>
              <h2 className="mt-2 font-pixel text-xl text-white">Mission Control Dashboard</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <StatCard key={metric.label} {...metric} />
              ))}
            </div>
          </section>

          <section id="rival-scanner" className="space-y-5">
            <div>
              <p className="font-pixel text-[10px] text-arcade-green">LEVEL 02</p>
              <h2 className="mt-2 font-pixel text-xl text-white">Rival Scanner</h2>
            </div>
            <PixelCard glow="green">
              <RadarScanner />
            </PixelCard>
          </section>

          <section id="signals" className="space-y-5">
            <div>
              <p className="font-pixel text-[10px] text-arcade-cyan">LEVEL 03</p>
              <h2 className="mt-2 font-pixel text-xl text-white">Signal Detection Center</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {signals.map(([title, count, Icon, detail], index) => (
                <PixelCard key={title} glow={index % 2 ? "pink" : "cyan"} className="min-h-56">
                  <div className="flex items-start justify-between">
                    <Icon className="text-arcade-cyan" size={28} />
                    <NotificationBadge count={count} />
                  </div>
                  <h3 className="mt-6 font-pixel text-[11px] leading-6 text-white">{title}</h3>
                  <p className="mt-4 font-terminal text-2xl leading-none text-slate-300">{detail}</p>
                </PixelCard>
              ))}
            </div>
          </section>

          <section id="ai-terminal" className="space-y-5">
            <div>
              <p className="font-pixel text-[10px] text-arcade-yellow">LEVEL 04</p>
              <h2 className="mt-2 font-pixel text-xl text-white">AI Command Terminal</h2>
            </div>
            <RetroTerminal />
          </section>

          <section id="report-forge" className="pb-16">
            <div className="mb-5">
              <p className="font-pixel text-[10px] text-arcade-purple">LEVEL 05</p>
              <h2 className="mt-2 font-pixel text-xl text-white">Report Forge</h2>
            </div>
            <PixelCard glow="yellow">
              <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-center">
                <motion.div whileHover={{ rotateX: 10, y: -8 }} className="mx-auto grid h-48 w-64 place-items-center border-4 border-arcade-yellow bg-gradient-to-b from-arcade-purple/40 to-arcade-pink/20 shadow-[0_0_34px_rgba(255,215,0,.35)]">
                  <div className="h-24 w-40 border-4 border-arcade-yellow bg-black shadow-[inset_0_0_22px_rgba(255,215,0,.35)]">
                    <div className="mx-auto mt-8 h-8 w-12 border-2 border-arcade-cyan bg-arcade-cyan/20" />
                  </div>
                </motion.div>
                <div>
                  <div className="flex items-center gap-3">
                    <ScrollText className="text-arcade-yellow" />
                    <h3 className="font-pixel text-sm text-arcade-yellow">TREASURE REPORT UNLOCKED</h3>
                  </div>
                  <p className="mt-4 max-w-2xl font-terminal text-3xl leading-none text-slate-200">
                    Export stakeholder-ready intelligence packs with competitor overview, recent changes, signal analysis, and AI-generated strategic recommendations.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <PixelButton><FileDown size={16} /> Export PDF</PixelButton>
                    <PixelButton><FileDown size={16} /> Export CSV</PixelButton>
                    <PixelButton><ShieldCheck size={16} /> Export PowerPoint</PixelButton>
                  </div>
                </div>
              </div>
            </PixelCard>
          </section>
        </div>
      </div>
    </main>
  );
}

