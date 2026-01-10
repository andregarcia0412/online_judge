import "./style.profile-card.css";
import Person from "../../assets/person.svg";

type ProfileCardProps = {
  username: string;
  email: string;
};

export const ProfileCard = ({ username, email }: ProfileCardProps) => {
  return (
    <div className="profile-card-container">
      <div className="profile-card-header"></div>
      <div className="profile-picture-container">
        <img src={Person} />
      </div>
      <div className="profile-card-title">
        <h1>{username}</h1>
        <p>{email}</p>
      </div>
    </div>
  );
};
