import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./routes/Game";
import { useTheme } from "./game";

const App = () => {
  const { theme } = useTheme();

  return (
    <Router>
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
        <Switch>
          <Route exact path="/">
            Home!
          </Route>
          <Route path="/:game_id">
            <Game />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
