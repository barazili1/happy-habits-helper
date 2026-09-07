import { motion } from "framer-motion";
import {
  Apple,
  BadgeDollarSign,
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Send,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TopBar } from "./TopBar";
import { LoadingDialog } from "./LoadingDialog";
import { GAMES, PLATFORM, type GameId } from "./platforms";
import { VerifyDialog } from "./VerifyDialog";

const PROMO = "JAC15";
const TELEGRAM_LINK = "https://t.me/+NPDZ2ZgLD4s5MWI8";
const REGISTER_LINK =
  "https://reffpa.com/L?tag=d_3355598m_97c_&site=3355598&ad=97&r=registration";
const DOWNLOAD_LINK = REGISTER_LINK;

function Block({
  index,
  title,
  subtitle,
  icon,
  done,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  done?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-l from-neon/[0.07] to-transparent p-4"
    >
      <span className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-neon to-transparent" />
      <div className="flex items-center gap-3">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-xs font-black transition-colors ${
            done
              ? "border-neon bg-neon text-background"
              : "border-neon/35 bg-neon/10 text-neon"
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : `0${index}`}
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border text-neon">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-extrabold">{title}</h2>
          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

export function TermsPage({
  initialUserId = "",
  onVerified,
}: {
  initialUserId?: string;
  onVerified: (game: GameId, userId: string) => void;
}) {
  const [userId, setUserId] = useState(initialUserId);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const copyPromo = async () => {
    try {
      await navigator.clipboard.writeText(PROMO);
    } catch {
      /* clipboard unavailable */
    }
    toast("تم نسخ البروموكود");
  };

  const pickGame = (id: GameId) => {
    if (loadingGame) return;
    setLoadingGame(true);
    setTimeout(() => {
      setLoadingGame(false);
      setSelectedGame(id);
      toast("تم الاتصال باللعبة المطلوبة");
    }, 3000);
  };

  const idValid = /^\d{6,14}$/.test(userId.trim());
  const doneCount = [idValid, Boolean(selectedGame)].filter(Boolean).length;
  const pct = 20 + doneCount * 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-screen"
    >
      <TopBar />

      <main className="relative mx-auto max-w-md px-4 pt-6">
        {/* header banner */}
        <div className="relative overflow-hidden rounded-3xl border border-neon/30 bg-gradient-to-bl from-neon/20 via-background to-background p-5">
          <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-neon/20 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <img
              src={PLATFORM.image}
              alt={PLATFORM.name}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-[10px] font-bold text-neon">
                <Sparkles className="h-3 w-3" />
                {PLATFORM.name}
              </span>
              <h1 className="mt-1.5 text-lg font-black leading-tight">
                أكمل الشروط لتشغيل الاسكربت
              </h1>
            </div>
            <span className="shrink-0 text-2xl font-black tabular-nums text-neon">{pct}%</span>
          </div>
          <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-neon shadow-[0_0_14px_var(--neon)]"
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Block
            index={1}
            title="تحميل تطبيق 1xBet الرسمي"
            subtitle="ثبّت التطبيق لضمان عمل الاسكربت"
            icon={<Download className="h-4 w-4" />}
          >
            <a
              href={DOWNLOAD_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-white mt-3"
            >
              <Download className="h-4 w-4" />
              تثبيت المنصة
            </a>
          </Block>

          <Block
            index={2}
            title="الانضمام إلى قناة التلجرام"
            subtitle="لمتابعة الإشارات اليومية"
            icon={<Send className="h-4 w-4" />}
          >
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-white-outline mt-3"
            >
              انضمام
            </a>
          </Block>

          <Block
            index={3}
            title="التسجيل بالبروموكود"
            subtitle="أدخل الكود أثناء إنشاء الحساب"
            icon={<Copy className="h-4 w-4" />}
          >
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-neon/30 bg-neon/[0.06] px-3 py-2.5">
              <span className="text-xl font-black tracking-[0.3em] text-neon">{PROMO}</span>
              <button
                type="button"
                onClick={copyPromo}
                className="flex items-center gap-1.5 rounded-lg border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs font-bold text-neon transition-colors hover:bg-neon/20"
              >
                <Copy className="h-3.5 w-3.5" />
                نسخ الكود
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href={REGISTER_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neon/35 bg-neon/10 text-[12px] font-extrabold text-neon transition-colors hover:bg-neon/20"
              >
                <Smartphone className="h-4 w-4" />
                التسجيل للأندرويد
              </a>
              <a
                href={REGISTER_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white/5 text-[12px] font-extrabold text-foreground transition-colors hover:border-neon/40"
              >
                <Apple className="h-4 w-4" />
                التسجيل للأيفون
              </a>
            </div>
          </Block>

          <Block
            index={4}
            title="إيداع 300 جنيه أو 6 دولار"
            subtitle="الحد الأدنى لتشغيل الاسكربت"
            icon={<Banknote className="h-4 w-4" />}
          >
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3 text-center">
                <Banknote className="mx-auto h-5 w-5 text-neon" />
                <p className="mt-1 text-base font-black">300 EGP</p>
                <p className="text-[10px] text-muted-foreground">الجنيه المصري</p>
              </div>
              <div className="rounded-xl border border-border p-3 text-center">
                <BadgeDollarSign className="mx-auto h-5 w-5 text-neon" />
                <p className="mt-1 text-base font-black">$6 USD</p>
                <p className="text-[10px] text-muted-foreground">الدولار الأمريكي</p>
              </div>
            </div>
          </Block>

          <Block
            index={5}
            title="إدخل الـ ID الخاص بك"
            subtitle="رقم الحساب داخل المنصة"
            icon={<CheckCircle2 className="h-4 w-4" />}
            done={idValid}
          >
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value.replace(/\D/g, "").slice(0, 14))}
              inputMode="numeric"
              maxLength={14}
              placeholder="أدخل رقم الـ ID هنا..."
              className="mt-3 h-12 w-full rounded-xl border border-border bg-transparent px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-neon"
            />
          </Block>

          <Block
            index={6}
            title="اختيار اللعبة المطلوبة"
            subtitle="اللعبة التي سيعمل عليها الاسكربت"
            icon={<Sparkles className="h-4 w-4" />}
            done={Boolean(selectedGame)}
          >
            <div className="mt-3 grid grid-cols-2 gap-3">
              {GAMES.map((g) => (
                <motion.button
                  key={g.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pickGame(g.id)}
                  className={`relative flex h-[90px] w-full items-end justify-center overflow-hidden rounded-xl border text-[11px] font-extrabold transition-all ${
                    selectedGame === g.id
                      ? "border-neon text-neon shadow-[0_0_24px_-8px_var(--neon)]"
                      : "border-border text-foreground hover:border-neon/50"
                  }`}
                >
                  <img
                    src={g.image}
                    alt={g.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <span className="relative z-10 mb-2">{g.name}</span>
                  {selectedGame === g.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-1.5 top-1.5"
                    >
                      <CheckCircle2 className="h-5 w-5 text-neon" />
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </Block>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!idValid) {
              toast("الرجاء إدخال ID صحيح");
              return;
            }
            if (!selectedGame) {
              toast("الرجاء اختيار اللعبة المطلوبة");
              return;
            }
            setVerifying(true);
          }}
          className="btn-white mb-12 mt-6 h-14 text-lg"
        >
          التحقق
        </button>
      </main>

      <LoadingDialog open={loadingGame} />
      <VerifyDialog
        open={verifying}
        onDone={() => {
          setVerifying(false);
          if (selectedGame) onVerified(selectedGame, userId.trim());
        }}
      />
    </motion.div>
  );
}
