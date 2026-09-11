type StatCardProps = {
  title: string;
  value: string;
  description: string;
  color: "green" | "blue" | "orange" | "pink";
  icon: string;
};

export const StatCard = ({
  title,
  value,
  description,
  color,
  icon,
}: StatCardProps) => {
  const statCardColors = {
    green: "bg-stat-green",
    blue: "bg-stat-blue",
    orange: "bg-stat-orange",
    pink: "bg-stat-pink",
  };

  return (
    <div className="group flex justify-center items-start flex-col gap-3 bg-surface text-foreground border border-border w-full min-w-34 h-37.5 transition-all duration-100 ease-in py-1 px-5 rounded-xl hover:border-brand">
      <div
        className={`flex items-center p-2 rounded-md max-w-fit transition-transform duration-100 ease-in group-hover:scale-105 ${statCardColors[color]}`}
      >
        <img className="w-5 h-5" src={icon} />
      </div>
      <div className="flex flex-col justify-center gap-0.75">
        <p className="opacity-60 text-xs">{title}</p>
        <h1 className="text-2xl">{value}</h1>
        <p className="opacity-60 text-xs">{description}</p>
      </div>
    </div>
  );
};
