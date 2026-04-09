import "./style.create-problem-input.css";

type CreateProblemInputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  padding?: string;
  maxLength?: number;
  title: string;
};

export const CreateProblemInput = ({
  text,
  setText,
  placeholder,
  padding,
  maxLength,
  title,
}: CreateProblemInputProps) => {
  return (
    <div>
      <div className="create-input-row">
        <p>{title}</p>

        <input
          className="create-problem-input"
          style={{ padding }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {maxLength && <p className="create-input-length">
          {text.length}/{maxLength} characters
        </p>}
      </div>
    </div>
  );
};
