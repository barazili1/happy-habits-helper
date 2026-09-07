import { motion } from "framer-motion";
import { ChevronLeft, UserRound } from "lucide-react";
import logo from "@/assets/1xbet-hack-logo.png";

export function GameShell({
  title,
  userId,
  onBack,
  children,
}: {
  title: React.ReactNode;
  userId: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-screen"
    >
      <main className="relative mx-auto max-w-md px-4 pb-14 pt-5">
        {/* user id bar (replaces top bar) */}
        <div className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-3 py-3 luxe-card">
          <span className="luxe-hairline-top" />
          <div className="flex min-w-0 items-center gap-2">
            {Boolean(onBack) && (
              <button
                type="button"
                onClick={onBack}
                aria-label="رجوع"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-neon/40 text-neon transition-colors hover:bg-neon/10"
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </button>
            )}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-neon/40">
              <UserRound className="h-4 w-4 text-neon" />
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">User ID :</span>
            <span className="truncate text-sm font-black text-foreground">{userId || "—"}</span>
          </div>
          <img
            src={logo}
            alt="MASTER WIN"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full ring-1 ring-neon/40"
          />
        </div>


        <h1 className="mt-5 text-center text-xl font-black tracking-wide neon-text">{title}</h1>

        {children}
      </main>
    </motion.div>
  );
}

export function GameActions({ onStart, onReset }: { onStart: () => void; onReset: () => void }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <button type="button" onClick={onStart} className="btn-white">
        بدأ
      </button>
      <button type="button" onClick={onReset} className="btn-white-outline">
        اعاده بدأ
      </button>
    </div>
  );
}
