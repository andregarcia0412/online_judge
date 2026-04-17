interface DividerProps {
  text: string;
}

export const Divider = ({ text }: DividerProps) => {
  return (
    <div className="flex items-center text-center my-5 text-[#666] w-full">
      <div className="flex-1 border-b border-[#666]" />
      {text ? <span className="mx-4">{text}</span> : null}
      <div className="flex-1 border-b border-[#666]" />
    </div>
  );
};
