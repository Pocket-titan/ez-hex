// @ts-nocheck
import React, { Ref } from "react";
import Hexagon from "./Hexagon";
import { ContentRect } from "react-measure";
import colormaps from "./colormaps";

const isOdd = (x: number) => x % 2 === 0;

// const colormaps = {
//   vintage: [
//     "hsl(45, 74%, 82%)",
//     "hsl(22, 100%, 59%)",
//     "hsl(156, 43%, 67%)",
//     "hsl(62, 73%, 45%)",
//     "hsl(335, 100%, 50%)",
//   ],
//   pastel: [
//     "hsl(68, 75%, 51%)",
//     "hsl(188, 69%, 72%)",
//     "hsl(46, 100%, 67%)",
//     "hsl(355, 67%, 68%)",
//   ],
//   vibrant: [
//     "hsl(0, 0%, 91%)",
//     "hsl(173, 91%, 37%)",
//     "hsl(335, 86%, 51%)",
//     "hsl(21, 90%, 58%)",
//     "hsl(40, 97%, 54%)",
//     "hsl(62, 61%, 49%)",
//   ],
//   wallpaper: [
//     "hsl(20, 89%, 89%)",
//     "hsl(177, 24%, 56%)",
//     "hsl(4, 84%, 75%)",
//     "hsl(354, 41%, 54%)",
//     "hsl(247, 19%, 28%)",
//   ],
//   viridis: [
//     "hsl(53, 95%, 78%)",
//     "hsl(85, 51%, 63%)",
//     "hsl(152, 51%, 40%)",
//     "hsl(261, 24%, 26%)",
//     "hsl(293, 54%, 15%)",
//   ],
//   reds: [
//     "hsl(0, 0%, 100%)",
//     "hsl(341, 82%, 49%)",
//     "hsl(335, 65%, 41%)",
//     "hsl(20, 89%, 58%)",
//     "hsl(48, 98%, 52%)",
//   ],
//   material: [
//     "hsl(240, 100%, 75%)",
//     "hsl(0, 100%, 64%)",
//     "hsl(168, 33%, 44%)",
//     "hsl(54, 99%, 46%)",
//   ],
//   classic: [
//     "hsl(0, 0%, 80%)",
//     // "hsl(216, 100%, 67%)",
//     "hsl(0, 57%, 53%)",
//     "hsl(240, 57%, 53%)",
//   ],
// };

let colormap = colormaps.vintage;

