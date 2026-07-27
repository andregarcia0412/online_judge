import error from "../../../assets/error.svg";
import "./style.warning-card.css";

export const TestCaseWarningCard = () => {
  return (
    <div className="test-case-warning-card">
      <div className="test-case-warning-card-title">
        <img src={error} />
        <p>About Test Cases</p>
      </div>
      <p className="test-case-warning-card-description">
        If you want the test case to have a line break at the end, be sure to
        add a <code className="test-case-warning-card-code">{"\\n"}</code> at
        the end of the output
      </p>
    </div>
  );
};
