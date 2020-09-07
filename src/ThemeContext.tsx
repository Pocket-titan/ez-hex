import React, { createContext, useState, ReactNode } from "react";

type Color = string;

type Theme = {
  background: Color;
  border: Color;
  player_one: Color;
  player_two: Color;
  spectator?: Color;
  empty: Color;
};

const themes: { [key: string]: Theme } = {
  vintage: {
    background: "hsl(45, 90%, 87%)",
    empty: "hsl(45, 74%, 82%)",
    border: "hsl(45, 44%, 72%)",
    // players: [
    //   "hsl(22, 100%, 59%)",
    //   "hsl(156, 43%, 67%)",
    //   "hsl(62, 73%, 45%)",
    //   "hsl(335, 100%, 50%)",
    // ],
    player_one: "hsl(335, 100%, 50%)",
    player_two: "hsl(156, 43%, 67%)",
  },
};

export const ThemeContext = createContext({ theme: themes.vintage });

export const ThemeConsumer = ThemeContext.Consumer;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(themes.vintage);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
