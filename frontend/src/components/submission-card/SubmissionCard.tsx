import type { ReactNode } from "react";
import "./style.submission-card.css";

type SubmissionCardProps = {
  children: ReactNode;
};

export const SubmissionCard = ({ children }: SubmissionCardProps) => {
  return <div className="submission-card">{children}</div>;
};
