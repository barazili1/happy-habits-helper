import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plane, Timer, TrendingUp } from "lucide-react";

import planeImg from "@/assets/plane.png";
import { GameActions, GameShell } from "./GameShell";
import { SPECIAL_ID, fetchCrashOdds } from "@/lib/predictions";

const W = 380;
const H = 220;

const P0 = { x: 10, y: H - 12 };
const P1 = { x: W * 0.4, y: H - 22 };
const P2 = { x: W * 0.62, y: H * 0.7 };
const P3 = { x: W - 52, y: 46 };

const PATH = `M ${P0.x} ${P0.y} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y}`;

function pointAt(t: number) {
  const u = 1 - t;
  const x = u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x;
  const y = u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y;
  const dx = 3 * u * u * (P1.x - P0.x) + 6 * u * t * (P2.x - P1.x) + 3 * t * t * (P3.x - P2.x);
  const dy = 3 * u * u * (P1.y - P0.y) + 6 * u * t * (P2.y - P1.y) + 3 * t * t * (P3.y - P2.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

export function CrashGame({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [odds, setOdds] = useState(1);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const raf = useRef<number | null>(null);
  const targetRef = useRef(1);

  useEffect(() => {
    if (!running) return;
    const startAt = performance.now();
    const dur = 1000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startAt) / dur);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(eased);
      setOdds(1 + (targetRef.current - 1) * Math.pow(p, 1.6));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setRunning(false);
        setHistory((h) => [targetRef.current, ...h].slice(0, 6));
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running]);

  const start = async () => {
    if (running) return;
    const remote = userId.trim() === SPECIAL_ID ? await fetchCrashOdds() : null;
    targetRef.current = remote ?? Number((1 + Math.random() * 7).toFixed(2));
    setOdds(1);
    setProgress(0);
    setRunning(true);
    toast("انطلقت الجولة");
  };

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setRunning(false);
    setOdds(1);
    setProgress(0);
    toast("تمت إعادة البدء");
  };

  const pt = pointAt(progress);

  return (
    <GameShell title="Crash" userId={userId} onBack={onBack}>
      {/* prediction banner */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-neon/25 bg-gradient-to-l from-neon/10 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-neon" />
          <span className="text-[11px] font-bold text-muted-foreground">إشارة الجولة</span>
        </div>
        <span className="text-lg font-black tabular-nums text-neon">
          x{running ? "--" : odds.toFixed(2)}
        </span>
      </div>

      <div
        className="relative mt-3 w-full overflow-hidden rounded-3xl border border-neon/25 bg-gradient-to-b from-neon/[0.1] via-background to-black"
        style={{ height: H }}
      >
        <div className="pointer-events-none absolute inset-0 grid-veil opacity-60" />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="crashFill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="var(--neon)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--neon)" stopOpacity="0.4" />
            </linearGradient>
            <clipPath id="crashClip">
              <rect x="0" y="0" width={Math.max(0, pt.x)} height={H} />
            </clipPath>
          </defs>

          {progress > 0 && (
            <g clipPath="url(#crashClip)">
              <path d={`${PATH} L ${P3.x} ${H} L ${P0.x} ${H} Z`} fill="url(#crashFill)" />
              <path
                d={PATH}
                fill="none"
                stroke="var(--neon)"
                strokeWidth={4}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 10px var(--neon))" }}
              />
            </g>
          )}
        </svg>

        {progress > 0 && (
          <img
            src={planeImg}
            alt=""
            className="pointer-events-none absolute h-9 w-9 object-contain drop-shadow-[0_0_14px_var(--neon)]"
            style={{
              left: `${(pt.x / W) * 100}%`,
              top: `${(pt.y / H) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${pt.angle}deg)`,
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="block text-5xl font-black tabular-nums text-foreground drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)]">
              <span className="text-neon">x</span>
              {odds.toFixed(2)}
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-muted-foreground">
              <Timer className="h-3 w-3" />
              {running ? "الطيارة في الهواء" : "جاهز للإقلاع"}
            </span>
          </div>
        </div>
      </div>

      {/* history */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto rounded-2xl border border-border px-3 py-2">
        <TrendingUp className="h-3.5 w-3.5 shrink-0 text-neon" />
        {history.length === 0 ? (
          <span className="text-[11px] text-muted-foreground">لا توجد جولات سابقة</span>
        ) : (
          history.map((h, i) => (
            <span
              key={i}
              className={`shrink-0 rounded-lg border px-2 py-1 text-[11px] font-black tabular-nums ${
                h >= 2 ? "border-neon/50 bg-neon/10 text-neon" : "border-border text-muted-foreground"
              }`}
            >
              x{h.toFixed(2)}
            </span>
          ))
        )}
      </div>

      <GameActions onStart={start} onReset={reset} />
    </GameShell>
  );
}
