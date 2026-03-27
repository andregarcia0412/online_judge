import { Logo } from "../logo/Logo";
import { QuickSearch } from "../quick-search/QuickSearch";
import "./style.home-header.css";

type HomeHeaderProps = {
  setText: (text: string) => void;
  handleSearch: () => void;
};

export const HomeHeader = ({ setText, handleSearch }: HomeHeaderProps) => {
  return (
    <header className="home-header">
      <div className="logo-title">
        <Logo />
        <div className="header-title">
          <h1>
            Code<span>Judge</span>
          </h1>
        </div>
      </div>

      <QuickSearch setText={setText} handleSearch={handleSearch} />
    </header>
  );
};
