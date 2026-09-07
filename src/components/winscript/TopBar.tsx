import logo from "@/assets/1xbet-hack-logo.png";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 glass-panel border-x-0 border-t-0 border-b border-b-neon/30">
      <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-4">
        <img
          src={logo}
          alt="1xBet Hack"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <span className="text-lg font-extrabold tracking-wider">
          <span className="neon-text">1xBet</span> Hack
        </span>
      </div>
    </header>
  );
}
