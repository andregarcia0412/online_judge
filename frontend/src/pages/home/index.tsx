import { StatCard } from "../../components/info-card/StatCard";
import { useAuthContext } from "../../contexts/AuthContext";
import "./style.css";
import Fire from "../../assets/fire.svg";
import TrackChanges from "../../assets/track_changes.svg";
import Trophy from "../../assets/trophy.svg";
import TrendingUp from "../../assets/trending_up.svg";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import React from "react";
import { ProfileCard } from "../../components/profile-card/ProfileCard";

export const Home = () => {
  const { userData } = useAuthContext();

  const [quickSearchText, setQuickSearchText] = React.useState<string>("");

  const handleSearch = () => {
    console.log("pesquisou");
  };

  return (
    <div>
      <HomeHeader setText={setQuickSearchText} handleSearch={handleSearch} />
      <div className="home-container">
        <div className="home-title">
          <h1>
            Master Your <span>Coding Skills</span>
          </h1>

          <p>
            Practice coding problems, compete in contests, and improve your
            algorithms.
          </p>
        </div>

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
        <ProfileCard
          username={userData?.user.username}
          email={userData?.user.email}
        />
      </div>
    </div>
  );
};
