import { motion } from "framer-motion";

export function NotificationBadge({ count, label }: { count: number; label?: string }) {
  return (
    <motion.span
      aria-label={label ?? `${count} notifications`}
      initial={{ scale: 0.9 }}
      animate={{ scale: [0.9, 1.08, 0.9] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="inline-flex min-w-8 items-center justify-center border-2 border-arcade-yellow bg-arcade-pink px-2 py-1 font-pixel text-[9px] text-black shadow-[3px_3px_0_#00e5ff]"
    >
      {count}
    </motion.span>
  );
}

