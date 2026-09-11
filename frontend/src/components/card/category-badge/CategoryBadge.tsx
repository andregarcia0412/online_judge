import checkCircleWhite from "../../../assets/check_circle_white.svg";

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
      className={`flex justify-center items-center py-1.5 px-4 text-xs bg-surface border border-border rounded-[10px] cursor-pointer w-fit transition-all duration-100 ease-in ${
        isMarked ? "bg-brand! border-brand! font-bold!" : ""
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
        {isMarked && <img className="h-4 w-4" src={checkCircleWhite} />}
        <p className={readonly ? "text-foreground!" : ""}>{title}</p>
      </div>
    </div>
  );
};
