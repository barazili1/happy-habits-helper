import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { GameActions, GameShell } from "./GameShell";
import { BetsBoard } from "./BetsBoard";
import { SPECIAL_ID, fetchCrashOdds } from "@/lib/predictions";


const W = 380;
const H = 200;

// cubic bezier control points for the flight path
const P0 = { x: 10, y: H - 12 };
const P1 = { x: W * 0.4, y: H - 22 };
const P2 = { x: W * 0.62, y: H * 0.7 };
const P3 = { x: W - 52, y: 52 };

const PATH = `M ${P0.x} ${P0.y} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y}`;

function pointAt(t: number) {
  const u = 1 - t;
  const x = u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x;
  const y = u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y;
  const dx =
    3 * u * u * (P1.x - P0.x) + 6 * u * t * (P2.x - P1.x) + 3 * t * t * (P3.x - P2.x);
  const dy =
    3 * u * u * (P1.y - P0.y) + 6 * u * t * (P2.y - P1.y) + 3 * t * t * (P3.y - P2.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

export function CrashGame({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [odds, setOdds] = useState(1);
  const [progress, setProgress] = useState(0);
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
      else setRunning(false);
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
      <div
        className="relative mt-6 w-full overflow-hidden rounded-[25px] border border-neon/25 bg-gradient-to-b from-secondary/60 to-black"
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
              <stop offset="100%" stopColor="var(--neon)" stopOpacity="0.35" />
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

        {/* leading dot */}
        {progress > 0 && (
          <div
            className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_18px_var(--neon)]"
            style={{
              left: `${(pt.x / W) * 100}%`,
              top: `${(pt.y / H) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}


        {/* odds */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="text-4xl font-black tabular-nums text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
            <span className="text-neon">x</span>
            {odds.toFixed(2)}
          </span>
        </div>
      </div>

      <GameActions onStart={start} onReset={reset} />
      <BetsBoard />
    </GameShell>
  );
}
