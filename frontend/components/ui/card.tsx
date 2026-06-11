import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pixel-corners pixel-border bg-black/78 p-5 backdrop-blur", className)} {...props} />;
}

