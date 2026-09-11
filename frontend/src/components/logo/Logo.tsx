import code from "../../assets/code.svg";

export const Logo = () => {
  return (
    <div className="flex justify-center items-center h-8 w-8 bg-brand rounded-lg">
      <img draggable={false} src={code} className="h-4.5 w-4.5" />
    </div>
  );
};
