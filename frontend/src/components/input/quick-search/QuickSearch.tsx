import search from "../../../assets/search.svg";

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
    <div className="flex justify-center items-center bg-[rgba(17,24,39,0.4)] py-1.5 px-3 gap-3 border border-[#374151] rounded-full">
      <img
        src={search}
        onClick={handleSearch}
        className="opacity-40 h-5 w-5 cursor-pointer"
      />
      <input
        className="bg-transparent outline-none border-none text-white text-base placeholder:text-white placeholder:opacity-50"
        type="text"
        placeholder="Quick search..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </div>
  );
};
