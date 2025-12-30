import React from "react";
import LoginCard from "../../components/auth-card/LoginCard";
import "./style.css";
import { login } from "../../api/services/auth.service";
import { ZodError } from "zod";

const Auth = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      if (loading) {
        return;
      }

      const data = await login(email, password);
      localStorage.setItem("@token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data));
      setErrorMessage("");
    } catch (e) {
      console.log(e);
      if (e instanceof ZodError) {
        setErrorMessage(e.issues[0].message);
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
      />
    </div>
  );
};

export default Auth;
