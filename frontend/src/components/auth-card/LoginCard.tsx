import AuthButton from "../auth-button/AuthButton";
import AuthInput from "../auth-input/AuthInput";
import Checkbox from "../checkbox/Checkbox";
import { Divider } from "../divider/Divider";
import "./style.auth-card.css";
import GoogleIcon from "../../assets/google-icon-logo-svgrepo-com.svg";
import GithubIcon from "../../assets/github-original.svg";

type AuthCardProps = {
  login: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  loading: boolean;
  errorMessage: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  switchCard: () => void;
};

export const LoginCard = ({
  login,
  setEmail,
  setPassword,
  loading,
  errorMessage,
  checked,
  setChecked,
  switchCard,
}: AuthCardProps) => {
  return (
    <div className="auth-card">
      <div className="auth-card-title">
        <h1>Login</h1>
        <p>Glad you're back!</p>
      </div>
      <div className="inputs-wrapper">
        <AuthInput placeholder="Email" setText={setEmail} isPassword={false} />
        <div className="password-checkbox">
          <AuthInput
            placeholder="Password"
            setText={setPassword}
            isPassword={true}
          />
          <Checkbox
            label={"Remember me"}
            checked={checked}
            setChecked={setChecked}
          />
        </div>

        <div className="button-wrapper">
          <AuthButton
            text="Login"
            onClick={login}
            loading={loading}
            background="linear-gradient(to right, #628eff 0%, #8740cd 53%, #8740cd 100%)"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <a href="/" className="forgot-password-link">
            Forgot password?
          </a>
        </div>
      </div>

      <Divider text="Or" />

      <div className="icons-container">
        <img src={GoogleIcon} />
        <img src={GithubIcon} style={{ filter: "invert(100%)" }} />
      </div>

      <p className="footer-text">
        Don't have an account?{" "}
        <span
          style={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={switchCard}
        >
          Sign Up!
        </span>
      </p>
    </div>
  );
};
