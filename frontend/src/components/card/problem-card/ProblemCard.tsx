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
      ? "var(--color-success)"
      : problem.difficulty === "medium"
        ? "var(--color-warning)"
        : "var(--color-danger)";

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
      className="grid grid-cols-[32px_minmax(260px,1fr)_220px_90px] items-center gap-x-7 w-full bg-surface border border-border text-foreground py-5 px-6 rounded-xl cursor-pointer transition-colors duration-150 ease hover:border-brand"
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
          strokeColor={"var(--color-success)"}
          railColor="var(--color-surface-strong)"
          format={(percent) => (
            <span style={{ color: "var(--color-foreground-translucent)" }}>
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
