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
import type { Problem } from "../../data/dto/problem.dto";
import { problemService } from "../../api/services/problem.service";
import { ProblemCard } from "../../components/card/problem-card/ProblemCard";
import type { Submission } from "../../data/dto/submission.dto";
import { userService } from "../../api/services/user.service";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { userData, getUserData } = useAuthContext();
  const navigate = useNavigate();
  const [quickSearchText, setQuickSearchText] = React.useState<string>("");
  const [homeSearchText, setHomeSearchText] = React.useState<string>("");
  const [problems, setProblems] = React.useState<Problem[] | null>(null);
  const [userSubmissions, setUserSubmissions] = React.useState<
    Submission[] | null
  >(null);

  const handleSearch = () => {
    console.log("pesquisou");
  };

  if (!userData) {
    return;
  }

  React.useEffect(() => {
    const getProblems = async () => {
      try {
        const response = await problemService.findAll();
        setProblems(response);
      } catch (e) {
        throw e;
      }
    };

    const reloadUser = async () => {
      try {
        getUserData(userData.user.id);
      } catch (e) {
        throw e;
      }
    };

    const getUserSubmissions = async () => {
      try {
        const response = await userService.getSubmissionsById(userData.user.id);
        setUserSubmissions(response);
      } catch (e) {
        throw e;
      }
    };

    reloadUser();
    getProblems();
    getUserSubmissions();
  }, []);

  if (!userSubmissions) {
    return null;
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

        <div className="home-problem-card-container">
          <div className="home-problem-card-header">
            <h2>Problems</h2>
            <p>Challenge yourself with coding problems</p>
          </div>

          <div className="home-problem-card-title">
            <p>Status</p>
            <p>Title</p>
            <p>Acceptance</p>
            <p>Difficulty</p>
          </div>

          <div className="home-problem-card-wrapper">
            {problems?.map((problem: Problem) => {
              return (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  userSubmissions={userSubmissions}
                  onRedirect={() => navigate(`/problem/${problem.id}`)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
