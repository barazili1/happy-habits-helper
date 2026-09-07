import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  "جارٍ التحقق من ID المستخدم",
  "جارٍ التحقق من الخوادم",
  "جارٍ ربط حسابك بالموقع",
  "تم ربط حسابك بنجاح",
];

export function VerifyDialog({ open, onDone }: { open: boolean; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const timers = [
      setTimeout(() => setStep(1), 1300),
      setTimeout(() => setStep(2), 2600),
      setTimeout(() => setStep(3), 3900),
      setTimeout(() => onDone(), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [open, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl p-5 luxe-card"
          >
            <span className="luxe-hairline-top" />
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neon/12 ring-1 ring-neon/40 neon-glow">
                <ShieldCheck className="h-5 w-5 text-neon" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold">تفعيل الاسكربت</h3>
                <p className="text-[11px] text-muted-foreground">لا تغلق الصفحة أثناء المعالجة</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {STEPS.map((label, i) => {
                const state = i < step ? "done" : i === step ? "active" : "idle";
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                      state === "idle"
                        ? "border-border bg-transparent opacity-45"
                        : "border-neon/30 bg-transparent"
                    }`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neon/10 ring-1 ring-neon/30">
                      {state === "done" ? (
                        <Check className="h-4 w-4 text-neon" />
                      ) : state === "active" ? (
                        <Loader2 className="h-4 w-4 animate-spin text-neon" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      )}
                    </span>
                    <span className="text-xs font-bold">{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-neon shadow-[0_0_12px_var(--neon)]"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
