import React, { useContext, ReactNode } from "react";
import ThemeContext from "./ThemeContext";

const Hexagon = ({
  style,
  children,
  grid_gap,
}: {
  children?: ReactNode;
  grid_gap: number;
  style: object;
}) => {
  const ASPECT_RATIO = 2 / Math.sqrt(3);
  const { theme } = useContext(ThemeContext);

  return (
    <li
      style={{
        ...style,
        position: "relative",
        height: 0,
        paddingBottom: `${ASPECT_RATIO * 100}%`,
        zIndex: 2,
      }}
    >
      <div
        className="hexagon"
        style={{
          position: "absolute",
          left: -grid_gap / 2 - 1,
          top: -grid_gap / 2 - 1,
          height: `calc(100% + ${grid_gap + 1}px)`,
          width: `calc(100% + ${grid_gap + 1}px)`,
          backgroundColor: theme.border,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 1,
          clipPath:
            "polygon(50% calc(0% - 0px), calc(100% + 0px) 25%, calc(100% + 0px) 75%, 50% calc(100% + 0px), calc(0% - 0px) 75%, calc(0% - 0px) 25%)",
        }}
      ></div>
      <div
        className="hexagon"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
          // overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.empty,
          cursor: "pointer",
          zIndex: 2,
          clipPath:
            "polygon(50% calc(0% - 0px), calc(100% + 0px) 25%, calc(100% + 0px) 75%, 50% calc(100% + 0px), calc(0% - 0px) 75%, calc(0% - 0px) 25%)",
        }}
      >
        {children}
      </div>
    </li>
  );
};

export default Hexagon;
