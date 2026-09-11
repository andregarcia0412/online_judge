interface DividerProps {
  text: string;
}

export const Divider = ({ text }: DividerProps) => {
  return (
    <div className="flex items-center text-center my-5 text-foreground-faint w-full">
      <div className="flex-1 border-b border-border-faint" />
      {text ? <span className="mx-4">{text}</span> : null}
      <div className="flex-1 border-b border-border-faint" />
    </div>
  );
};
