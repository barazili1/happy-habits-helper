import logo from "@/assets/1xbet-hack-logo.png";
import gameApple from "@/assets/game-apple.jpg";
import gameCrash from "@/assets/game-crash.jpg";

export type Platform = {
  id: "1xbet";
  name: string;
  image: string;
};

export const PLATFORM: Platform = { id: "1xbet", name: "1xBet", image: logo };

export const PLATFORMS: Platform[] = [PLATFORM];

export type GameId = "apple" | "crash";

export const GAMES: { id: GameId; name: string; image: string }[] = [
  { id: "apple", name: "Apple of Fortune", image: gameApple },
  { id: "crash", name: "Crash", image: gameCrash },
];
