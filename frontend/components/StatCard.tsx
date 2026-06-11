"use client";

import type { LucideIcon } from "lucide-react";
import { PixelCard } from "@/components/PixelCard";

export function StatCard({
  label,
  value,
  icon: Icon,
  color
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  color: "cyan" | "pink" | "green" | "purple" | "yellow";
}) {
  const textColor = {
    cyan: "text-arcade-cyan",
    pink: "text-arcade-pink",
    green: "text-arcade-green",
    purple: "text-arcade-purple",
    yellow: "text-arcade-yellow"
  }[color];

  return (
    <PixelCard glow={color}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-pixel text-[9px] uppercase text-slate-400">{label}</p>
          <p className={`mt-4 font-pixel text-xl ${textColor}`}>{value}</p>
        </div>
        <Icon className={textColor} size={30} aria-hidden />
      </div>
    </PixelCard>
  );
}

