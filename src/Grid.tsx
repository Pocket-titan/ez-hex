import React, { Ref } from "react";
import Measure from "react-measure";
import Hexagon from "./Hexagon";

const to_path = (points: number[][]) =>
  points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");

const deg_to_rad = (degrees: number) => (degrees * Math.PI) / 180;

const Grid = React.forwardRef(
  (
    {
      width = -1,
      height = -1,
      grid_size = 5, // hexagons
    }: {
      width?: number;
      height?: number;
      grid_size?: number;
    },
    ref: Ref<HTMLUListElement>
  ) => {
    const GAP = 0;
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

    const hexagons = [...Array(grid_size).keys()]
      .map((x) => [...Array(grid_size).keys()].map((y) => [x, y]))
      .flat()
      .map(([x, y]) => {
        let { row_start, column_start } = calculate_position(x, y);

        return {
          x,
          y,
          row_start,
          column_start,
          row_span,
          column_span,
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

    let long_side = (Math.sin(deg_to_rad(60)) * STROKE_WIDTH) / 2;
    let short_side = (Math.cos(deg_to_rad(60)) * STROKE_WIDTH) / 2;

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
                    ? [x - long_side, y - short_side]
                    : [x - long_side, y + short_side]
                )
              : last
              ? [
                  [0, 0],
                  [0, 2 * cell_height],
                  [0.5 * cell_width, 2.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1
                    ? [x - long_side, y + short_side]
                    : [x - long_side, y + short_side]
                )
              : [
                  [0, 0],
                  [0, 2 * cell_height],
                  [cell_width, 3 * cell_height],
                ].map(([x, y]) => [x - long_side, y + short_side]);

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
                    ? [x - long_side, y - short_side]
                    : [x, y - STROKE_WIDTH / 2]
                )
              : last
              ? [
                  [0, 0],
                  [cell_width, -cell_height],
                  [1.5 * cell_width, -0.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1
                    ? [x + long_side, y - short_side]
                    : [x, y - STROKE_WIDTH / 2]
                )
              : [
                  [0, 0],
                  [cell_width, -cell_height],
                  [2 * cell_width, 0],
                ].map(([x, y]) => [x, y - STROKE_WIDTH / 2]);

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
                    ? [x + long_side, y - short_side]
                    : [x + long_side, y - short_side]
                )
              : last
              ? [
                  [2 * cell_width, 0],
                  [2 * cell_width, 2 * cell_height],
                  [1.5 * cell_width, 2.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1 || i === arr.length - 2
                    ? [x + long_side, y + short_side]
                    : [x + long_side, y - short_side]
                )
              : [
                  [2 * cell_width, 0],
                  [2 * cell_width, 2 * cell_height],
                ].map(([x, y]) => [x + long_side, y - short_side]);

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
                    ? [x - long_side, y + short_side]
                    : [x, y + STROKE_WIDTH / 2]
                )
              : last
              ? [
                  [0, 2 * cell_height],
                  [cell_width, 3 * cell_height],
                  [1.5 * cell_width, 2.5 * cell_height],
                ].map(([x, y], i, arr) =>
                  i === arr.length - 1
                    ? [x + long_side, y + short_side]
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
            zIndex: 1,
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
                  ? "rgba(0,0,200,0.6)"
                  : "rgba(0,200,0,0.6)"
              }
              d={d}
            />
          ))}
        </svg>
        {hexagons.map(({ x, y, ...props }) => (
          <Hexagon key={`${x},${y}`} {...props}>
            {x}, {y}
          </Hexagon>
        ))}
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
