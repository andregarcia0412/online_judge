import { Logo } from "../logo/Logo";
import { QuickSearch } from "../input/quick-search/QuickSearch";
import "./style.home-header.css";
import { useNavigate } from "react-router-dom";

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
    <header className="home-header">
      <div className="logo-title" onClick={() => navigate("/")}>
        <Logo />
        <div className="header-title">
          <h1>
            Code<span>Judge</span>
          </h1>
        </div>
      </div>

      <QuickSearch setText={setText} handleSearch={handleSearch} text={text} />
    </header>
  );
};
