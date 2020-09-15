import create from "zustand";
import io from "socket.io-client";
import { Game, Role, Player } from "types";

const url = "http://localhost";
const port = 3001;
const socket = io(`${url}:${port}/hex`);

const useGame = create<{
  socket: SocketIOClient.Socket;
  game: Game;
  role: Role;
  setGame: (game: Game) => void;
  setRole: (role: Role) => void;
}>((set) => ({
  socket,
  game: {
    board: [],
    winner: null,
    turn: "player_one",
    users: [],
  },
  role: "spectator",
  setGame: (game) => set({ game }),
  setRole: (role) => set({ role }),
}));

socket.on("GAME", (game: Game) => {
  console.log("game", game);
  useGame.setState({ game });
});

socket.on("ROLE", (role: Role) => {
  console.log("role", role);
  useGame.setState({ role });
});

export type Color = string;

export type Theme = {
  background: Color;
  border: Color;
  empty: Color;
  player_one: Color;
  player_two: Color;
};

const themes: { [key: string]: Theme } = {
  default: {
    background: "hsl(0, 0%, 70%)",
    border: "black",
    empty: "lightgray",
    player_one: "hotpink",
    player_two: "deepskyblue",
  },
  oldschool: {
    background: "hsl(0, 3%, 66%)",
    border: "hsl(0, 0%, 15%)",
    empty: "hsl(180, 0%, 65%)",
    player_one: "hsl(240, 4%, 95%)",
    player_two: "hsl(0, 0%, 27%)",
  },
  blue_and_brown: {
    background: "hsl(0, 4%, 32%)",
    border: "hsl(0, 0%, 8%)",
    empty: "hsl(57, 2%, 43%)",
    player_one: "hsl(186, 71%, 65%)",
    player_two: "hsl(25, 34%, 45%)",
  },
  urban: {
    empty: "hsl(18, 26%, 58%)",
    border: "hsl(0, 3%, 25%)",
    background: "hsl(11, 15%, 45%)",
    player_one: "hsl(194, 44%, 69%)",
    player_two: "hsl(26, 96%, 60%)",
  },
  koi: {
    background: "hsl(52, 50%, 80%)",
    border: "hsl(36, 90%, 15%)",
    empty: "hsl(36, 65%, 75%)",
    player_one: "hsl(187, 63%, 54%)",
    player_two: "hsl(342, 100%, 55%)",
  },
  cucumber: {
    empty: "hsl(126, 55%, 75%)",
    border: "hsl(147, 92%, 15%)",
    background: "hsl(120, 25%, 52%)",
    player_one: "hsl(144, 46%, 34%)",
    player_two: "hsl(181, 97%, 88%)",
  },
  onedark: {
    background: "hsl(220, 13%, 26%)",
    empty: "hsl(209, 12%, 37%)",
    border: "hsl(215, 9%, 14%)",
    player_one: "hsl(302, 41%, 60%)",
    player_two: "hsl(96, 37%, 61%)",
  },
};

const useTheme = create<{
  theme: Theme;
  setTheme: (name: string) => void;
}>((set) => ({
  theme: themes["onedark"],
  setTheme: (name) => {
    let theme = themes[name];

    if (theme) {
      set({ theme });
    }
  },
}));

export { useGame, useTheme };
