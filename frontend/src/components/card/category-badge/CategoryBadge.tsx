import CheckCircleWhite from "../../../assets/check_circle_white.svg";
import "./style.category-badge.css";

type CategoryBadgeProps = {
  title: string;
  onClick?: () => void;
  onSelectedClick?: () => void;
  highlighted?: boolean;
  readonly?: boolean;
};

export const CategoryBadge = ({
  title,
  onClick,
  onSelectedClick,
  highlighted,
  readonly,
}: CategoryBadgeProps) => {
  const isMarked = Boolean(highlighted);

  return (
    <div
      className={`category-badge ${isMarked && "marked"} ${readonly && "readonly"}`}
      onClick={() => {
        if (isMarked && onSelectedClick) {
          onSelectedClick();
          return;
        }
        if (onClick) onClick();
      }}
    >
      <div className="category-badge-body">
        {isMarked && <img src={CheckCircleWhite} />}
        <p>{title}</p>
      </div>
    </div>
  );
};
