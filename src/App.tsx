import React from "react";
import Hexagon from "./Hexagon";

type Orientation = "FLAT_TOP" | "POINTY_TOP";

let default_orientation: Orientation = "POINTY_TOP";
// let default_orientation: Orientation = "FLAT_TOP";

const isOdd = (x: number) => x % 2 === 0;

const App = ({
  orientation = default_orientation,
}: {
  orientation?: Orientation;
}) => {
  let size = 4;

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

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <ul
        className="grid"
        style={{
          position: "relative",
          display: "grid",
          width: "75%",
          margin: 50,
          listStyleType: "none",
          // margin: 0,
          padding: 0,
          gridTemplateColumns: `repeat(${num_columns}, 1fr)`,
          gridTemplateRows: `repeat(${num_rows}, 1fr)`,
          // gridGap: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            width: "100%",
            height: 50,
            transform: `rotate(${
              ((90 - Math.atan2(3, 1)) * 180) / Math.PI
            }deg) translateX(50%) translateY(-600%)`,
            background: "yellow",
          }}
        ></div>
        {[...Array(size).keys()].map((x) =>
          [...Array(size).keys()].map((y) => {
            let { row_start, column_start } = calculate_position(x, y);

            let props = {
              orientation,
              row_start,
              column_start,
              row_span,
              column_span,
            };

            return (
              <Hexagon key={`${x},${y}`} {...props}>
                {x}, {y}
              </Hexagon>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default App;
