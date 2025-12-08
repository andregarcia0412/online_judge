import AuthButton from "../auth-button/AuthButton";
import AuthInput from "../auth-input/AuthInput";
import Checkbox from "../checkbox/Checkbox";
import { Divider } from "../divider/Divider";
import "./style.auth-card.css";

const AuthCard = () => {
  return (
    <div className="auth-card">
      <div className="auth-card-title">
        <h1>Login</h1>
        <p>Glad you're back!</p>
      </div>
      <div className="inputs-wrapper">
        <AuthInput type="text" placeholder="Username or email" />
        <div className="password-checkbox">
          <AuthInput type="password" placeholder="Password" />
          <Checkbox label={"Remember me"} />
        </div>

        <div className="button-wrapper">
          <AuthButton text="Login" onClick={() => console.log("clicou")} />
          <a href="/" className="forgot-password-link">
            Forgot password?
          </a>
        </div>
      </div>

      <Divider text="Or" />
    </div>
  );
};

export default AuthCard;
