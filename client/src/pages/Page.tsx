import type { BoardSize } from "types";
import React, { useEffect, useState } from "react";
import { useGameId, useListener, useLocalStorage } from "ts/hooks";
import CreateGame from "components/CreateGame";
import Game from "./Game";
import { Paper } from "@mui/material";
import { emit, useGame, useSocket } from "ts/state";
import styled from "@emotion/styled";

type State = "loading" | "create_game" | "game";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.75em;
  width: clamp(150px, 40%, 300px);
  padding: 1.25em;
`;

const ChooseBoardSize = ({ name }: { name: string }) => {
  let [size, setSize] = useState<BoardSize>([11, 11]);

  return (
    <Container>
      <StyledPaper elevation={3}>
        <CreateGame name={name} size={size} onSizeChange={setSize} />
      </StyledPaper>
    </Container>
  );
};

const Page = () => {
  let game_id = useGameId();
  const { socket } = useSocket();
  const [id, setId] = useLocalStorage("id", socket.id);
  const [name, setName] = useLocalStorage("name", "");
  const [state, setState] = useState<State>("loading");
  const { game, setGame, setRole } = useGame();

  console.log(`id, socket.id`, id, socket.id);

  useEffect(() => {
    if (!!socket.id && !id) {
      setId(socket.id);
    }
  }, [socket.id]);

  useEffect(() => {
    emit("join_game", { game_id, user: { id, name } });

    return () => {
      emit("leave_game", { game_id, user: { id, name } });
    };
  }, [game_id]);

  useListener("game_not_found", ({ game_id }) => {
    setState("create_game");
  });

  useListener("game", ({ game }) => {
    setGame(game);
    setState("game");
  });

  useListener("role", ({ role }) => {
    setRole(role);
  });

  if (state === "loading") {
    return <div> loading... </div>;
  }

  if (state === "create_game") {
    return <ChooseBoardSize name={game_id} />;
  }

  if (state === "game") {
    return <Game {...game!} />;
  }

  return null;
};

export default Page;
