import "./style.checkbox.css";
import Check from "../../assets/check.svg";
import React from "react";

interface CheckboxProps {
  label: string | null;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

const Checkbox = ({ label, checked, setChecked }: CheckboxProps) => {
  return (
    <div className="checkbox-container" onClick={() => setChecked(!checked)}>
      <div className={`checkbox ${checked ? "checked" : ""}`}>
        {checked && <img src={Check} />}
      </div>
      {label && <label>{label}</label>}
    </div>
  );
};

export default Checkbox;
