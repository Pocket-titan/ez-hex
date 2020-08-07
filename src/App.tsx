import React from "react";
import Grid from "./Grid";
import Measure from "react-measure";

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "hsl(45, 74%, 82%)",
      }}
    >
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <Grid ref={measureRef} contentRect={contentRect} />
        )}
      </Measure>
    </div>
  );
};

export default App;
