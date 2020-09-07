import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ThemeContext from "./ThemeContext";
import Game from "./routes/Game";

const App = () => {
  const { theme } = useContext(ThemeContext);

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
