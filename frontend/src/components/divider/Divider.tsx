import "./style.divider.css";

interface DividerProps {
  text: string;
}

export const Divider = (props: DividerProps) => {
  return (
    <div className="divider">
      <span>{props.text}</span>
    </div>
  );
};
