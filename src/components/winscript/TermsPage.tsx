import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeDollarSign,
  Banknote,
  CheckCircle2,
  Copy,
  Download,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { TopBar } from "./TopBar";
import { LoadingDialog } from "./LoadingDialog";
import { GAMES, type GameId, type Platform } from "./platforms";
import { VerifyDialog } from "./VerifyDialog";
import stepDownload from "@/assets/step-download.png";
import stepTelegram from "@/assets/step-telegram.png";
import stepPromo from "@/assets/step-promo.png";
import stepDeposit from "@/assets/step-deposit.png";
import stepId from "@/assets/step-id.png";
import stepGame from "@/assets/step-game.png";

function StepIcon({ src }: { src: string }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-neon/25 bg-neon/5">
      <img src={src} alt="" loading="lazy" width={48} height={48} className="h-10 w-10 object-contain" />
    </span>
  );
}

const PROMO = "BTR1";

const TELEGRAM_LINK = "https://t.me/+NPDZ2ZgLD4s5MWI8";

const PLATFORM_LINKS: Record<string, { download: string }> = {
  bizbet: {
    download: "https://refpa83754.com/L?tag=d_5991942m_67005c_&site=5991942&ad=67005",
  },
  greenbet: {
    download: "https://refpa79184.com/L?tag=d_5969188m_132250c_&site=5969188&ad=132250",
  },
};

function Step({
  index,
  title,
  subtitle,
  badge,
  done,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  done?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="relative pr-9"
    >
      {/* timeline rail */}
      <span className="absolute right-[13px] top-8 bottom-[-1rem] w-px bg-gradient-to-b from-neon/40 to-transparent" />
      <span
        className={`step-chip absolute right-0 top-2 ${done ? "bg-neon text-background" : ""}`}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : index}
      </span>

      <div className="group relative overflow-hidden rounded-2xl p-4 luxe-card transition-all duration-300 hover:border-neon/35 hover:shadow-[0_0_40px_-24px_var(--neon)]">
        <span className="luxe-hairline-top" />
        <span className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-neon/10 blur-2xl" />

        <div className="flex items-start justify-between gap-3">
          {badge}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-extrabold leading-6 text-foreground">{title}</h2>
            {subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </motion.section>
  );
}

