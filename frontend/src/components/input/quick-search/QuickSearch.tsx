import "./style.quick-search.css";
import Search from "../../../assets/search.svg";

type QuickSearchProps = {
  setText: (text: string) => void;
  handleSearch: () => void;
  text: string;
};

export const QuickSearch = ({
  setText,
  handleSearch,
  text,
}: QuickSearchProps) => {
  return (
    <div className="quick-search-container">
      <img src={Search} onClick={handleSearch} />
      <input
        type="text"
        placeholder="Quick search..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </div>
  );
};
