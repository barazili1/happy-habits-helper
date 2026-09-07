import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { installGlobalClickSound } from "@/lib/sfx";

import { SplashScreen } from "@/components/winscript/SplashScreen";
import { ParticlesBackground } from "@/components/winscript/ParticlesBackground";
import { TermsPage } from "@/components/winscript/TermsPage";
import { AppleGame } from "@/components/winscript/games/AppleGame";
import { CrashGame } from "@/components/winscript/games/CrashGame";
import type { GameId } from "@/components/winscript/platforms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1xBet Hack — اسكربت الفوز" },
      {
        name: "description",
        content:
          "1xBet Hack: أكمل الشروط، فعّل البروموكود JAC15، وابدأ مع اسكربت الفوز بواجهة سريعة وآمنة.",
      },
      { property: "og:title", content: "1xBet Hack — اسكربت الفوز" },
      {
        property: "og:description",
        content: "فعّل البروموكود JAC15 واختر لعبتك المفضلة داخل 1xBet Hack.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [stage, setStage] = useState<"splash" | "terms" | "game">("splash");
  const [game, setGame] = useState<GameId | null>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => installGlobalClickSound(), []);

  const backToTerms = () => setStage("terms");

  return (
    <div dir="rtl" className="relative min-h-screen bg-background text-foreground">
      <ParticlesBackground count={100} />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === "splash" && <SplashScreen key="splash" onDone={() => setStage("terms")} />}
          {stage === "terms" && (
            <TermsPage
              key="terms"
              initialUserId={userId}
              onVerified={(g, uid) => {
                setGame(g);
                setUserId(uid);
                setStage("game");
              }}
            />
          )}
          {stage === "game" && game === "apple" && (
            <AppleGame key="apple" userId={userId} onBack={backToTerms} />
          )}
          {stage === "game" && game === "crash" && (
            <CrashGame key="crash" userId={userId} onBack={backToTerms} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
