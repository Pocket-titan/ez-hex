import React from "react";
import styled from "@emotion/styled";
import { stringify_points } from "ts/utils";

const Polygon = styled.polygon<{ color: string; hoverColor: string }>`
  transition: 250ms;
  fill: ${({ color }) => color};

  &:hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

const Hex = ({
  points,
  color,
  hoverColor,
  style = {},
  onClick = () => {},
}: {
  points: [number, number][];
  color: string;
  hoverColor: string;
  style?: object;
  onClick?: () => void;
}) => {
  return (
    <g>
      <Polygon
        points={stringify_points(points)}
        color={color}
        hoverColor={hoverColor}
        style={style}
        onClick={onClick}
        shapeRendering="geometricPrecison"
      />
    </g>
  );
};

export default Hex;
