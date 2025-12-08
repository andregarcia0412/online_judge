import "./style.auth-input.css";

interface AuthInputProps {
  placeholder: string;
  type: string;
}

const AuthInput = (props: AuthInputProps) => {
  return (
    <div style={{ width: "100%" }}>
      <input
        className="auth-input"
        placeholder={props.placeholder}
        type={props.type}
      />
    </div>
  );
};

export default AuthInput;
