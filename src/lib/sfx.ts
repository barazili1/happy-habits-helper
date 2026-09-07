let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playClick() {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  // نغمة "بوب" ناعمة بدل الصوت الحاد
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const filter = ac.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(620, now + 0.06);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(filter).connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}


export function installGlobalClickSound() {
  if (typeof document === "undefined") return () => {};
  const handler = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest(
      'button, a, [role="button"], input[type="range"]',
    );
    if (el) playClick();
  };
  document.addEventListener("pointerdown", handler as EventListener);
  return () => document.removeEventListener("pointerdown", handler as EventListener);
}
