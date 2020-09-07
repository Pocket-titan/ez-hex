import React, { useContext, ReactNode } from "react";
import ThemeContext from "../ThemeContext";
import styled from "styled-components";
import { Player, Role } from "../hex";

type hsl = string;

const darken = (color: hsl, percentage: string): hsl => {
  let [h, s, l] = color
    .toLowerCase()
    .replace("hsl(", "")
    .replace(")", "")
    .replace(/ /g, "")
    .replace(/%/g, "")
    .split(",")
    .map((n) => parseInt(n, 10));

  console.log("h,s,l", h, s, l, typeof h, typeof s, typeof l);
  return `hsl(${h}, ${s}%, ${Math.max(
    0,
    l - parseInt(percentage.replace("%", ""), 10)
  )}%)`;
};

const InnerHex = styled.div<{ color: hsl; hover_color: hsl }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background-color: ${({ color }) => color};

  &:hover {
    background-color: ${({ hover_color }) => hover_color};
  }
`;

const Hexagon = ({
  style,
  children,
  grid_gap,
  occupied_by,
  is_my_turn,
  role,
}: {
  children?: ReactNode;
  grid_gap: number;
  style: object;
  occupied_by: Player | "empty";
  is_my_turn: boolean;
  role: Role;
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
      <InnerHex
        color={occupied_by === "empty" ? theme.empty : theme[occupied_by]}
        hover_color={
          role !== "spectator" && occupied_by === "empty"
            ? is_my_turn
              ? darken(theme[role], "0%")
              : darken(theme[role], "20%")
            : "none"
        }
      >
        {children}
      </InnerHex>
    </li>
  );
};

export default Hexagon;
