import React, { useState, useRef, useEffect } from "react";
import _ from "lodash";
import { useRouteMatch } from "react-router-dom";
import io from "socket.io-client";
import Grid from "../components/Grid";
import { Board, Role, Game, Player } from "../hex";

const socket = io("http://localhost:3001");

const _Game = () => {
  const {
    params: { game_id },
  } = useRouteMatch<{ game_id: string }>();
  const [role, setRole] = useState<Role>("spectator");
  const [board, setBoard] = useState<Board | null>(null);
  const [turn, setTurn] = useState<Player | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected!");
    });

    socket.emit("JOIN_GAME", game_id);

    socket.on("ROLE", (role: Role) => setRole(role));

    socket.on("GAME", (game: Game) => {
      console.log("gotem");
      setBoard(game.board);
      setTurn(game.turn);
    });
  }, []);

  if (!board || !turn) {
    return null;
  }

  let is_my_turn = turn && role && turn === role;

  return (
    <div style={{ width: "60%" }}>
      <Grid role={role} board={board} is_my_turn={is_my_turn} />
    </div>
  );
};

export default _Game;
