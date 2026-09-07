const bizbet =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh_SHX7efEoJGTNOkFPVFyFdj1MQKfYEF6biEyL8jE_A&s=10";
const greenbet =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoEj5eP5tNE8iMZoLHE9i4q-JYLMiLmHaIMKatrmBePA&s=10";
import gameApple from "@/assets/game-apple.jpg";
import gameCrash from "@/assets/game-crash.jpg";
import gameGems from "@/assets/game-gems.jpg";
import gameWildWest from "@/assets/game-wildwest.jpg";

export type Platform = {
  id: "bizbet" | "greenbet";
  name: string;
  image: string;
};

export const PLATFORMS: Platform[] = [
  { id: "bizbet", name: "BIZBET", image: bizbet },
  { id: "greenbet", name: "Greenbet", image: greenbet },
];

export type GameId = "apple" | "gems-mines" | "crash" | "wild-west";

export const GAMES: { id: GameId; name: string; image: string }[] = [
  { id: "apple", name: "Apple of Fortune", image: gameApple },
  { id: "gems-mines", name: "Gems Mines", image: gameGems },
  { id: "crash", name: "Crash", image: gameCrash },
  { id: "wild-west", name: "Wild West", image: gameWildWest },
];
