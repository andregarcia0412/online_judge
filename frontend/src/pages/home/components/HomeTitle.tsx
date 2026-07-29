export const HomeTitle = () => {
  return (
    <div className="flex justify-center items-center flex-col text-center gap-3">
      <h1 className="text-white text-5xl">
        Master Your{" "}
        <span className="bg-linear-to-r/srgb from-[#7d8bff] to-[#3b82f6] bg-clip-text text-transparent">
          Coding Skills
        </span>
      </h1>

      <p className="text-[#9ca3af] text-xl">
        Practice coding problems, compete in contests, and improve your
        algorithms.
      </p>
    </div>
  );
};
