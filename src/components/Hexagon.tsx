import React from "react";
import styled from "styled-components";
import { stringify_points } from "../utils";
import { useGame } from "./Game";

const Polygon = styled.polygon<Pick<Props, "color" | "hover_color">>`
  transition: 250ms;
  cursor: pointer;
  fill: ${({ color }) => color || "lightgray"};

  &:hover {
    fill: ${({ hover_color }) => hover_color || "hotpink"};
  }
`;

type Props = {
  points: [number, number][];
  color: string;
  hover_color: string;
  style?: object;
};

const Hexagon = ({ points, color, hover_color, style = {} }: Props) => {
  return (
    <g>
      <Polygon
        points={stringify_points(points)}
        {...style}
        color={color}
        hover_color={hover_color}
      />
    </g>
  );
};

export default (props: Omit<Props, "color" | "hover_color">) => {
  const role = useGame((state) => state.role);
  const turn = useGame((state) => state.turn);

  let is_my_turn = role === turn;

  return <Hexagon {...props} />;
};
