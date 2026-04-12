import "./style.create-problem-input.css";

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
  return (
    <div>
      <div className="create-input-row">
        <p>{title}</p>

        {type == "input" ? (
          <input
            style={{ height }}
            className="create-problem-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        ) : (
          <textarea
            style={{ height }}
            className="create-problem-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        {maxLength && (
          <p className="create-input-length">
            {text.length}/{maxLength} characters
          </p>
        )}
      </div>
    </div>
  );
};
