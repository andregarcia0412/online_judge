import search from "../../../assets/search.svg";

type HomeSearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
};

export const HomeSearch = ({ value, onChange }: HomeSearchProps) => {
  return (
    <div className="flex w-full items-center self-center justify-self-center mt-8 mb-16 p-4 bg-[rgba(17,24,39,0.4)] outline-none border border-solid border-[#30363d] max-w-275 gap-3 rounded-lg transition-all duration-150 ease-in focus-within:border-[#8b5cf6]">
      <img className="opacity-40 h-5 w-5 cursor-pointer" src={search} />
      <input
        className="bg-transparent border-none w-full outline-none text-white placeholder:text-white placeholder:opacity-40"
        type="text"
        placeholder="Search problem by name or ID"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
