import { Progress } from "antd";
import check from "../../../assets/check-circle.svg";
import circle from "../../../assets/circle.svg";
import whiteCircle from "../../../assets/circle_white.svg";
import type { Problem } from "../../../data/dto/problem.dto";
import type { Submission } from "../../../data/dto/submission.dto";

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

  const iconSrc = () => {
    const submission = userSubmissions.find(
      (submission) => submission.id_problem === problem.id,
    );

    if (!submission) {
      return whiteCircle;
    }

    const acceptedSubmission = userSubmissions.find(
      (submission) =>
        submission.id_problem === problem.id &&
        submission.status === "accepted",
    );

    if (acceptedSubmission) {
      return check;
    }

    return circle;
  };
  return (
    <div
      className="grid grid-cols-[32px_minmax(260px,1fr)_220px_90px] items-center gap-x-7 w-full bg-[rgba(17,24,39,0.4)] border border-[#30363d] text-white py-5 px-6 rounded-xl cursor-pointer transition-colors duration-150 ease hover:border-[#8b5cf6]"
      onClick={onRedirect}
    >
      <div className="flex items-center justify-center">
        <img src={iconSrc()} />
      </div>

      <div>
        <p>
          {problem.id}. {problem.title}
        </p>
      </div>

      <div className="min-w-55">
        <Progress
          strokeColor={"#4ADE80"}
          railColor="#1F2937"
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

      <div className="text-left font-semibold">
        <p style={{ color }}>
          {problem.difficulty[0].toUpperCase() +
            problem.difficulty.substring(1)}
        </p>
      </div>
    </div>
  );
};
