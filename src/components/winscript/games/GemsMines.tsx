import { motion } from "framer-motion";
import { Gem } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GameActions, GameShell } from "./GameShell";
import { BetsBoard } from "./BetsBoard";

export function GemsMines({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [count, setCount] = useState(5);
  const [cells, setCells] = useState<number[]>([]);

  const start = () => {
    const pool = Array.from({ length: 25 }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i] as number;
      pool[i] = pool[j] as number;
      pool[j] = tmp;
    }
    setCells(pool.slice(0, count));
    toast(`تم كشف ${count} ألماسة`);
  };

  const reset = () => {
    setCells([]);
    toast("تمت إعادة البدء");
  };

  return (
    <GameShell title="Gems Mines" userId={userId} onBack={onBack}>
      <div className="mt-6 overflow-hidden rounded-3xl p-3 luxe-card">
        <span className="luxe-hairline-top" />
        <div className="mx-auto grid w-fit grid-cols-5 gap-2">
          {Array.from({ length: 25 }).map((_, i) => {
            const active = cells.includes(i);
            return (
              <motion.div
                key={i}
                animate={active ? { scale: [0.75, 1.1, 1], rotate: [0, 6, 0] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`grid h-[50px] w-[50px] place-items-center rounded-2xl border transition-all ${
                  active
                    ? "border-sky-400 bg-sky-400/15 shadow-[0_0_22px_-6px_theme(colors.sky.400)]"
                    : "border-border bg-gradient-to-b from-secondary/80 to-black/60"
                }`}
              >
                {active ? (
                  <motion.span
                    initial={{ scale: 0.2, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 15, delay: 0.02 * i }}
                  >
                    <Gem className="h-6 w-6 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                  </motion.span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl p-4 luxe-card">
        <span className="luxe-hairline-top" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">عدد الألماس</span>
          <span className="text-lg font-black text-neon">{count}</span>
        </div>
        <input
          type="range"
          min={1}
          max={24}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="range-luxe mt-3 w-full"
        />
      </div>

      <GameActions onStart={start} onReset={reset} />
      <BetsBoard />
    </GameShell>
  );
}
