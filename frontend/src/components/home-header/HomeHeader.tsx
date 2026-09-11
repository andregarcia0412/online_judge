import { useNavigate } from "react-router-dom";
import target from "../../assets/target.svg";
import { QuickSearch } from "../input/quick-search/QuickSearch";
import { Logo } from "../logo/Logo";

type HomeHeaderProps = {
  setText: (text: string) => void;
  text: string;
  handleSearch: () => void;
};

export const HomeHeader = ({
  setText,
  handleSearch,
  text,
}: HomeHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between w-full py-3 px-8 bg-overlay-heavy border-t border-b border-border-muted">
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Logo />
        <div className="text-foreground text-base">
          <h1 className="text-3xl">
            Code
            <span className="bg-linear-to-r from-accent-lighter to-accent bg-clip-text text-transparent">
              Judge
            </span>
          </h1>
        </div>
      </div>

      <div className="flex gap-2 items-center text-foreground opacity-80">
        <img src={target} />
        <p>Problems</p>
      </div>
      <QuickSearch setText={setText} handleSearch={handleSearch} text={text} />
    </header>
  );
};
