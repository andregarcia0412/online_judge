import githubIcon from "../../../assets/github-original.svg";
import googleIcon from "../../../assets/google-icon-logo-svgrepo-com.svg";
import { Divider } from "../../divider/Divider";
import AuthInput from "../../input/auth-input/AuthInput";
import Button from "../../input/button/Button";
import Checkbox from "../../input/checkbox/Checkbox";

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
    <div className="relative flex flex-col justify-center items-center h-[85vh] min-h-168.75 min-w-87.5 w-120 bg-overlay-subtle backdrop-blur-[5px] border-solid border rounded-[20px] border-border-light p-12.5 z-1">
      <div className="flex flex-col justify-center text-foreground self-start pb-6">
        <h1 className="text-4xl">Register</h1>
        <p className="text-base">Just some details to get you in!</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-6">
        <AuthInput
          placeholder="Username"
          setText={setUsername}
          isPassword={false}
          onKeyDown={handleEnterPress}
        />
        <AuthInput placeholder="Email" setText={setEmail} isPassword={false} />
        <div className="flex flex-col justify-center gap-3 w-full">
          <div className="flex flex-col justify-center items-center w-full gap-6">
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
            checkedColor="linear-gradient(to bottom, var(--color-check-alt-start), var(--color-accent-lighter))"
            label={"Remember me"}
            checked={checked}
            setChecked={setChecked}
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full gap-3">
          <Button
            text="Register"
            onClick={register}
            loading={loading}
            background="linear-gradient(to right, var(--color-action-blue-start) 0%, var(--color-action-blue-mid) 53%, var(--color-action-blue-end) 100%)"
          />
          {errorMessage && <p className="text-danger-strong">{errorMessage}</p>}
        </div>
      </div>

      <Divider text="Or" />

      <div className="flex justify-center items-center gap-8 w-full">
        <img src={googleIcon} className="h-9 w-9 cursor-pointer" />
        <img src={githubIcon} className="h-9 w-9 cursor-pointer invert" />
      </div>

      <p className="absolute text-foreground justify-self-end bottom-[1.5%]">
        Already have an account?{" "}
        <span
          className="font-bold cursor-pointer hover:underline"
          onClick={switchCard}
        >
          Login!
        </span>
      </p>
    </div>
  );
};
