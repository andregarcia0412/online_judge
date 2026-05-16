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
    green: "bg-[rgba(34,197,94,0.1)]",
    blue: "bg-[rgba(59,130,246,0.1)]",
    orange: "bg-[rgba(249,115,22,0.1)]",
    pink: "bg-[rgba(236,72,153,0.1)]",
  };

  return (
    <div className="group flex justify-center items-start flex-col gap-3 bg-[rgba(17,24,39,0.4)] text-white border border-[#30363d] w-full min-w-34 h-37.5 transition-all duration-100 ease-in py-1 px-5 rounded-xl hover:border-[#8b5cf6]">
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
