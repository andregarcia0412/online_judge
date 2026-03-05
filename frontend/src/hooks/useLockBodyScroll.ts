import React from "react";

export const useLockBodyScroll = (minWidth: number = 900) => {
  React.useEffect(() => {
    const update = () => {
      if (window.innerWidth >= minWidth) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", update);
    };
  }, []);
};
