import React, { Ref, useContext } from "react";
import Measure from "react-measure";
import Hexagon from "./Hexagon";
import ThemeContext from "../ThemeContext";
import { Role, Board } from "../hex";

const to_path = (points: number[][]) =>
  points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");

const deg_to_rad = (degrees: number) => (degrees * Math.PI) / 180;

const long_side = (length: number) => Math.sin(deg_to_rad(60)) * length;

const short_side = (length: number) => Math.cos(deg_to_rad(60)) * length;

const Grid = React.forwardRef(
  (
    {
      board,
      role,
      is_my_turn,
      width = -1,
      height = -1,
    }: {
      board: Board;
      role: Role;
      is_my_turn: boolean;
      width?: number;
      height?: number;
    },
    ref: Ref<HTMLUListElement>
  ) => {
    const { theme } = useContext(ThemeContext);

    let grid_size = board.length;

    const GAP = 4;
    const PADDING = 20;
    const STROKE_WIDTH = 10;
    // const BORDER_GAP = GAP;
    const BORDER_GAP = 0;

    const {
      num_columns,
      num_rows,
      column_span,
      row_span,
      calculate_position,
    } = {
      num_columns: 2 * grid_size + (grid_size - 1),
      num_rows: 3 * grid_size + 1,
      column_span: 2,
      row_span: 4,
      calculate_position: (x: number, y: number) => ({
        row_start: 1 + y * 3,
        column_start: 1 + x * 2 + y,
      }),
    };

    const hexagons = board
      .map((row, x) => row.map((hex, y) => ({ ...hex, coords: [x, y] })))
      .flat()
      .map(({ coords: [x, y], ...hex }) => {
        let { row_start, column_start } = calculate_position(x, y);

        return {
          x,
          y,
          row_start,
          column_start,
          row_span,
          column_span,
          grid_gap: GAP,
          ...hex,
        };
      });

    let cell_width = (width - 2 * PADDING) / num_columns;
    let cell_height = (height - 2 * PADDING) / num_rows;

    let offset = BORDER_GAP / Math.sqrt(2);

    const adjust = (
      points: number[][],
      { column_start, row_start }: { column_start: number; row_start: number }
    ) =>
      points
        .map(([x, y]) => [
          x + (column_start - 1) * cell_width,
          y + (row_start - 1) * cell_height,
        ])
        .map(([x, y]) => [x - offset, y - offset])
        .map(([x, y]) => [x, y + cell_height])
        .map(([x, y]) => [x + PADDING, y + PADDING]);

    const edges = {
      left: to_path(
        hexagons
          .filter(({ x, y }) => x === 0)
          .flatMap(({ column_start, row_start }, index, arr) => {
            let first = index === 0;
            let last = index === arr.length - 1;

            let points = first
              ? [
                  [0.5 * cell_width, -0.5 * cell_height],
                  [0, 0],
                  [0, 2 * cell_height],
                  [cell_width, 3 * cell_height],
                ].map(([x, y], i) =>
                  i === 0 || i === 1
                    ? [
                        x - long_side(STROKE_WIDTH / 2),
                        y - short_side(STROKE_WIDTH / 2),
                      ]
                    : [
                        x - long_side(STROKE_WIDTH / 2),
                        y + short_side(STROKE_WIDTH / 2),
                      ]
                )
              : last
              ? [
                  [0, 0],
                  [0, 2 * cell_height],
                  [0.5 * cell_width, 2.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1
                    ? [
                        x - long_side(STROKE_WIDTH / 2),
                        y + short_side(STROKE_WIDTH / 2),
                      ]
                    : [
                        x - long_side(STROKE_WIDTH / 2),
                        y + short_side(STROKE_WIDTH / 2),
                      ]
                )
              : [
                  [0, 0],
                  [0, 2 * cell_height],
                  [cell_width, 3 * cell_height],
                ].map(([x, y]) => [
                  x - long_side(STROKE_WIDTH / 2),
                  y + short_side(STROKE_WIDTH / 2),
                ]);

            return adjust(points, { column_start, row_start });
          })
      ),
      top: to_path(
        hexagons
          .filter(({ x, y }) => y === 0)
          .flatMap(({ column_start, row_start }, index, arr) => {
            let first = index === 0;
            let last = index === arr.length - 1;

            let points = first
              ? [
                  [0.5 * cell_width, -0.5 * cell_height],
                  [cell_width, -cell_height],
                  [2 * cell_width, 0],
                ].map(([x, y], i) =>
                  i === 0
                    ? [
                        x - long_side(STROKE_WIDTH / 2),
                        y - short_side(STROKE_WIDTH / 2),
                      ]
                    : [x, y - STROKE_WIDTH / 2]
                )
              : last
              ? [
                  [0, 0],
                  [cell_width, -cell_height],
                  [1.5 * cell_width, -0.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1
                    ? [
                        x + long_side(STROKE_WIDTH / 2),
                        y - short_side(STROKE_WIDTH / 2),
                      ]
                    : [x, y - STROKE_WIDTH / 2]
                )
              : [
                  [0, 0],
                  [cell_width, -cell_height],
                  [2 * cell_width, 0],
                ]
                  .map(([x, y]) => [x, y - STROKE_WIDTH / 2])
                  .map(([x, y], i, arr) =>
                    i === 0 ? [x, y] : i === arr.length - 1 ? [x, y] : [x, y]
                  );

            return adjust(points, { column_start, row_start });
          })
      ),
      right: to_path(
        hexagons
          .filter(({ x, y }) => x === grid_size - 1)
          .flatMap(({ column_start, row_start }, index, arr) => {
            let first = index === 0;
            let last = index === arr.length - 1;

            let points = first
              ? [
                  [1.5 * cell_width, -0.5 * cell_height],
                  [2 * cell_width, 0],
                  [2 * cell_width, 2 * cell_height],
                ].map(([x, y], i) =>
                  i === 0 || i === 1
                    ? [
                        x + long_side(STROKE_WIDTH / 2),
                        y - short_side(STROKE_WIDTH / 2),
                      ]
                    : [
                        x + long_side(STROKE_WIDTH / 2),
                        y - short_side(STROKE_WIDTH / 2),
                      ]
                )
              : last
              ? [
                  [2 * cell_width, 0],
                  [2 * cell_width, 2 * cell_height],
                  [1.5 * cell_width, 2.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1 || i === arr.length - 2
                    ? [
                        x + long_side(STROKE_WIDTH / 2),
                        y + short_side(STROKE_WIDTH / 2),
                      ]
                    : [
                        x + long_side(STROKE_WIDTH / 2),
                        y - short_side(STROKE_WIDTH / 2),
                      ]
                )
              : [
                  [2 * cell_width, 0],
                  [2 * cell_width, 2 * cell_height],
                ].map(([x, y]) => [
                  x + long_side(STROKE_WIDTH / 2),
                  y - short_side(STROKE_WIDTH / 2),
                ]);

            return adjust(points, { column_start, row_start });
          })
      ),
      bottom: to_path(
        hexagons
          .filter(({ x, y }) => y === grid_size - 1)
          .flatMap(({ column_start, row_start }, index, arr) => {
            let first = index === 0;
            let last = index === arr.length - 1;

            let points = first
              ? [
                  [0.5 * cell_width, 2.5 * cell_height],
                  [cell_width, 3 * cell_height],
                  [2 * cell_width, 2 * cell_height],
                ].map(([x, y], i) =>
                  i === 0
                    ? [
                        x - long_side(STROKE_WIDTH / 2),
                        y + short_side(STROKE_WIDTH / 2),
                      ]
                    : [x, y + STROKE_WIDTH / 2]
                )
              : last
              ? [
                  [0, 2 * cell_height],
                  [cell_width, 3 * cell_height],
                  [1.5 * cell_width, 2.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1
                    ? [
                        x + long_side(STROKE_WIDTH / 2),
                        y + short_side(STROKE_WIDTH / 2),
                      ]
                    : [x, y + STROKE_WIDTH / 2]
                )
              : [
                  [0, 2 * cell_height],
                  [cell_width, 3 * cell_height],
                  [2 * cell_width, 2 * cell_height],
                ].map(([x, y]) => [x, y + STROKE_WIDTH / 2]);

            return adjust(points, { column_start, row_start });
          })
      ),
    };

    return (
      <ul
        ref={ref}
        style={{
          position: "relative",
          display: "grid",
          width: "100%",
          listStyleType: "none",
          margin: 0,
          padding: PADDING,
          gridGap: GAP,
          gridTemplateColumns: `repeat(${num_columns}, 1fr)`,
          gridTemplateRows: `repeat(${num_rows}, 1fr)`,
          lineHeight: 0,
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            background: "transparent",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          {Object.entries(edges).map(([side, d]) => (
            <path
              key={side}
              fill="none"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap={"butt"}
              strokeLinejoin={"miter"}
              stroke={
                side === "left" || side === "right"
                  ? theme.player_one
                  : theme.player_two
              }
              d={d}
            />
          ))}
        </svg>
        {hexagons.map(
          ({
            x,
            y,
            column_start,
            row_start,
            column_span,
            row_span,
            occupied_by,
          }) => (
            <Hexagon
              key={`${x},${y}`}
              occupied_by={occupied_by}
              grid_gap={GAP}
              style={{
                gridColumn: `${column_start} / span ${column_span}`,
                gridRow: `${row_start} / span ${row_span}`,
              }}
              is_my_turn={is_my_turn}
              role={role}
            >
              {x}, {y}
            </Hexagon>
          )
        )}
      </ul>
    );
  }
);

export default (props: any) => (
  <Measure bounds>
    {({ measureRef, contentRect }) => (
      <Grid
        ref={measureRef}
        {...props}
        width={contentRect?.bounds?.width || -1}
        height={contentRect?.bounds?.height || -1}
      />
    )}
  </Measure>
);
