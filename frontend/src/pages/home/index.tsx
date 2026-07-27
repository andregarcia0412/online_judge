import React from "react";
import { useNavigate } from "react-router-dom";
import { problemService } from "../../api/services/problem.service";
import { submissionService } from "../../api/services/submission.service";
import fire from "../../assets/fire.svg";
import search from "../../assets/search.svg";
import trackChanges from "../../assets/track_changes.svg";
import trendingUp from "../../assets/trending_up.svg";
import trophy from "../../assets/trophy.svg";
import { StatCard } from "../../components/card/info-card/StatCard";
import { ProblemCard } from "../../components/card/problem-card/ProblemCard";
import { HomeHeader } from "../../components/home-header/HomeHeader";
import { useAuthContext } from "../../contexts/AuthContext";
import type { Problem } from "../../data/dto/problem.dto";
import type { Submission } from "../../data/dto/submission.dto";
import { useFetch } from "../../hooks/useFetch";
import "./style.css";

export const Home = () => {
  const { user, getUserData } = useAuthContext();
  const navigate = useNavigate();
  const [quickSearchText, setQuickSearchText] = React.useState<string>("");
  const [homeSearchText, setHomeSearchText] = React.useState<string>("");

  const handleSearch = () => {
    console.log("pesquisou");
  };

  React.useEffect(() => {
    getUserData();
  }, [getUserData]);

  const { data: problems } = useFetch<Problem[]>(
    () => problemService.findAll(),
    [],
  );
  const { data: userSubmissions } = useFetch<Submission[]>(
    () => submissionService.getUserSubmissions(),
    [],
  );

  if (!user || !userSubmissions) {
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
          <img src={search} />
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
            value={user.total_resolved.toString()}
            icon={trackChanges}
            description="of 2,342 problems"
          />
          <StatCard
            color="blue"
            title="Points"
            value={user.points.toString()}
            icon={trendingUp}
            description="Top 3.5%"
          />
          <StatCard
            color="pink"
            title="Global Ranking"
            value={user.total_resolved.toString()}
            icon={trophy}
            description="Top 1.2%"
          />
          <StatCard
            color="orange"
            title="Current Streak"
            value={user.streak.toString()}
            icon={fire}
            description="Keep Going!"
          />
        </div>

        <div className="home-problem-card-container">
          <div className="home-problem-card-header">
            <h2>Problems</h2>
            <p>Challenge yourself with coding problems</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
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
    </div>
  );
};
