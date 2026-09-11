export const HomeTitle = () => {
  return (
    <div className="flex justify-center items-center flex-col text-center gap-3">
      <h1 className="text-foreground text-5xl">
        Master Your{" "}
        <span className="bg-linear-to-r/srgb from-accent-lighter to-accent bg-clip-text text-transparent">
          Coding Skills
        </span>
      </h1>

      <p className="text-foreground-muted text-xl">
        Practice coding problems, compete in contests, and improve your
        algorithms.
      </p>
    </div>
  );
};
