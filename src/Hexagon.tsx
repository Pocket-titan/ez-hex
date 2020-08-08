import React, { ReactNode } from "react";

export type Orientation = "FLAT_TOP" | "POINTY_TOP";

const Hexagon = ({
  children,
  row_span,
  column_span,
  row_start,
  column_start,
  orientation = "POINTY_TOP",
}: {
  children?: ReactNode;
  row_span: number;
  column_span: number;
  row_start: number;
  column_start: number;
  orientation?: Orientation;
}) => {
  let { aspect_ratio, clip_path } =
    orientation === "POINTY_TOP"
      ? {
          aspect_ratio: 2 / Math.sqrt(3),
          clip_path:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }
      : {
          aspect_ratio: Math.sqrt(3) / 2,
          clip_path:
            "polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)",
        };

  return (
    <li
      className="hexagon"
      style={{
        gridColumn: `${column_start} / span ${column_span}`,
        gridRow: `${row_start} / span ${row_span}`,
        position: "relative",
        height: 0,
        paddingBottom: `${aspect_ratio * 100}%`,
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",

          // hexagon
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 50, 70, 0.6)",
          // opacity: 0.6,
          clipPath: clip_path,
        }}
      >
        {children}
      </div>
    </li>
  );
};

export default Hexagon;
