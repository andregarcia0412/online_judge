import "./style.auth-button.css";
import Spinner from "../../assets/ring-resize.svg";

interface AuthButtonProps {
  text: string;
  onClick: () => void;
  loading: boolean;
  background: string;
}

const AuthButton = ({
  text,
  onClick,
  loading,
  background,
}: AuthButtonProps) => {
  return (
    <button
      type="button"
      className="auth-button"
      onClick={onClick}
      style={{ background: background }}
    >
      {loading ? <img src={Spinner} height={24} width={24} /> : text}
    </button>
  );
};

export default AuthButton;
