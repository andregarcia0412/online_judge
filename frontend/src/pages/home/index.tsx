import React from "react";
import { useNavigate } from "react-router-dom";
import { problemService } from "../../api/services/problem.service";
import { submissionService } from "../../api/services/submission.service";
import fire from "../../assets/fire.svg";
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
import { HomeSearch } from "./components/HomeSearch";
import "./style.css";
import { HomeTitle } from "./components/HomeTitle";

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
    <>
      <HomeHeader
        setText={setQuickSearchText}
        handleSearch={handleSearch}
        text={quickSearchText}
      />
      <div className="home-container w-full h-screen p-6 mt-8">
        <HomeTitle />

        <HomeSearch
          value={homeSearchText}
          onChange={(e) => setHomeSearchText(e.target.value)}
        />

        <div className="grid grid-cols-4 gap-5 w-full">
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

        <div>
          <div className="mt-16 mb-8 text-white">
            <h2>Problems</h2>
            <p className="opacity-60">
              Challenge yourself with coding problems
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="home-problem-card-title">
              <p>Status</p>
              <p>Title</p>
              <p>Acceptance</p>
              <p>Difficulty</p>
            </div>

            <div className="flex flex-col gap-4">
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
    </>
  );
};
