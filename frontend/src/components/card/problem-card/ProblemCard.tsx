import { Progress } from "antd";
import type { Problem } from "../../../data/dto/problem.dto";
import "./style.problem-card.css";
import type { Submission } from "../../../data/dto/submission.dto";
import Check from "../../../assets/check-circle.svg";
import Circle from "../../../assets/circle.svg";

type ProblemCardProps = {
  problem: Problem;
  userSubmissions: Submission[];
  onRedirect: () => void;
};

export const ProblemCard = ({
  problem,
  userSubmissions,
  onRedirect,
}: ProblemCardProps) => {
  const color =
    problem.difficulty === "easy"
      ? "#4ADE80"
      : problem.difficulty === "medium"
        ? "#FACC15"
        : "#F87171";
  return (
    <div className="home-problem-card" onClick={onRedirect}>
      <div className="home-problem-status">
        <img
          src={
            userSubmissions.find(
              (submission) => submission.id_problem === problem.id,
            )
              ? Check
              : Circle
          }
        />
      </div>

      <div className="home-problem-title">
        <p>
          {problem.id}. {problem.title}
        </p>
      </div>

      <div className="home-problem-acceptance">
        <Progress
          strokeColor={"#4ADE80"}
          trailColor="#1F2937"
          format={(percent) => (
            <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              {percent}%
            </span>
          )}
          percent={Number(
            ((problem.total_accepted / problem.total_submitted) * 100).toFixed(
              2,
            ),
          )}
        />
      </div>

      <div className="home-problem-difficulty">
        <p style={{ color }}>
          {problem.difficulty[0].toUpperCase() +
            problem.difficulty.substring(1)}
        </p>
      </div>
    </div>
  );
};
