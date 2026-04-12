import "./style.button.css";
import Spinner from "../../../assets/ring-resize.svg";

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
      className={`button ${disabled && "disabled"}`}
      onClick={onClick}
      style={{ background, height, border, fontSize }}
      disabled={disabled}
    >
      <div className="button-icon">
        {!loading && icon && <img src={icon} />}
        {loading ? (
          <img src={Spinner} height={24} width={24} />
        ) : (
          <span>{text}</span>
        )}
      </div>
    </button>
  );
};

export default Button;
