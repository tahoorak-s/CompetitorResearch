"use client";

import { motion } from "framer-motion";

export function XPBar({ value, label = "Data Health" }: { value: number; label?: string }) {
  return (
    <div className="w-full max-w-64" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div className="mb-2 flex items-center justify-between font-pixel text-[9px] text-arcade-green">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-5 border-2 border-arcade-green bg-black p-1 shadow-[0_0_16px_rgba(0,255,136,.35)]">
        <motion.div
          className="h-full bg-arcade-green shadow-[0_0_18px_rgba(0,255,136,.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

