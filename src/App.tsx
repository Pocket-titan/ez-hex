import React from "react";
import Grid from "./Grid";

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "hsl(45, 74%, 82%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "50%" }}>
        <Grid />
      </div>
    </div>
  );
};

export default App;
