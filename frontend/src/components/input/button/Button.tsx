import spinner from "../../../assets/ring-resize.svg";

interface ButtonProps {
  text: string;
  onClick: () => void;
  loading: boolean;
  background: string;
  height?: string | number;
  icon?: string;
  border?: string;
  fontSize?: number;
  disabled?: boolean;
}

const Button = ({
  text,
  onClick,
  loading,
  background,
  height,
  icon,
  border,
  fontSize,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`relative flex justify-center items-center w-full h-13.75 text-base font-bold rounded-xl border-none text-white ${!disabled && "hover:opacity-[0.8] cursor-pointer"} ${disabled && "opacity-[0.5] cursor-auto"}`}
      onClick={onClick}
      style={{ background, height, border, fontSize }}
      disabled={disabled}
    >
      <div className="flex justify-center items-center w-full gap-3">
        {!loading && icon && <img src={icon} className="w-6 h-6" />}
        {loading ? (
          <img src={spinner} className="w-6 h-6" />
        ) : (
          <span>{text}</span>
        )}
      </div>
    </button>
  );
};

export default Button;
