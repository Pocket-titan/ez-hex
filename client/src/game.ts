import create from "zustand";
import io from "socket.io-client";
import { Game, Role, Player } from "../../server/types";

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
};

const useTheme = create<{
  theme: Theme;
  setTheme: (name: string) => void;
}>((set) => ({
  theme: themes["default"],
  setTheme: (name: string) => {
    let theme = themes[name];

    if (theme) {
      set({ theme });
    }
  },
}));

export { useGame, useTheme };
