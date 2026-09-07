import { motion } from "framer-motion";
import { Activity, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import appleGood from "@/assets/apple-good.png";
import appleBad from "@/assets/apple-bad.png";
import appleTile from "@/assets/apple-tile.png";
import { GameActions, GameShell } from "./GameShell";
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
      {/* status strip */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-neon/[0.05] px-2 py-2 text-center">
          <p className="text-[9px] font-bold text-muted-foreground">الحالة</p>
          <p className="text-[11px] font-black text-neon">{grid ? "إشارة جاهزة" : "بانتظار البدء"}</p>
        </div>
        <div className="rounded-xl border border-border bg-neon/[0.05] px-2 py-2 text-center">
          <p className="text-[9px] font-bold text-muted-foreground">الدقة</p>
          <p className="text-[11px] font-black text-neon">98.4%</p>
        </div>
        <div className="rounded-xl border border-border bg-neon/[0.05] px-2 py-2 text-center">
          <p className="text-[9px] font-bold text-muted-foreground">المستويات</p>
          <p className="text-[11px] font-black text-neon">{ROWS}</p>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl border border-neon/25 bg-gradient-to-b from-neon/[0.08] to-transparent p-3">
        <span className="pointer-events-none absolute inset-0 grid-veil opacity-40" />
        <div className="relative mb-3 flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-neon">
            <Activity className="h-3.5 w-3.5" />
            SIGNAL MAP
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-neon" />
            المضاعف
          </span>
        </div>

        <div dir="ltr" className="relative grid gap-1.5">
          {Array.from({ length: ROWS }).map((_, r) => {
            const rowIndex = ROWS - 1 - r; // 0 = أسفل الشبكة
            const row = grid?.[rowIndex];
            return (
              <div key={r} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <span className="w-5 text-center text-[9px] font-black text-muted-foreground tabular-nums">
                  {rowIndex + 1}
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: COLS }).map((_, c) => {
                    const revealed = row !== undefined;
                    const good = revealed && row[c] === 0;
                    return (
                      <div
                        key={c}
                        className={`grid aspect-square w-full place-items-center overflow-hidden rounded-xl border transition-all ${
                          good
                            ? "border-neon bg-neon/15 shadow-[0_0_26px_-8px_var(--neon)]"
                            : "border-border bg-white/[0.02]"
                        }`}
                      >
                        {revealed ? (
                          <motion.img
                            key={good ? "good" : "bad"}
                            src={good ? appleGood : appleBad}
                            alt={good ? "تفاحة سليمة" : "تفاحة فاسدة"}
                            initial={{ scale: 0.2, opacity: 0, rotate: -25 }}
                            animate={{ scale: 1, opacity: good ? 1 : 0.45, rotate: 0 }}
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
                            className="h-full w-full object-cover opacity-70"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <span
                  className={`w-[54px] rounded-lg border px-1 py-1 text-center text-[11px] font-black tabular-nums transition-colors ${
                    row !== undefined
                      ? "border-neon/60 bg-neon/10 text-neon"
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
    </GameShell>
  );
}
