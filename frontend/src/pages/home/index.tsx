import { useAuthContext } from "../../contexts/AuthContext";
import "./style.css";

export const Home = () => {
  const { userData } = useAuthContext();
  console.log(userData);
  return (
    <div>
      <h1>This is home</h1>
    </div>
  );
};