export function TermsPage({
  platform,
  initialUserId = "",
  onVerified,
}: {
  platform: Platform | null;
  initialUserId?: string;
  onVerified: (game: GameId, userId: string) => void;
}) {
  const [userId, setUserId] = useState(initialUserId);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [videoModal, setVideoModal] = useState<
    { title: string; src: string; cta?: { label: string; href: string } } | null
  >(null);
  const [verifying, setVerifying] = useState(false);

  const platformName = platform?.name ?? "المنصة";
  const links = platform ? PLATFORM_LINKS[platform.id] : undefined;

  const copyPromo = async () => {
    try {
      await navigator.clipboard.writeText(PROMO);
    } catch {
      /* clipboard unavailable */
    }
    toast("تم نسخ البروموكود");
  };

  const pickGame = (id: string) => {
    if (loadingGame) return;
    setLoadingGame(true);
    setTimeout(() => {
      setLoadingGame(false);
      setSelectedGame(id);
      toast("تم الاتصال باللعبة المطلوبة");
    }, 3000);
  };

  const idValid = /^17\d{8,12}$/.test(userId.trim());
  const doneCount = [idValid, Boolean(selectedGame)].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-screen"
    >
      <TopBar />

      <main className="relative mx-auto max-w-md px-4 pt-8">
        {/* header */}
        <div className="relative overflow-hidden rounded-3xl p-4 luxe-card">
          <span className="luxe-hairline-top" />
          <span className="sheen" />
          <div className="relative flex items-center gap-3">

            {platform && (
              <img
                src={platform.image}
                alt={platform.name}
                loading="lazy"
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl bg-white/5 object-contain p-1 ring-1 ring-neon/40"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] tracking-widest text-muted-foreground">الخطوة 2 من 2</p>
              <h1 className="bg-gradient-to-l from-foreground to-neon bg-clip-text text-lg font-black leading-snug text-transparent">
                الرجاء إكمال الشروط الآتية
              </h1>

            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 text-[10px] font-bold text-neon">
              <ShieldCheck className="h-3 w-3" />
              {platformName}
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-neon shadow-[0_0_12px_var(--neon)]"
              animate={{ width: `${20 + doneCount * 40}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
          </div>
        </div>

        {/* steps */}
        <div className="mt-7 space-y-5">
          <Step
            index={1}
            title={`تحميل منصة ${platformName} الرسمية`}
            subtitle="ثبّت التطبيق الرسمي لضمان عمل الاسكربت"
            badge={<StepIcon src={stepDownload} />}
          >
            <a
              href={links?.download ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="btn-white mt-4"
            >
              <Download className="h-4 w-4" />
              تثبيت المنصة
            </a>
          </Step>

          <Step
            index={2}
            title="الانضمام إلى قناة التلجرام"
            subtitle="لمتابعة التحديثات والإشارات اليومية"
            badge={<StepIcon src={stepTelegram} />}
          >
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-white-outline mt-4"
            >
              {"انضمام >"}
            </a>
          </Step>

          <Step
            index={3}
            title="التسجيل بالبروموكود الخاص بالاسكربت"
            subtitle="أدخل الكود أثناء إنشاء الحساب"
            badge={<StepIcon src={stepPromo} />}
          >
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-neon/25 bg-transparent px-3 py-2.5">
              <span className="text-xl font-black tracking-[0.3em] text-foreground">{PROMO}</span>
              <button
                type="button"
                onClick={copyPromo}
                className="flex items-center gap-1.5 rounded-lg border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs font-bold text-neon transition-colors hover:bg-neon/20"
              >
                <Copy className="h-3.5 w-3.5" />
                نسخ الكود
              </button>
            </div>
          </Step>

          <Step
            index={4}
            title="إيداع مبلغ بحد أدنى 300 جنيه أو 6 دولار"
            subtitle="الحد الأدنى لتشغيل الاسكربت على حسابك"
            badge={<StepIcon src={stepDeposit} />}
          >
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-transparent p-3 text-center transition-colors hover:border-neon/40">
                <Banknote className="mx-auto h-6 w-6 text-neon" />
                <p className="mt-1 text-lg font-black text-foreground">300 EGP</p>
                <p className="text-[10px] text-muted-foreground">الجنيه المصري</p>
              </div>
              <div className="rounded-xl border border-border bg-transparent p-3 text-center transition-colors hover:border-neon/40">
                <BadgeDollarSign className="mx-auto h-6 w-6 text-neon" />
                <p className="mt-1 text-lg font-black text-foreground">$6 USD</p>
                <p className="text-[10px] text-muted-foreground">الدولار الأمريكي</p>
              </div>
            </div>
          </Step>

          <Step
            index={5}
            title="إدخل الـ ID الخاص بك"
            subtitle="رقم الحساب داخل المنصة"
            badge={<StepIcon src={stepId} />}
            done={idValid}
          >
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value.replace(/\D/g, "").slice(0, 14))}
              inputMode="numeric"
              maxLength={14}
              placeholder="أدخل رقم الـ ID هنا (يبدأ بـ 17)..."
              className="mt-4 h-12 w-full rounded-xl border border-border bg-transparent px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-neon focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--neon)_15%,transparent)]"
            />
          </Step>

          <Step
            index={6}
            title="اختيار اللعبة المطلوبة"
            subtitle="اللعبة التي سيعمل عليها الاسكربت"
            done={Boolean(selectedGame)}
            badge={<StepIcon src={stepGame} />}
          >
            <div className="mt-4 grid grid-cols-2 gap-3">
              {GAMES.map((g) => (
                <motion.button
                  key={g.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pickGame(g.id)}
                  className={`relative flex h-[78px] w-full cursor-pointer items-end justify-center overflow-hidden rounded-xl border bg-transparent text-[11px] font-extrabold transition-all hover:border-neon/60 ${
                    selectedGame === g.id
                      ? "border-neon text-neon shadow-[0_0_24px_-8px_var(--neon)]"
                      : "border-border text-foreground"
                  }`}
                >
                  <img
                    src={g.image}
                    alt={g.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <span className="relative z-10 mb-1.5 px-1 text-center leading-tight">{g.name}</span>
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
          </Step>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!idValid) {
              toast("الرجاء إدخال ID صحيح يبدأ برقم 17");
              return;
            }
            if (!selectedGame) {
              toast("الرجاء اختيار اللعبة المطلوبة");
              return;
            }
            setVerifying(true);
          }}
          className="btn-white mb-12 mt-8 h-14 text-lg"
        >
          التحقق
        </button>
      </main>

      <LoadingDialog open={loadingGame} />
      <VerifyDialog
        open={verifying}
        onDone={() => {
          setVerifying(false);
          if (selectedGame) onVerified(selectedGame as GameId, userId.trim());
        }}
      />

      <AnimatePresence>
        {videoModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModal(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-full max-w-md overflow-hidden rounded-3xl p-4 luxe-card"
            >
              <span className="luxe-hairline-top" />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <h3 className="min-w-0 truncate text-sm font-extrabold">{videoModal.title}</h3>
                <button
                  type="button"
                  onClick={() => setVideoModal(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-transparent text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-3 w-full overflow-hidden rounded-2xl border border-border bg-black">
                <video
                  key={videoModal.src}
                  src={videoModal.src}
                  controls
                  autoPlay
                  ref={(el) => {
                    if (el) {
                      el.muted = false;
                      el.volume = 1;
                      void el.play().catch(() => {});
                    }
                  }}

                  loop
                  playsInline
                  preload="auto"
                  className="h-full max-h-[60vh] w-full object-contain"
                />
              </div>


              {videoModal.cta && (
                <a
                  href={videoModal.cta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-white mt-4"
                >
                  {videoModal.cta.label}
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
