import githubIcon from "../../../assets/github-original.svg";
import googleIcon from "../../../assets/google-icon-logo-svgrepo-com.svg";
import { Divider } from "../../divider/Divider";
import AuthInput from "../../input/auth-input/AuthInput";
import Button from "../../input/button/Button";
import Checkbox from "../../input/checkbox/Checkbox";

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
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center h-[85vh] min-h-168.75 min-w-87.5 w-120 bg-[linear-gradient(rgba(0, 0, 0, 0.14))] backdrop-blur-[5px] border-solid border rounded-[20px] border-[#afafaf] p-12.5 z-1">
      <div className="flex flex-col justify-center text-white self-start pb-6">
        <h1 className="text-4xl">Login</h1>
        <p className="text-base">Glad you're back!</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-6">
        <AuthInput
          placeholder="Email"
          setText={setEmail}
          isPassword={false}
          onKeyDown={handleEnterPress}
        />
        <div className="flex flex-col justify-center gap-3 w-full">
          <AuthInput
            placeholder="Password"
            setText={setPassword}
            isPassword={true}
            onKeyDown={handleEnterPress}
          />
          <Checkbox
            label={"Remember me"}
            checked={checked}
            setChecked={setChecked}
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full gap-3">
          <Button
            text="Login"
            onClick={login}
            loading={loading}
            background="linear-gradient(to right, #628eff 0%, #8740cd 53%, #8740cd 100%)"
          />
          {errorMessage && <p className="text-[#f44336]">{errorMessage}</p>}
          <a href="/" className="text-white no-underline hover:underline">
            Forgot password?
          </a>
        </div>
      </div>

      <Divider text="Or" />

      <div className="flex justify-center items-center gap-8 w-full">
        <img src={googleIcon} className="h-9 w-9 cursor-pointer" />
        <img src={githubIcon} className="h-9 w-9 cursor-pointer invert" />
      </div>

      <p className="absolute text-white justify-self-end bottom-[1.5%]">
        Don't have an account?{" "}
        <span
          className="font-bold cursor-pointer hover:underline"
          onClick={switchCard}
        >
          Sign Up!
        </span>
      </p>
    </div>
  );
};
