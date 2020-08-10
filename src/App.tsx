import React, { useContext } from "react";
import Grid from "./Grid";
import ThemeContext from "./ThemeContext";

const App = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: theme.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "60%" }}>
        <Grid />
      </div>
    </div>
  );
};

export default App;
