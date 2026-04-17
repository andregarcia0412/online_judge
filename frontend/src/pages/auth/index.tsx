import React from "react";
import { LoginCard } from "../../components/card/auth-card/LoginCard";
import { LoginSchema } from "../../validations/login.schema";
import { useAuthContext } from "../../contexts/AuthContext";
import { AxiosError } from "axios";
import { RegisterCard } from "../../components/card/auth-card/RegisterCard";
import { RegisterSchema } from "../../validations/register.schema";
import { registerService } from "../../api/services/auth.service";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

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

      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrorMessage(e.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (loading) {
      return;
    }

    const parsed = RegisterSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await registerService({ username, email, password });
      await login({ email, password }, checked);
      setErrorMessage("");

      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrorMessage(e.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchCard = (): void => {
    setIsRegister(!isRegister);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setChecked(false);
  };

  if (isRegister) {
    return (
      <div className="flex justify-between items-center p-10 bg-[#0f0f0f] w-full min-h-screen">
        <h1 className="text-white text-[84px] font-normal">Roll the Carpet!</h1>
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
          switchCard={switchCard}
        />
        <div className="absolute left-[60%] top-[3%] h-75.5 w-75.5 rounded-full bg-linear-to-b from-[#190061] to-[#0a1b30]" />
        <div className="absolute left-[85%] top-[75%] h-55 w-55 rounded-full bg-[linear-gradient(60deg,#190061,#0a1b30)]" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-10 bg-[#0f0f0f] w-full min-h-screen">
      <h1 className="text-white text-[84px] font-normal">Welcome Back!</h1>
      <LoginCard
        login={handleLogin}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        errorMessage={errorMessage}
        checked={checked}
        setChecked={setChecked}
        switchCard={switchCard}
      />
      <div className="absolute left-[60%] top-[3%] h-75.5 w-75.5 rounded-full bg-linear-to-b from-[#530061] to-[#0d0a30]" />
      <div className="absolute left-[85%] top-[75%] h-55 w-55 rounded-full bg-[linear-gradient(60deg,#300061,#0a1030)]" />
    </div>
  );
};
