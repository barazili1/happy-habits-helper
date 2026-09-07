import { AnimatePresence, motion } from "framer-motion";
import { Crown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Bet = {
  key: number;
  user: string;
  amount: number;
  odds: number;
  payout: number;
  secs: number;
  mine?: boolean;
};

function maskedId() {
  const d = () => Math.floor(Math.random() * 10);
  return `${d()}${d()}*******${d()}${d()}`;
}

let counter = 0;
function makeBet(mine = false): Bet {
  counter += 1;
  const amount = Math.floor(5 + Math.random() * 60) * 25;
  const odds = Number((1.1 + Math.random() * 8).toFixed(2));
  return {
    key: counter,
    user: maskedId(),
    amount,
    odds,
    payout: Math.round(amount * odds),
    secs: Math.floor(2 + Math.random() * 55),
    ...(mine ? { mine: true } : {}),
  };
}

const TABS = [
  { id: "all", label: "ALL BETS" },
  { id: "top", label: "Top Bets" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function BetsBoard() {
  const [tab, setTab] = useState<TabId>("all");
  const [all, setAll] = useState<Bet[]>([]);

  useEffect(() => {
    setAll(Array.from({ length: 6 }, () => makeBet()));
    const t = setInterval(() => {
      setAll((prev) => [makeBet(), ...prev].slice(0, 6));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const top = useMemo(
    () => [...all].sort((a, b) => b.payout - a.payout).slice(0, 6),
    [all],
  );

  const rows = tab === "all" ? all : top;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl p-4 luxe-card">
      <span className="luxe-hairline-top" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
          </span>
          <h3 className="text-sm font-bold">داشبورد الفوز</h3>
        </div>
        <TrendingUp className="h-4 w-4 text-neon" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-border bg-transparent p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative rounded-lg px-2 py-2 text-[11px] font-extrabold transition-colors ${
              tab === t.id ? "text-background" : "text-muted-foreground"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="bets-tab"
                className="absolute inset-0 rounded-lg bg-neon shadow-[0_0_18px_-6px_var(--neon)]"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-2 text-[10px] font-bold text-muted-foreground">
        <span>User ID</span>
        <span>المضاعف</span>
        <span>الربح</span>
      </div>

      <div className="mt-1.5 space-y-2">
        <AnimatePresence initial={false}>
          {rows.map((b, i) => (
            <motion.div
              key={`${tab}-${b.key}`}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border px-3 py-2 ${
                b.mine ? "border-neon/40 bg-neon/8" : "border-border bg-transparent"
              }`}
            >
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-xs font-semibold tabular-nums">
                  {tab === "top" && i === 0 && <Crown className="h-3.5 w-3.5 text-neon" />}
                  {b.user}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  رهان {b.amount.toLocaleString("en-US")} EGP · منذ {b.secs} ثانية
                </p>
              </div>
              <span className="shrink-0 rounded-md border border-border bg-transparent px-2 py-0.5 text-[11px] font-bold tabular-nums">
                x{b.odds.toFixed(2)}
              </span>
              <span className="shrink-0 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[11px] font-bold text-neon tabular-nums">
                +{b.payout.toLocaleString("en-US")}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
