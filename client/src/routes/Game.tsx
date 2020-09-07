import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useGame } from "../game";
import Grid from "../components/Grid";

const _Game = () => {
  const {
    params: { game_id },
  } = useRouteMatch<{ game_id: string }>();
  const socket = useGame((state) => state.socket);

  useEffect(() => {
    socket.emit("JOIN_GAME", game_id);
  }, []);

  return <Grid />;
};

export default _Game;
