import { StatCard } from "../../components/info-card/StatCard";
import { useAuthContext } from "../../contexts/AuthContext";
import "./style.css";
import Fire from "../../assets/fire.svg";
import TrackChanges from "../../assets/track_changes.svg";
import Trophy from "../../assets/trophy.svg";
import TrendingUp from "../../assets/trending_up.svg";

export const Home = () => {
  const { userData } = useAuthContext();

  return (
    <div className="home-container">
      <div className="stat-cards-container">
        <StatCard
          color="green"
          title="Problems Solved"
          value={userData!.user.total_resolved.toString()}
          icon={TrackChanges}
          description="of 2,342 problems"
        />
        <StatCard
          color="blue"
          title="Points"
          value={userData!.user.points.toString()}
          icon={TrendingUp}
          description="Top 3.5%"
        />
        <StatCard
          color="pink"
          title="Global Ranking"
          value={userData!.user.total_resolved.toString()}
          icon={Trophy}
          description="Top 1.2%"
        />
        <StatCard
          color="orange"
          title="Current Streak"
          value={userData!.user.streak.toString()}
          icon={Fire}
          description="Keep Going!"
        />
      </div>
    </div>
  );
};
