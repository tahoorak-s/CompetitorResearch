import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-none border-2 border-arcade-cyan bg-arcade-black px-4 py-2 text-center font-pixel text-[10px] uppercase text-arcade-cyan shadow-[4px_4px_0_#ff2fd3] outline-none transition hover:-translate-y-0.5 hover:bg-arcade-cyan hover:text-arcade-black focus-visible:ring-2 focus-visible:ring-arcade-yellow active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

