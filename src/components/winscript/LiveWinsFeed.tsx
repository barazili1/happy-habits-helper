import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type Win = { key: number; id: string; amount: number; platform: string; secs: number };

const PLATFORM_NAMES = ["BIZBET", "Greenbet"];

let counter = 0;
function makeWin(): Win {
  counter += 1;
  return {
    key: counter,
    id: `ID: ${Math.floor(100 + Math.random() * 899)}***${Math.floor(10 + Math.random() * 89)}`,
    amount: Math.floor(8 + Math.random() * 190) * 25,
    platform: PLATFORM_NAMES[Math.floor(Math.random() * 2)] ?? "BIZBET",
    secs: Math.floor(3 + Math.random() * 40),
  };
}

export function LiveWinsFeed() {
  const [wins, setWins] = useState<Win[]>([]);

  useEffect(() => {
    setWins(Array.from({ length: 4 }, makeWin));
    const t = setInterval(() => {
      setWins((prev) => [makeWin(), ...prev].slice(0, 4));
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mt-8 rounded-2xl glass-panel p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
          </span>
          <h3 className="truncate text-sm font-bold">عمليات الفوز المباشرة</h3>
        </div>
        <TrendingUp className="h-4 w-4 shrink-0 text-neon" />
      </div>

      <div className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {wins.map((w) => (
            <motion.div
              key={w.key}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-transparent px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{w.id}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {w.platform} · منذ {w.secs} ثانية
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-xs font-bold text-neon">
                +{w.amount.toLocaleString("en-US")} EGP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
