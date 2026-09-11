import closeSmall from "../../../assets/close_small.svg";

type TestCaseCardProps = {
  index: number;
  input: string;
  output: string;
  onDelete: () => void;
};

export const TestCaseCard = ({
  index,
  input,
  output,
  onDelete,
}: TestCaseCardProps) => {
  const inputStyles = "bg-background border border-border p-3";
  const inputParagraphStyles = "text-success font-md opacity-100";

  return (
    <div className="flex flex-col p-5 border border-border-muted rounded-xl gap-3">
      <div className="flex items-center justify-between">
        <p>Test Case #{index}</p>
        <img
          className="cursor-pointer transition-all duration-150 ease-in bg-transparent p-0.5 hover:bg-danger-soft hover:rounded-md"
          src={closeSmall}
          onClick={onDelete}
        />
      </div>

      <div className="flex gap-6 *:flex-1">
        <div className="flex flex-col gap-2">
          <p className="text-sm opacity-70">Input</p>
          <div className={inputStyles}>
            <p className={inputParagraphStyles}>{input}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm opacity-70">Output</p>
          <div className={inputStyles}>
            <p className={inputParagraphStyles}>{output}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
