import "./style.logo.css";
import Code from "../../assets/code.svg";

export const Logo = () => {
  return (
    <div className="logo-container">
      <img draggable={false} src={Code} />
    </div>
  );
};
