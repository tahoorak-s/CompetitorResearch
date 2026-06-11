"use client";

import { motion } from "framer-motion";

const lines = [
  "> ANALYZING COMPETITOR...",
  "✓ Homepage updated",
  "✓ New pricing page",
  "✓ Product launch detected",
  "",
  "Generating AI summary...",
  "OpenAI and Anthropic increased enterprise AI positioning this cycle. Perplexity is accelerating answer-engine distribution, while Google AI signals heavier workspace bundling.",
  "Opportunity: lead with transparent pricing, vertical workflows, and faster onboarding."
];

export function RetroTerminal() {
  return (
    <div className="relative overflow-hidden border-2 border-arcade-green bg-black p-5 shadow-[0_0_34px_rgba(0,255,136,.3)]">
      <div className="mb-4 flex items-center gap-2 border-b border-arcade-green/40 pb-3">
        <span className="h-3 w-3 bg-arcade-pink" />
        <span className="h-3 w-3 bg-arcade-yellow" />
        <span className="h-3 w-3 bg-arcade-green" />
        <span className="ml-3 font-pixel text-[9px] text-arcade-green">AI COMMAND TERMINAL</span>
      </div>
      <div className="space-y-2 font-terminal text-2xl leading-none text-arcade-green md:text-3xl">
        {lines.map((line, index) => (
          <motion.p key={`${line}-${index}`} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }}>
            {line || "\u00A0"}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

