import React from "react";
import { LoginCard } from "../../components/auth-card/LoginCard";
import "./style.css";
import { LoginSchema } from "../../validations/login.schema";
import { useAuthContext } from "../../contexts/AuthContext";
import { AxiosError } from "axios";
import { RegisterCard } from "../../components/auth-card/RegisterCard";

export const Auth = () => {
  const { login } = useAuthContext();

  const [isRegister, setIsRegister] = React.useState<boolean>(false);

  const [username, setUsername] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (loading) {
      return;
    }

    const parsed = LoginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await login({ email, password }, checked);
      setErrorMessage("");
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrorMessage(e.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    console.log("hello world");
  };

  if (isRegister) {
    return (
      <div className="auth-container">
        <RegisterCard
          register={handleRegister}
          setUsername={setUsername}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          errorMessage={errorMessage}
          checked={checked}
          setChecked={setChecked}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <LoginCard
        login={handleLogin}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        errorMessage={errorMessage}
        checked={checked}
        setChecked={setChecked}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </div>
  );
};
