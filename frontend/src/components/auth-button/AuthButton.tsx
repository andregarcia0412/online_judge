import "./style.auth-button.css";

interface AuthButtonProps {
  text: string;
  onClick: () => void;
}

const AuthButton = (props: AuthButtonProps) => {
  return (
    <button type="button" className="auth-button" onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default AuthButton;
