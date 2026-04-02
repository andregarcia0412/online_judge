import React from "react";
import Fire from "../../assets/fire.svg";
import TrackChanges from "../../assets/track_changes.svg";
import TrendingUp from "../../assets/trending_up.svg";
import Trophy from "../../assets/trophy.svg";
import { StatCard } from "../../components/card/info-card/StatCard";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import { useAuthContext } from "../../contexts/AuthContext";
import Search from "../../assets/search.svg";
import "./style.css";

export const Home = () => {
  const { userData } = useAuthContext();
  const [quickSearchText, setQuickSearchText] = React.useState<string>("");
  const [homeSearchText, setHomeSearchText] = React.useState<string>("");

  const handleSearch = () => {
    console.log("pesquisou");
  };

  if (!userData) {
    return;
  }

  return (
    <div>
      <HomeHeader
        setText={setQuickSearchText}
        handleSearch={handleSearch}
        text={quickSearchText}
      />
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

        <div className="home-search-input">
          <img src={Search} />
          <input
            type="text"
            placeholder="Search problem by name or ID"
            value={homeSearchText}
            onChange={(e) => setHomeSearchText(e.target.value)}
          ></input>
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
      </div>
    </div>
  );
};