const Grid = React.forwardRef(
  (
    {
      size = 5,
      contentRect,
      orientation = "POINTY_TOP",
    }: {
      size?: number;
      contentRect: ContentRect;
      orientation?: string;
    },
    ref: Ref<HTMLUListElement>
  ) => {
    const { width = -1, height = -1 } = contentRect?.bounds || {};

    let { num_columns, num_rows, column_span, row_span, calculate_position } =
      orientation === "POINTY_TOP"
        ? {
            num_columns: 2 * size + (size - 1),
            num_rows: 3 * size + 1,
            column_span: 2,
            row_span: 4,
            calculate_position: (x: number, y: number) => ({
              row_start: 1 + y * 3,
              column_start: 1 + x * 2 + y,
            }),
          }
        : {
            num_columns: 3 * size + 1,
            num_rows: 2 * size + 1,
            column_span: 4,
            row_span: 2,
            calculate_position: (x: number, y: number) => ({
              row_start: 1 + 2 * y + (isOdd(x) ? 1 : 0),
              column_start: 1 + 3 * x,
            }),
          };

    const GAP = 0;
    // const PADDING = 2 * GAP;
    const BORDER_GAP = 0;
    const PADDING = 2 * 40;

    let cell_width = (width - 2 * PADDING) / num_columns;
    let cell_height = (height - 2 * PADDING) / num_rows;

    const hexes = [...Array(size).keys()]
      .map((x) => [...Array(size).keys()].map((y) => [x, y]))
      .flat();

    const hexagons = hexes.map(([x, y]) => {
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

    let left_edges = hexagons.filter(({ x, y }) => x === 0);
    let top_edges = hexagons.filter(({ x, y }) => y === 0);
    let right_edges = hexagons.filter(({ x, y }) => x === size - 1);
    let bottom_edges = hexagons.filter(({ x, y }) => y === size - 1);

    const STROKE_WIDTH = 20;

    let left_edge = left_edges
      .map(({ row_start, column_start }) => {
        let offset = BORDER_GAP / Math.sqrt(2);

        let points = [
          [0, 0],
          [0, 2 * cell_height],
          [cell_width, 3 * cell_height],
        ]
          .map(([x, y]) => [
            x - STROKE_WIDTH / 2 / Math.sqrt(2) - 3,
            y + STROKE_WIDTH / 2 / Math.sqrt(2) - 2,
          ])
          .map(([x, y]) => [x - offset, y - offset])
          .map(([x, y]) => [x, y + cell_height])
          .map(([x, y]) => [
            x + (column_start - 1) * cell_width,
            y + (row_start - 1) * cell_height,
          ])
          .map(([x, y]) => [x + PADDING, y + PADDING]);

        return points;
      })
      .flat(1)
      .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
      .join(" ");

    let top_edge = top_edges
      .map(({ row_start, column_start }, index) => {
        let offset = BORDER_GAP / Math.sqrt(2);

        let points = [
          [0, 0],
          [cell_width, -cell_height],
          [2 * cell_width, 0],
        ]
          .map(([x, y]) => [x, y - STROKE_WIDTH / Math.sqrt(2) + 3])
          .map(([x, y]) => [x - offset, y - offset])
          .map(([x, y]) => [x, y + cell_height])
          .map(([x, y]) => [
            x + (column_start - 1) * cell_width,
            y + (row_start - 1) * cell_height,
          ])
          .map(([x, y]) => [x + PADDING, y + PADDING]);

        return points;
      })
      .flat(1)
      .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
      .join(" ");

    let right_edge = right_edges
      .map(({ row_start, column_start }) => {
        let offset = BORDER_GAP / Math.sqrt(2);

        let points = [
          [2 * cell_width, 0],
          [2 * cell_width, 2 * cell_height],
        ]
          .map(([x, y]) => [x + STROKE_WIDTH / 2 - 1, y - 5])
          .map(([x, y]) => [x + offset, y + offset])
          .map(([x, y]) => [x, y + cell_height])
          .map(([x, y]) => [
            x + (column_start - 1) * cell_width,
            y + (row_start - 1) * cell_height,
          ])
          .map(([x, y]) => [x + PADDING, y + PADDING]);

        return points;
      })
      .flat(1)
      .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
      .join(" ");

    let bottom_edge = bottom_edges
      .map(({ row_start, column_start }) => {
        let offset = BORDER_GAP / Math.sqrt(2);

        let points = [
          [0, 3 * cell_height],
          [cell_width, 4 * cell_height],
          [2 * cell_width, 3 * cell_height],
        ]
          .map(([x, y]) => [x, y - 2 * STROKE_WIDTH - 2])
          .map(([x, y]) => [x - offset, y - offset])
          .map(([x, y]) => [x, y + cell_height])
          .map(([x, y]) => [
            x + (column_start - 1) * cell_width,
            y + (row_start - 1) * cell_height,
          ])
          .map(([x, y]) => [x + PADDING, y + PADDING]);

        return points;
      })
      .flat(1)
      .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
      .join(" ");

    return (
      <ul
        ref={ref}
        style={{
          position: "relative",
          display: "grid",
          width: "50%",
          listStyleType: "none",
          margin: 0,
          padding: PADDING,
          gridGap: GAP,
          gridTemplateColumns: `repeat(${num_columns}, 1fr)`,
          gridTemplateRows: `repeat(${num_rows}, 1fr)`,
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
          <path
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap={"butt"}
            strokeLinejoin={"miter"}
            stroke={colormap.players[1]}
            d={left_edge}
          />
          <path
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap={"butt"}
            strokeLinejoin={"miter"}
            stroke={colormap.players[3]}
            d={top_edge}
          />
          <path
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap={"butt"}
            strokeLinejoin={"miter"}
            stroke={colormap.players[1]}
            d={right_edge}
          />
          <path
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap={"butt"}
            strokeLinejoin={"miter"}
            stroke={colormap.players[3]}
            d={bottom_edge}
          />
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

export default Grid;
