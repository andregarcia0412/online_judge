import "./style.test-case-card.css";
import CloseSmall from "../../../assets/close_small.svg";

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
  return (
    <div className="test-case-card">
      <div className="test-case-card-title">
        <p>Test Case #{index}</p>
        <img src={CloseSmall} onClick={onDelete} />
      </div>

      <div className="test-case-card-input-row">
        <div className="test-case-card-input-container">
          <p>Input</p>
          <div className="test-case-card-input">
            <p>{input}</p>
          </div>
        </div>

        <div className="test-case-card-input-container">
          <p>Output</p>
          <div className="test-case-card-input">
            <p>{output}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
