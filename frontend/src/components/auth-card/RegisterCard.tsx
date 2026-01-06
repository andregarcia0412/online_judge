import AuthButton from "../auth-button/AuthButton";
import AuthInput from "../auth-input/AuthInput";
import Checkbox from "../checkbox/Checkbox";
import { Divider } from "../divider/Divider";
import "./style.auth-card.css";
import GoogleIcon from "../../assets/google-icon-logo-svgrepo-com.svg";
import GithubIcon from "../../assets/github-original.svg";

type AuthCardProps = {
  register: () => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  loading: boolean;
  errorMessage: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  isRegister: boolean;
  setIsRegister: (isRegister: boolean) => void;
};

export const RegisterCard = ({
  register,
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  loading,
  errorMessage,
  checked,
  setChecked,
  isRegister,
  setIsRegister,
}: AuthCardProps) => {
  return (
    <div className="auth-card">
      <div className="auth-card-title">
        <h1>Register</h1>
        <p>Glad you're back!</p>
      </div>
      <div className="inputs-wrapper">
        <AuthInput
          placeholder="Username"
          setText={setUsername}
          isPassword={false}
        />
        <AuthInput placeholder="Email" setText={setEmail} isPassword={false} />
        <div className="password-checkbox">
          <AuthInput
            placeholder="Password"
            setText={setPassword}
            isPassword={true}
          />

          <AuthInput
            placeholder="Confirm password"
            setText={setConfirmPassword}
            isPassword={true}
          />

          <Checkbox
            label={"Remember me"}
            checked={checked}
            setChecked={setChecked}
          />
        </div>

        <div className="button-wrapper">
          <AuthButton text="Login" onClick={register} loading={loading} />
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

      <p className="footer-text" onClick={() => setIsRegister(!isRegister)}>
        Don't have an account?{" "}
        <span
          style={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => console.log("Redirect to Sign Up")}
        >
          Sign Up!
        </span>
      </p>
    </div>
  );
};
