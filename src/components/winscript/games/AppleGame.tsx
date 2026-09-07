import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import appleGood from "@/assets/apple-good.png";
import appleBad from "@/assets/apple-bad.png";
import appleTile from "@/assets/apple-tile.png";
import { GameActions, GameShell } from "./GameShell";
import { BetsBoard } from "./BetsBoard";
import {
  COLS,
  ROWS,
  SPECIAL_ID,
  fetchAppleGrid,
  randomAppleGrid,
  resetAppleGrid,
  type AppleGrid,
} from "@/lib/predictions";

// من تحت لفوق
const ODDS = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.97, 69.93, 349.43];

export function AppleGame({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [grid, setGrid] = useState<AppleGrid | null>(null);
  const [busy, setBusy] = useState(false);

  const isSpecial = userId.trim() === SPECIAL_ID;

  const start = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const next = isSpecial ? ((await fetchAppleGrid()) ?? randomAppleGrid()) : randomAppleGrid();
      setGrid(next);
      toast("تم توليد إشارة جديدة");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (busy) return;
    setBusy(true);
    setGrid(null);
    try {
      if (isSpecial) {
        await resetAppleGrid();
      }
      toast("تمت إعادة البدء");
    } finally {
      setBusy(false);
    }
  };

  return (
    <GameShell title="Apple of Fortune" userId={userId} onBack={onBack}>
      <div className="mt-6 overflow-hidden rounded-3xl p-3 luxe-card">
        <span className="luxe-hairline-top" />
        <div dir="ltr" className="grid gap-1.5">
          {Array.from({ length: ROWS }).map((_, r) => {
            const rowIndex = ROWS - 1 - r; // 0 = أسفل الشبكة
            const row = grid?.[rowIndex];
            return (
              <div key={r} className="grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: COLS }).map((_, c) => {
                    const revealed = row !== undefined;
                    const good = revealed && row[c] === 0;
                    return (
                      <div
                        key={c}
                        className={`grid aspect-square w-full place-items-center overflow-hidden rounded-full border transition-all ${
                          good
                            ? "border-neon bg-neon/15 shadow-[0_0_26px_-8px_var(--neon)]"
                            : "border-border"
                        }`}
                      >
                        {revealed ? (
                          <motion.img
                            key={good ? "good" : "bad"}
                            src={good ? appleGood : appleBad}
                            alt={good ? "تفاحة سليمة" : "تفاحة فاسدة"}
                            initial={{ scale: 0.2, opacity: 0, rotate: -25 }}
                            animate={{ scale: 1, opacity: good ? 1 : 0.55, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 16,
                              delay: 0.04 * c + 0.03 * r,
                            }}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={appleTile}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <span
                  className={`w-[52px] rounded-lg border px-1 py-1 text-center text-[11px] font-black tabular-nums transition-colors ${
                    row !== undefined
                      ? "border-neon/50 text-neon"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {ODDS[rowIndex]?.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <GameActions onStart={start} onReset={reset} />
      <BetsBoard />
    </GameShell>
  );
}
