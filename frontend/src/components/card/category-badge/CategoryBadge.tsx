import CheckCircleWhite from "../../../assets/check_circle_white.svg";

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
      className={`flex justify-center items-center py-1.5 px-4 text-xs bg-[rgba(17, 24, 39, 0.4)] border border-[#30363d] rounded-[10px] cursor-pointer w-fit transition-all duration-100 ease-in ${
        isMarked ? "bg-[#8b5cf6]! border-[#8b5cf6]! font-bold!" : ""
      } ${readonly ? "cursor-auto!" : ""}`}
      onClick={() => {
        if (isMarked && onSelectedClick) {
          onSelectedClick();
          return;
        }
        if (onClick) onClick();
      }}
    >
      <div className="flex justify-center items-center gap-2">
        {isMarked && <img className="h-4 w-4" src={CheckCircleWhite} />}
        <p className={readonly ? "text-white!" : ""}>{title}</p>
      </div>
    </div>
  );
};
