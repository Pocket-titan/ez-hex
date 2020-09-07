import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./routes/Game";

const App = () => {
  return (
    <Router>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "hsl(0, 0%, 70%)",
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
