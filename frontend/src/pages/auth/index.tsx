import React from "react";
import LoginCard from "../../components/auth-card/LoginCard";
import "./style.css";
import { LoginSchema } from "../../validations/login.schema";
import { useAuthContext } from "../../contexts/AuthContext";

const Auth = () => {
  const { userData, login } = useAuthContext();

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const parsed = LoginSchema.safeParse({ email, password });

      if (!parsed.success) {
        setErrorMessage(parsed.error.issues[0].message);
        return;
      }

      await login({ email, password }, checked);
      setErrorMessage("");
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        return;
      }
      setErrorMessage("Invalid email or password");
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
