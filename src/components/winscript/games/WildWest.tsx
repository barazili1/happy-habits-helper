import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { GameActions, GameShell } from "./GameShell";
import { BetsBoard } from "./BetsBoard";
import symbol from "@/assets/wildwest-symbol.jpg";

export function WildWest({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [mode, setMode] = useState<2 | 3>(2);
  const [winner, setWinner] = useState<number | null>(null);

  const start = () => setWinner(Math.floor(Math.random() * mode));
  const reset = () => setWinner(null);

  const pickMode = (m: 2 | 3) => {
    setMode(m);
    setWinner(null);
  };

  return (
    <GameShell
      title={
        <>
          <span className="text-[#d9b382] drop-shadow-[0_0_14px_rgba(217,179,130,0.5)]">WILD</span>{" "}
          <span className="text-foreground">WEST</span>
        </>
      }
      userId={userId}
      onBack={onBack}
    >
      {/* slots */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: mode }).map((_, i) => (
          <div
            key={i}
            className={`relative h-[110px] flex-1 max-w-[140px] overflow-hidden rounded-2xl border transition-all ${
              winner === i
                ? "border-[#d9b382] shadow-[0_0_36px_-10px_#d9b382]"
                : "border-border bg-gradient-to-b from-secondary/70 to-black/60"
            }`}
          >
            <AnimatePresence>
              {winner === i && (
                <motion.img
                  key="sym"
                  src={symbol}
                  alt=""
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* mode */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {([2, 3] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => pickMode(m)}
            className={`h-[30px] w-[68px] rounded-full border text-xs font-black tracking-wider transition-all ${
              mode === m
                ? "border-neon bg-neon/10 text-neon shadow-[0_0_18px_-8px_var(--neon)]"
                : "border-border text-muted-foreground hover:border-neon/50"
            }`}
          >
            X{m}
          </button>
        ))}
      </div>

      <GameActions onStart={start} onReset={reset} />
      <BetsBoard />
    </GameShell>
  );
}
