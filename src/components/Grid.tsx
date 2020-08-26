import React from "react";
import Hexagon from "./Hexagon";
import { stringify_points } from "../utils";
import { Board } from "../types";
import { useGame } from "./Game";

type Tile = {
  occupied_by: string;
  grid_coords: {
    x: number;
    y: number;
  };
  screen_coords: {
    x: number;
    y: number;
  };
  points: [number, number][];
};

const Grid = ({ board }: { board: Board }) => {
  let board_size = board.length !== board[0].length ? board.length : 0; // can't handle uneven boards (yet?)
  const radius = 90;
  const strokeWidth = 10;
  const edgeWidth = 20;
  const [width, height] = [Math.sqrt(3) * radius, 2 * radius];

  // const board = [...Array(board_size).keys()]
  //   .map((x) =>
  //     [...Array(board_size).keys()].map((y) => ({
  //       x,
  //       y,
  //       occupied_by: "empty",
  //     }))
  //   )
  //   .flat();

  const tiles: Tile[] = board.flat().map(({ x, y, ...rest }) => {
    // Position the tiles within the grid
    let screen_coords = {
      x: x * width + (y * width) / 2,
      y: y * height - (y * height) / 4,
    };

    return {
      ...rest,
      grid_coords: {
        x,
        y,
      },
      screen_coords,
      // Points of the corners of a hexagon
      points: [
        [width / 2, 0],
        [width, height / 4],
        [width, (3 * height) / 4],
        [width / 2, height],
        [0, (3 * height) / 4],
        [0, height / 4],
      ]
        // Offset corner points by position within grid
        .map(([point_x, point_y]) => [
          screen_coords.x + point_x,
          screen_coords.y + point_y,
        ])
        // Offset by strokeWidth
        .map(
          ([point_x, point_y]) =>
            [
              point_x + strokeWidth / 2,
              point_y + strokeWidth / Math.sqrt(3),
            ] as [number, number]
        )
        // Offset by edgeWidth
        .map(([point_x, point_y]) => [
          point_x + edgeWidth,
          point_y + (2 * edgeWidth) / Math.sqrt(3),
        ]),
    };
  });

  let sides = {
    left: tiles
      .filter(({ grid_coords: { x, y } }) => x === 0)
      .flatMap(({ points }) =>
        // We need the reverse to sort b/c the points go back up after i=3; but we are drawing down
        points.filter((point, i) => i === 3 || i === 4 || i === 5).reverse()
      ),
    top: tiles
      .filter(({ grid_coords: { x, y } }) => y === 0)
      .flatMap(({ points }) =>
        points
          .filter((point, i) => i === 5 || i === 0 || i === 1)
          // Sorting for same reason as above
          .sort((a, b) => a[0] - b[0])
      ),
    right: tiles
      .filter(({ grid_coords: { x, y } }) => x === board_size - 1)
      .flatMap(({ points }) =>
        points.filter((point, i) => i === 0 || i === 1 || i === 2)
      ),
    bottom: tiles
      .filter(({ grid_coords: { x, y } }) => y === board_size - 1)
      .flatMap(({ points }) =>
        // Reversing these for the same reason as mentioned before!
        points.filter((point, i) => i === 4 || i === 3 || i === 2).reverse()
      ),
  };

  return (
    <svg
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {tiles.map(({ grid_coords: { x, y }, points }) => (
        <Hexagon
          key={`${x},${y}`}
          points={points}
          style={{
            stroke: "black",
            strokeWidth,
          }}
        />
      ))}
      {Object.entries(sides).map(([side, points]) => {
        let [x_factor, y_factor] =
          side === "left"
            ? [-1, +1]
            : side === "right"
            ? [+1, -1]
            : side === "top"
            ? [0, -2]
            : [0, +2];

        return (
          <polyline
            key={`side_${side}`}
            fill="none"
            stroke={
              side === "left" || side === "right" ? "hotpink" : "deepskyblue"
            }
            strokeWidth={edgeWidth}
            points={stringify_points(
              points
                // Position line centered on the border of the edge
                .map(([x, y]) => [
                  x + x_factor * (strokeWidth / 2),
                  y + y_factor * (strokeWidth / 2 / Math.sqrt(3)),
                ])
                // Offset line so that it perfectly aligns but doesn't overlap w/ edge
                .map(([x, y]) => [
                  x + x_factor * (edgeWidth / 2),
                  y + y_factor * (edgeWidth / 2 / Math.sqrt(3)),
                ])
            )}
          />
        );
      })}
    </svg>
  );
};

export default (props: object) => {
  const board = useGame((state) => state.board);

  if (!board) {
    return null;
  }

  return <Grid {...props} board={board} />;
};
