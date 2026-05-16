import type React from "react";

type CreateProblemCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const CreateProblemCard = ({
  title,
  subtitle,
  children,
}: CreateProblemCardProps) => {
  return (
    <div className="relative flex flex-col w-full bg-[rgba(17,24,39,0.4)] border border-[#30363d] text-white py-6 px-8 rounded-xl gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-normal">{title}</h2>
        {subtitle && <p className="opacity-70">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
};
