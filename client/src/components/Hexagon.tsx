import React from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components/macro";
import Color from "color";
import { useSpring } from "react-spring";
import { stringify_points } from "../utils";
import { useGame, useTheme } from "../game";
import { Hex } from "types";

const Polygon = styled.polygon<{ color: string; hover_color: string }>`
  transition: 250ms;
  fill: ${({ color }) => color};

  &:hover {
    fill: ${({ hover_color }) => hover_color};
  }
`;

const Hexagon = ({
  points,
  hex,
  style = {},
}: {
  points: [number, number][];
  hex: Hex;
  style?: object;
}) => {
  const {
    params: { game_id },
  } = useRouteMatch<{ game_id: string }>();
  const { role, turn, socket } = useGame(({ role, game, socket }) => ({
    role,
    turn: game.turn,
    socket,
  }));
  const theme = useTheme((state) => state.theme);

  let is_my_turn = role === turn;

  const { occupied_by } = hex;

  let color = occupied_by === "empty" ? theme.empty : theme[occupied_by];
  let hover_color: string = ((): string => {
    if (occupied_by !== "empty") {
      return theme[occupied_by];
    }

    if (is_my_turn && role !== "spectator") {
      return theme[role];
    }

    if (!is_my_turn && role !== "spectator") {
      return Color(theme.empty).mix(Color(theme[role]), 0.3).hsl().string();
    }

    return theme.empty;
  })();

  return (
    <g>
      <Polygon
        points={stringify_points(points)}
        style={{
          ...style,
          stroke: theme.border,
          cursor:
            role === "spectator"
              ? "not-allowed"
              : !is_my_turn
              ? "wait"
              : occupied_by !== "empty"
              ? "not-allowed"
              : "pointer",
        }}
        color={color}
        hover_color={hover_color}
        onClick={(event) => {
          if (role === "spectator" || !is_my_turn || occupied_by !== "empty") {
            return;
          }

          socket.emit("MOVE", {
            game_id,
            hex: {
              x: hex.x,
              y: hex.y,
              occupied_by: role,
            },
          });
        }}
      />
    </g>
  );
};

export default Hexagon;
