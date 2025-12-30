import React from "react";
import type { LoginDto, LoginResponseDto } from "../../data/dto/auth.dto";
import AuthButton from "../auth-button/AuthButton";
import AuthInput from "../auth-input/AuthInput";
import Checkbox from "../checkbox/Checkbox";
import { Divider } from "../divider/Divider";
import "./style.auth-card.css";

type AuthCardProps = {
  login: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  loading: boolean;
  errorMessage: string;
};

const LoginCard = ({
  login,
  setEmail,
  setPassword,
  loading,
  errorMessage,
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
          <Checkbox label={"Remember me"} />
        </div>

        <div className="button-wrapper">
          <AuthButton text="Login" onClick={login} loading={loading} />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <a href="/" className="forgot-password-link">
            Forgot password?
          </a>
        </div>
      </div>

      <Divider text="Or" />
    </div>
  );
};

export default LoginCard;
