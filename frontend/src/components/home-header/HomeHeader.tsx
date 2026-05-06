import { Logo } from "../logo/Logo";
import { QuickSearch } from "../input/quick-search/QuickSearch";
import { useNavigate } from "react-router-dom";
import Target from "../../assets/target.svg";

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
    <header className="flex items-center justify-between w-full py-3 px-8 bg-black/70 border-t border-b border-[#374151]">
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Logo />
        <div className="text-white text-base">
          <h1 className="text-3xl">
            Code
            <span className="bg-linear-to-r from-[#7d8bff] to-[#3b82f6] bg-clip-text text-transparent">
              Judge
            </span>
          </h1>
        </div>
      </div>

      <div className="flex gap-2 items-center text-white opacity-80">
        <img src={Target} />
        <p>Problems</p>
      </div>
      <QuickSearch setText={setText} handleSearch={handleSearch} text={text} />
    </header>
  );
};
