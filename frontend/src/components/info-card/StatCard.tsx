import "./style.info-card.css";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  color: string;
  icon: string;
};

export const StatCard = ({
  title,
  value,
  description,
  color,
  icon,
}: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>
        <img src={icon} />
      </div>
      <div className="stat-card-title">
        <p className="stat-card-subtitle">{title}</p>
        <h1 className="stat-card-value">{value}</h1>
        <p className="stat-card-subtitle">{description}</p>
      </div>
    </div>
  );
};
