import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import _ from "lodash";
import Hexagon from "./Hexagon";
import { stringify_points, midpoint, first, last } from "../utils";
import { useGame, useTheme } from "../game";

type Tile = {
  hex: import("types").Hex;
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

const Grid = ({
  radius = 60,
  strokeWidth = 5,
  edgeWidth = 20,
}: {
  radius?: number;
  strokeWidth?: number;
  edgeWidth?: number;
}) => {
  const ref = useRef<SVGSVGElement>();
  const board = useGame((state) => state.game.board);
  const theme = useTheme((state) => state.theme);
  const [{ width, height, x, y }, setDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!ref.current || board.length === 0) {
      return;
    }

    let { width, height, x, y } = ref.current.getBBox({
      stroke: true, // doesn't work :(
      fill: true,
    });

    setDimensions({
      width: width + 1 * edgeWidth,
      height: height + 1.4 * edgeWidth,
      x: x - edgeWidth,
      y: y - edgeWidth,
    });
  }, [ref.current, board]);

  const [hex_width, hex_height] = [Math.sqrt(3) * radius, 2 * radius];

  const tiles: Tile[] = board.flat().map(({ x, y, ...rest }) => {
    // Position the tiles within the grid
    let screen_coords = {
      x: x * hex_width + (y * hex_width) / 2,
      y: y * hex_height - (y * hex_height) / 4,
    };

    return {
      hex: {
        x,
        y,
        ...rest,
      },
      grid_coords: {
        x,
        y,
      },
      screen_coords,
      // Points of the corners of a hexagon
      points: [
        [hex_width / 2, 0],
        [hex_width, hex_height / 4],
        [hex_width, (3 * hex_height) / 4],
        [hex_width / 2, hex_height],
        [0, (3 * hex_height) / 4],
        [0, hex_height / 4],
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

  // Find the hexes on the sides, where the stroke indicating each players side should go
  let sides = _.mapValues(
    {
      left: tiles
        .filter(({ grid_coords: { x, y } }) => x === 0)
        .flatMap(({ points }) =>
          // We need the reverse to sort b/c the points go back up after i=3; but we are drawing down
          points.filter((point, i) => i === 3 || i === 4 || i === 5).reverse()
        )
        // Drop the last point
        .filter((point, i, arr) => (i === arr.length - 1 ? false : true)),
      top: tiles
        .filter(({ grid_coords: { x, y } }) => y === 0)
        .flatMap(({ points }) =>
          points
            .filter((point, i) => i === 5 || i === 0 || i === 1)
            // Sorting for same reason as above
            .sort((a, b) => a[0] - b[0])
        ) // Drop the last point
        .filter((point, i, arr) => (i === arr.length - 1 ? false : true)),
      right: tiles
        .filter(({ grid_coords: { x, y } }) => x === board.length - 1)
        .flatMap(({ points }) =>
          points.filter((point, i) => i === 0 || i === 1 || i === 2)
        )
        // Drop the first point
        .filter((point, i, arr) => i !== 0),
      bottom: tiles
        .filter(({ grid_coords: { x, y } }) => y === board.length - 1)
        .flatMap(({ points }) =>
          // Reversing these for the same reason as mentioned before!
          points.filter((point, i) => i === 4 || i === 3 || i === 2).reverse()
        )
        // Drop the first point
        .filter((point, i, arr) => i !== 0),
    },
    (points, side) => {
      let [x_factor, y_factor] =
        side === "left"
          ? [-1, +1]
          : side === "right"
          ? [+1, -1]
          : side === "top"
          ? [0, -2]
          : [0, +2];

      // Position line centered on the border of the edge, then offset line
      // so that it perfectly aligns but doesn't overlap w/ edge
      let [x_offset, y_offset] = [
        (x_factor * (strokeWidth + edgeWidth)) / 2,
        (y_factor * (strokeWidth + edgeWidth)) / 2 / Math.sqrt(3),
      ];

      let offset_points = points.map(
        ([x, y]) => [x + x_offset, y + y_offset] as [number, number]
      );

      return offset_points;
    }
  );

  return (
    <div
      style={{
        flex: 1,
        height: "85%",
        width: "85%",
      }}
    >
      <svg
        ref={(_ref: SVGSVGElement) => (ref.current = _ref)}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`${0} ${0} ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {tiles.map(({ grid_coords: { x, y }, hex, points }) => (
          <Hexagon
            key={`${x},${y}`}
            points={points}
            hex={hex}
            style={{
              strokeWidth,
            }}
          />
        ))}
        {Object.entries(sides).map(([side, points]) => {
          if (points.length === 0) {
            return null;
          }

          let pts: [number, number][] = points;

          if (side === "left") {
            let last_point = midpoint(last(sides.left), first(sides.bottom));
            pts = [...points, last_point];
          }

          if (side === "bottom") {
            let first_point = midpoint(last(sides.left), first(sides.bottom));
            // let last_point = midpoint(last(sides.bottom), last(sides.right));
            pts = [first_point, ...points];
          }

          if (side === "right") {
            let first_point = midpoint(last(sides.top), first(sides.right));
            pts = [first_point, ...points];
          }

          if (side === "top") {
            let last_point = midpoint(last(sides.top), first(sides.right));
            pts = [...points, last_point];
          }

          return (
            <polyline
              key={`side_${side}`}
              fill="none"
              stroke={
                side === "left" || side === "right"
                  ? theme.player_one
                  : theme.player_two
              }
              strokeWidth={edgeWidth}
              strokeLinecap="butt"
              points={stringify_points(pts)}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Grid;
