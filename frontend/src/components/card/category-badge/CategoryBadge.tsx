import React from "react";
import "./style.category-badge.css";
import CheckCircleWhite from "../../../assets/check_circle_white.svg";

type CategoryBadgeProps = {
  title: string;
  onClick: () => void;
};

export const CategoryBadge = ({ title, onClick }: CategoryBadgeProps) => {
  const [isHighlighted, setHighlited] = React.useState<boolean>(false);
  return (
    <div
      className={`category-badge ${isHighlighted && "marked"}`}
      onClick={() => {
        setHighlited(!isHighlighted);
        onClick();
      }}
    >
      <div className="category-badge-body">
        {isHighlighted && <img src={CheckCircleWhite} />}
        <p>{title}</p>
      </div>
    </div>
  );
};
