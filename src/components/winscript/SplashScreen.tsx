import { motion } from "framer-motion";
import { useEffect } from "react";
import logo from "@/assets/master-win-logo.png";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ambient background */}
      <div className="glow-pulse pointer-events-none absolute h-[26rem] w-[26rem] rounded-full bg-neon/12 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />

      {/* emblem */}
      <div className="relative grid h-40 w-40 place-items-center">
        <motion.span
          className="orbit-ring absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--neon) 70%, transparent) 60deg, transparent 140deg)",
            maskImage: "radial-gradient(circle, transparent 61%, black 62%)",
          }}
        />
        <span className="absolute inset-[6px] rounded-full border border-neon/15" />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
          className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full luxe-card"
        >
          <span className="sheen -left-1/3" />
          <img src={logo} alt="MASTER WIN" width={112} height={112} className="absolute inset-0 h-full w-full rounded-full object-cover" />
        </motion.div>
      </div>

      {/* wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="relative mt-8 text-4xl font-black tracking-[0.2em]"
      >
        <span className="neon-text">MASTER</span>
        <span className="text-foreground/90"> WIN</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative mt-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-muted-foreground"
      >
        MASTER WIN
      </motion.p>

      <div className="relative mt-3 h-px w-40 bg-gradient-to-l from-transparent via-neon/60 to-transparent" />

      {/* progress */}
      <div className="relative mt-8 w-64">
        <div className="h-[6px] overflow-hidden rounded-full border border-neon/20 bg-transparent">
          <motion.div
            className="h-full rounded-full bg-neon shadow-[0_0_14px_var(--neon)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <p className="mt-4 text-center text-xs tracking-wide text-muted-foreground">
          جارٍ تهيئة الاسكربت...
        </p>
      </div>
    </motion.div>
  );
}
