import "./style.checkbox.css";
import Check from "../../assets/check.svg";
import React from "react";

interface CheckboxProps {
  label: string | null;
}

const Checkbox = (props: CheckboxProps) => {
  const [isChecked, setChecked] = React.useState<boolean>(false);

  return (
    <div className="checkbox-container" onClick={() => setChecked(!isChecked)}>
      <div className={`checkbox ${isChecked ? "checked" : ""}`}>
        {isChecked && <img src={Check} />}
      </div>
      {props.label && <label>{props.label}</label>}
    </div>
  );
};

export default Checkbox;
