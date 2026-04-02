import Check from "../../../assets/check.svg";
import "./style.checkbox.css";

interface CheckboxProps {
  label: string | null;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  checkedColor?: string;
}

const Checkbox = ({
  label,
  checked,
  setChecked,
  checkedColor,
}: CheckboxProps) => {
  return (
    <div className="checkbox-container" onClick={() => setChecked(!checked)}>
      <div
        className={`checkbox ${checked ? "checked" : ""}`}
        style={checkedColor && checked ? { background: checkedColor } : {}}
      >
        {checked && <img src={Check} />}
      </div>
      {label && <label>{label}</label>}
    </div>
  );
};

export default Checkbox;
