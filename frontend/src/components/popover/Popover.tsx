import React, { forwardRef } from "react";
import "./style.popover.css";

type PopoverProps = {
  children: React.ReactNode;
  open: boolean;
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ children, open }: PopoverProps, ref) => {
    const [shouldRender, setShouldRender] = React.useState(open);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      let timer: number | undefined;

      if (open) {
        setShouldRender(true);
        timer = window.setTimeout(() => setVisible(true), 20);
      } else {
        setVisible(false);
      }

      return () => {
        if (timer) window.clearTimeout(timer);
      };
    }, [open]);

    const handleTransitionEnd = () => {
      if (!open) setShouldRender(false);
    };

    if (!shouldRender) return null;

    return (
      <div
        ref={ref}
        className={visible ? "popover visible" : "popover"}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </div>
    );
  },
);
