"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PixelCard({
  children,
  className,
  glow = "cyan"
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "pink" | "green" | "purple" | "yellow";
}) {
  const glowClass = {
    cyan: "hover:shadow-[0_0_34px_rgba(0,229,255,.5)]",
    pink: "hover:shadow-[0_0_34px_rgba(255,47,211,.5)]",
    green: "hover:shadow-[0_0_34px_rgba(0,255,136,.5)]",
    purple: "hover:shadow-[0_0_34px_rgba(139,92,246,.5)]",
    yellow: "hover:shadow-[0_0_34px_rgba(255,215,0,.5)]"
  }[glow];

  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ type: "spring", stiffness: 280, damping: 18 }}>
      <Card className={cn("transition-shadow", glowClass, className)}>{children}</Card>
    </motion.div>
  );
}

