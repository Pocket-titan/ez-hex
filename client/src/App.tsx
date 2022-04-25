import React, { useLayoutEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, Global, css } from "@emotion/react";
import {
  createTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useDarkMode } from "ts/state";
import Home from "pages/Home";
import Page from "pages/Page";
import ThemeToggle from "components/ThemeToggle";

declare global {
  interface Window {
    __theme: "dark" | "light";
    __onThemeChange: (newTheme: "dark" | "light") => void;
    __setPreferredTheme: (newTheme: "dark" | "light") => void;
  }
}

declare module "@emotion/react" {
  export interface Theme extends CustomTheme {}
}

type Colors = {
  accent: string;
  hover: string;
  played: string;
};

type CustomTheme = {
  backgroundColor: string;
  color: string;
  isDark: boolean;
  colors: {
    playerOne: Colors;
    playerTwo: Colors;
  };
  hex: {
    empty: string;
    stroke: string;
  };
};

const muiTheme = createMuiTheme({
  typography: {
    fontSize: 12,
  },
});

const App = () => {
  let { mode, setMode } = useDarkMode();

  // The way dark mode works is adapted from https://markoskon.com/dark-mode-in-react/#dan-abramovs-solution-with-css
  // see `public/index.html` for the relevant code
  useLayoutEffect(() => {
    setMode(window.__theme);
    window.__onThemeChange = (newTheme) => {
      setMode(newTheme);
    };
  }, []);

  let theme: CustomTheme = {
    backgroundColor: mode === "dark" ? "#181a1b" : "#f2f2f2",
    color: mode === "dark" ? "white" : "black",
    isDark: mode === "dark",
    colors: {
      playerOne: {
        accent: "#f86b6d",
        hover: "#c45456",
        played: "#ab494b",
      },
      playerTwo: {
        accent: "#82bbec",
        hover: "#6592b9",
        played: "#577e9f",
      },
    },
    hex: {
      empty: "#d9d9d9",
      stroke: "#6f6f6f",
    },
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={theme}>
        <Global
          styles={css`
            :root {
              --transition: background-color 250ms ease-in-out, color 250ms ease-in-out;
              --background-color: ${theme.backgroundColor};
              --color: ${theme.color};
            }
          `}
        />
        {/* If we give `body` a transition, it will also do this on page load - not ideal.
      so we put the transition on this cute little div here which has the same colors as body! */}
        <div
          style={{
            height: "100vh",
            width: "100vw",
            transition: "var(--transition)",
            backgroundColor: "var(--background-color)",
            color: "var(--color)",
          }}
        >
          <Router>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <div
                style={{
                  gridColumn: 3,
                  padding: "1em",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <ThemeToggle />
              </div>
            </div>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/:game_id">
                <Page />
              </Route>
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
