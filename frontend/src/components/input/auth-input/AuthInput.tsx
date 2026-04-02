import "./style.auth-input.css";
import Visibility from "../../../assets/visibility.svg";
import VisibilityOff from "../../../assets/visibility_off.svg";
import React from "react";

interface AuthInputProps {
  placeholder: string;
  setText: (text: string) => void;
  isPassword: boolean;
}

const AuthInput = ({ placeholder, setText, isPassword }: AuthInputProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  return (
    <div style={{ width: "100%" }}>
      {!isPassword && (
        <input
          className="auth-input"
          placeholder={placeholder}
          type="text"
          onChange={(e) => setText(e.target.value)}
          maxLength={100}
        />
      )}

      {isPassword && (
        <div className="password-input">
          <input
            className="auth-input"
            style={{paddingRight: "60px"}}
            placeholder={placeholder}
            type={visible ? "text" : "password"}
            onChange={(e) => setText(e.target.value)}
            maxLength={32}
          />
          <img
            src={visible ? VisibilityOff : Visibility}
            onClick={() => setVisible(!visible)}
          />
        </div>
      )}
    </div>
  );
};

export default AuthInput;
