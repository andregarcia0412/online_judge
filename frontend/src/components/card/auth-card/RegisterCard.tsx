import Button from "../../input/button/Button";
import AuthInput from "../../input/auth-input/AuthInput";
import Checkbox from "../../input/checkbox/Checkbox";
import { Divider } from "../../divider/Divider";
import "./style.auth-card.css";
import GoogleIcon from "../../../assets/google-icon-logo-svgrepo-com.svg";
import GithubIcon from "../../../assets/github-original.svg";

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
  switchCard: () => void;
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
  switchCard,
}: AuthCardProps) => {
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      register();
    }
  };
  return (
    <div className="auth-card">
      <div className="auth-card-title">
        <h1>Register</h1>
        <p>Just some details to get you in!</p>
      </div>
      <div className="inputs-wrapper">
        <AuthInput
          placeholder="Username"
          setText={setUsername}
          isPassword={false}
          onKeyDown={handleEnterPress}
        />
        <AuthInput placeholder="Email" setText={setEmail} isPassword={false} />
        <div className="password-checkbox">
          <div className="inputs-wrapper">
            <AuthInput
              placeholder="Password"
              setText={setPassword}
              isPassword={true}
              onKeyDown={handleEnterPress}
            />

            <AuthInput
              placeholder="Confirm password"
              setText={setConfirmPassword}
              isPassword={true}
              onKeyDown={handleEnterPress}
            />
          </div>

          <Checkbox
            checkedColor="linear-gradient(to bottom, #5fa0ff, #7d8bff)"
            label={"Remember me"}
            checked={checked}
            setChecked={setChecked}
          />
        </div>

        <div className="button-wrapper">
          <Button
            text="Register"
            onClick={register}
            loading={loading}
            background="linear-gradient(to right, #2E4CEE 0%, #221EBF 53%, #040F75 100%)"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>

      <Divider text="Or" />

      <div className="icons-container">
        <img src={GoogleIcon} />
        <img src={GithubIcon} style={{ filter: "invert(100%)" }} />
      </div>

      <p className="footer-text">
        Already have an account?{" "}
        <span
          style={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={switchCard}
        >
          Login!
        </span>
      </p>
    </div>
  );
};
