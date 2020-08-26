import React, { useEffect } from "react";
import io from "socket.io-client";
import { useRouteMatch } from "react-router-dom";
import create from "zustand";
import { Board, Role, Player } from "../types";
import Grid from "./Grid";

const socket = io("http://localhost:3001");

type Nullable<T extends object> = {
  [key in keyof T]: T[key] | null;
};

export const useGame = create<
  Nullable<{
    board: Board;
    role: Role;
    turn: Player;
  }> & {
    setBoard: (board: Board) => void;
    setRole: (role: Role) => void;
    setTurn: (turn: Player) => void;
  }
>((set) => ({
  board: null,
  role: null,
  turn: null,
  setBoard: (board) => set({ board }),
  setRole: (role) => set({ role }),
  setTurn: (turn) => set({ turn }),
}));

socket.on("BOARD", (board: Board) => useGame((state) => state.setBoard)(board));

socket.on("ROLE", (role: Role) => useGame((state) => state.setRole)(role));

socket.on("TURN", (turn: Player) => useGame((state) => state.setTurn)(turn));

const Game = () => {
  const {
    params: { game_id },
  } = useRouteMatch<{ game_id: string }>();

  useEffect(() => {
    socket.emit("JOIN_GAME", game_id);
  }, []);

  return (
    <div>
      <Grid />
    </div>
  );
};

export default Game;
