import React, { useState, useEffect } from "react";
import { useGameId, useListener } from "ts/hooks";
import { emit } from "ts/state";
import styled from "@emotion/styled";
import CreateGame from "components/CreateGame";
import type { Board, Game as GameType, BoardSize } from "types";
import { Paper } from "@mui/material";
import HexGrid from "components/HexGrid";

const Game = ({ board, turn, users }: GameType) => {
  return (
    <div
      style={{
        display: "grid",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        gridTemplateRows: "1fr 10fr 1fr",
        gridTemplateColumns: "1fr",
      }}
    >
      <div>HEX</div>
      <HexGrid board={board} />
    </div>
  );
};

export default Game;
