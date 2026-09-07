import { motion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TopBar } from "./TopBar";
import { LoadingDialog } from "./LoadingDialog";
import { LiveWinsFeed } from "./LiveWinsFeed";
import { PLATFORMS, type Platform } from "./platforms";

export function PlatformPage({
  selected,
  onSelect,
  onContinue,
}: {
  selected: Platform | null;
  onSelect: (p: Platform) => void;
  onContinue: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSelect = (p: Platform) => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSelect(p);
      toast("تم الاتصال بخوادم المنصة بنجاح", {
        icon: (
          <img
            src={p.image}
            alt={p.name}
            width={24}
            height={24}
            className="h-6 w-6 rounded-md object-cover"
          />
        ),
      });
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-screen pb-16"
    >
      <TopBar />

      <main className="relative mx-auto max-w-md px-4 pt-7">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/25 bg-neon/8 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-neon">
              <Zap className="h-3 w-3" />
              STEP 1 / 2
            </span>
            <h1 className="mt-3 text-[22px] font-black leading-tight tracking-tight">
              اختيار المنصة
            </h1>
            <p className="mt-1 text-[11px] text-muted-foreground">
              اختر المنصة ليتم الاتصال بخوادمها
            </p>
          </div>
          <div className="grid shrink-0 place-items-center rounded-2xl border border-border bg-transparent px-3 py-2 text-center">
            <span className="text-lg font-black text-neon tabular-nums">
              {PLATFORMS.length}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground">منصات</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {PLATFORMS.map((p, i) => {
            const active = selected?.id === p.id;
            return (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * i, type: "spring", stiffness: 220, damping: 24 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect(p)}
                className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border p-3 text-right transition-all duration-300 ${
                  active
                    ? "border-neon/60 bg-neon/[0.06]"
                    : "border-border bg-transparent hover:border-neon/30 hover:bg-transparent"
                }`}
              >
                <div className="relative flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/10"
                    />

                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-base font-extrabold">{p.name}</span>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold">
                      <span className="inline-flex items-center gap-1 rounded-md border border-neon/20 bg-neon/8 px-1.5 py-0.5 text-neon">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        آمنة
                      </span>
                      <span className="rounded-md border border-border bg-transparent px-1.5 py-0.5 text-muted-foreground">
                        خوادم سريعة
                      </span>
                    </div>
                  </div>

                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all ${
                      active
                        ? "border-neon bg-neon text-background"
                        : "border-border text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            if (!selected) {
              toast("الرجاء اختيار المنصة أولاً");
              return;
            }
            onContinue();
          }}
          className={`mt-7 btn-white ${selected ? "" : "opacity-45"}`}
        >
          متابعة
          <ArrowLeft className="h-4 w-4" />
        </button>

        <LiveWinsFeed />
      </main>
      <LoadingDialog open={loading} />
    </motion.div>
  );
}
