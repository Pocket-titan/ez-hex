import React from "react";
import Grid from "./components/Grid";
import "./App.css";

const App = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "hsl(0, 0%, 70%)",
      }}
    >
      <Grid />
    </div>
  );
};

export default App;
