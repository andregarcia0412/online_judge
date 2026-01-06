import React from "react";
import LoginCard from "../../components/auth-card/LoginCard";
import "./style.css";
import { LoginSchema } from "../../validations/login.schema";
import { useAuthContext } from "../../contexts/AuthContext";
import { AxiosError } from "axios";

const Auth = () => {
  const { login } = useAuthContext();

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
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
      />
    </div>
  );
};

export default Auth;
