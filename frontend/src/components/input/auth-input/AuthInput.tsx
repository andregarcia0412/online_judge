import React from "react";
import visibility from "../../../assets/visibility.svg";
import visibilityOff from "../../../assets/visibility_off.svg";

interface AuthInputProps {
  placeholder: string;
  setText: (text: string) => void;
  isPassword: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AuthInput = ({
  placeholder,
  setText,
  isPassword,
  onKeyDown,
}: AuthInputProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const authInputStyles =
    "text-white border border-solid border-[#afafaf] rounded-xl outline-none bg-transparent placeholder-white py-3.5 px-4 w-full h-13.75 text-base";

  return (
    <div className="w-full">
      {!isPassword && (
        <input
          className={authInputStyles}
          placeholder={placeholder}
          type="text"
          onChange={(e) => setText(e.target.value)}
          maxLength={100}
          onKeyDown={onKeyDown}
        />
      )}

      {isPassword && (
        <div className="relative flex items-center">
          <input
            className={authInputStyles}
            style={{ paddingRight: "60px" }}
            placeholder={placeholder}
            type={visible ? "text" : "password"}
            onChange={(e) => setText(e.target.value)}
            maxLength={32}
            onKeyDown={onKeyDown}
          />
          <img
            className="absolute left-[88%] cursor-pointer"
            src={visible ? visibilityOff : visibility}
            onClick={() => setVisible(!visible)}
          />
        </div>
      )}
    </div>
  );
};

export default AuthInput;
