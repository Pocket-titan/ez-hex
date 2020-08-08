import React, { ReactNode } from "react";

const Hexagon = ({
  column_start,
  row_start,
  column_span,
  row_span,
  children,
}: {
  children?: ReactNode;
  column_start: number;
  row_start: number;
  column_span: number;
  row_span: number;
}) => {
  const ASPECT_RATIO = 2 / Math.sqrt(3);

  return (
    <li
      style={{
        gridColumn: `${column_start} / span ${column_span}`,
        gridRow: `${row_start} / span ${row_span}`,
        position: "relative",
        height: 0,
        paddingBottom: `${ASPECT_RATIO * 100}%`,
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 50, 70, 0.3)",
          cursor: "pointer",
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        {children}
      </div>
    </li>
  );
};

export default Hexagon;
