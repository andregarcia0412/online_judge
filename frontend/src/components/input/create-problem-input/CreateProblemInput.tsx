type CreateProblemInputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  maxLength?: number;
  title: string;
  type?: "input" | "textarea";
  height?: number;
};

export const CreateProblemInput = ({
  text,
  setText,
  placeholder,
  maxLength,
  title,
  height,
  type = "input",
}: CreateProblemInputProps) => {
  const inputStyle =
    "w-full text-white outline-none bg-[rgba(17,24,39,0.4)] border border-[#374151] rounded-lg py-2 px-3 resize-none transition-colors duration-150 ease-in focus:border-[#8b5cf6]";

  return (
    <div>
      <div className="flex justify-center flex-col gap-2">
        <p className="text-sm">{title}</p>

        {type == "input" ? (
          <input
            style={{ height }}
            className={inputStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        ) : (
          <textarea
            style={{ height }}
            className={inputStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        {maxLength && (
          <p className="text-xs opacity-70">
            {text.length}/{maxLength} characters
          </p>
        )}
      </div>
    </div>
  );
};
