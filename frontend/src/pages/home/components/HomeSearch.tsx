import search from "../../../assets/search.svg";

type HomeSearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
};

export const HomeSearch = ({ value, onChange }: HomeSearchProps) => {
  return (
    <div className="flex w-full items-center mx-auto mt-8 mb-16 p-4 bg-surface outline-none border border-solid border-border max-w-275 gap-3 rounded-lg transition-all duration-150 ease-in focus-within:border-brand">
      <img className="opacity-40 h-5 w-5 cursor-pointer" src={search} />
      <input
        className="bg-transparent border-none w-full outline-none text-foreground placeholder:text-foreground placeholder:opacity-40"
        type="text"
        placeholder="Search problem by name or ID"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
