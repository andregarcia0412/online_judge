import Check from "../../../assets/check.svg";

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
    <div
      className="flex items-center text-white gap-2.5 w-fit"
      onClick={() => setChecked(!checked)}
    >
      <div
        className={`flex justify-center items-center w-4 h-4 bg-white rounded-sm ${checked ? "bg-linear-to-b from-[#7cc1f3] to-[#d27eef]" : ""}`}
        style={checkedColor && checked ? { background: checkedColor } : {}}
      >
        {checked && <img src={Check} className="w-4 h-4" />}
      </div>
      {label && <label>{label}</label>}
    </div>
  );
};

export default Checkbox;
