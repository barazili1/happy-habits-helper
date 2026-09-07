import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { installGlobalClickSound } from "@/lib/sfx";

import { SplashScreen } from "@/components/winscript/SplashScreen";
import { ParticlesBackground } from "@/components/winscript/ParticlesBackground";
import { PlatformPage } from "@/components/winscript/PlatformPage";
import { TermsPage } from "@/components/winscript/TermsPage";
import { AppleGame } from "@/components/winscript/games/AppleGame";
import { GemsMines } from "@/components/winscript/games/GemsMines";
import { CrashGame } from "@/components/winscript/games/CrashGame";
import { WildWest } from "@/components/winscript/games/WildWest";
import type { GameId, Platform } from "@/components/winscript/platforms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MASTER WIN — اسكربت الفوز للمنصات" },
      {
        name: "description",
        content:
          "MASTER WIN: اختر منصتك، أكمل الشروط، وابدأ مع اسكربت الفوز بواجهة عصرية سريعة وآمنة.",
      },
      { property: "og:title", content: "MASTER WIN — اسكربت الفوز للمنصات" },
      {
        property: "og:description",
        content: "اختر المنصة، فعّل البروموكود BTR1، واختر لعبتك المفضلة داخل MASTER WIN.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [stage, setStage] = useState<"splash" | "platform" | "terms" | "game">("splash");
  const [game, setGame] = useState<GameId | null>(null);
  const [userId, setUserId] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  useEffect(() => installGlobalClickSound(), []);

  const backToTerms = () => setStage("terms");

  return (
    <div dir="rtl" className="relative min-h-screen bg-background text-foreground">
      <ParticlesBackground count={100} />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === "splash" && <SplashScreen key="splash" onDone={() => setStage("platform")} />}
          {stage === "platform" && (
            <PlatformPage
              key="platform"
              selected={selectedPlatform}
              onSelect={setSelectedPlatform}
              onContinue={() => setStage("terms")}
            />
          )}
          {stage === "terms" && (
            <TermsPage
              key="terms"
              platform={selectedPlatform}
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
          {stage === "game" && game === "gems-mines" && (
            <GemsMines key="gems" userId={userId} onBack={backToTerms} />
          )}
          {stage === "game" && game === "crash" && (
            <CrashGame key="crash" userId={userId} onBack={backToTerms} />
          )}
          {stage === "game" && game === "wild-west" && (
            <WildWest key="wild" userId={userId} onBack={backToTerms} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

