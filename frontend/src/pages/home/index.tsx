import { useAuthContext } from "../../contexts/AuthContext";
import "./style.css";

const Home = () => {
  const { userData } = useAuthContext();
  console.log(userData);
  return (
    <div>
      <h1>This is home</h1>
    </div>
  );
};
