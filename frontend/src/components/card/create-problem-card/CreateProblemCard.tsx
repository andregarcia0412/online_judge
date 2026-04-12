import type React from "react";
import "./style.create-problem-card.css";

type CreateProblemCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const CreateProblemCard = ({
  title,
  subtitle,
  children,
}: CreateProblemCardProps) => {
  return (
    <div className="create-card">
      <div className="create-card-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {children}
    </div>
  );
};
