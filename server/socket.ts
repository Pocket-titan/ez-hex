import { Server, Socket } from "socket.io";
import { Namespace } from "socket.io/dist/namespace";
import type { Client, Game, User, Player } from "types";
import { useStore } from "./ts/store";
import { createGame, checkWinCondition } from "./ts/logic";
import { cloneDeep } from "lodash";

const bindEvents = (hex: Namespace) => (socket: Socket) => ({
  on: <T extends Client.EventType>(
    eventType: T,
    listener: (event: Client.Event<T>) => void
  ) => {
    socket.on(eventType, (event) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`received event of eventType: ${eventType}`, event);
      }

      listener(event);
    });
  },
  to: (destination: Socket | Namespace | string) => ({
    emit: <T extends import("types").Server.EventType>(
      eventType: T,
      event: import("types").Server.Event<T>
    ) => {
      let namespace = typeof destination === "string" ? hex.to(destination) : destination;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `sending ${
            typeof destination === "string" ? `to everyone in room: ${destination}, ` : ""
          } event of eventType: ${eventType}`,
          event
        );
      }

      namespace.emit(eventType, event);
    },
  }),
  broadcast: (room: string) => ({
    emit: <T extends import("types").Server.EventType>(
      eventType: T,
      event: import("types").Server.Event<T>
    ) => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `broadcasting to room: ${room}, event of eventType: ${eventType}`,
          event
        );
      }

      (socket || hex).to(room).emit(eventType, event);
    },
  }),
});

function doesGameExist(game_id: string): boolean {
  const { games } = useStore.getState();
  return game_id in games;
}

function getGame(game_id: string): Game | undefined {
  const { games } = useStore.getState();
  let game = games[game_id];
  return game;
}

function setGame(game_id: string, game: Game): Game {
  const { setGame } = useStore.getState();
  return setGame(game_id, game);
}

const createWebsocket = ({
  server,
  port,
}: {
  server?: import("http").Server;
  port?: number;
}) => {
  if (!server && !port) {
    throw new Error();
  }

  const hex = (
    server
      ? new Server(server)
      : new Server(port, {
          cors: {
            origin: "*",
            methods: ["GET"],
          },
        })
  ).of("/hex");

  let address = server?.address();
  let _port = typeof address !== "string" && address?.port ? address.port : port;
  if (_port) {
    console.log(`Websocket server is listening on port: ${_port} 🚀`);
  }

  hex.on("connection", (socket: Socket) => {
    const { on, to, broadcast } = bindEvents(hex)(socket);

    on("join_game", ({ game_id, user }) => {
      useStore.getState().setUserIdMap((userIdMap) => {
        userIdMap[socket.id] = user.id;
      });

      if (!doesGameExist(game_id)) {
        to(socket).emit("game_not_found", { game_id });
      } else {
        socket.join(game_id);

        let users = useStore.getState().games[game_id].users;
        let hasPlayerOne = users.filter(({ role }) => role === "player_one").length > 0;
        let hasPlayerTwo = users.filter(({ role }) => role === "player_two").length > 0;

        let me: User = {
          ...user,
          role: !hasPlayerOne ? "player_one" : !hasPlayerTwo ? "player_two" : "spectator",
          socketId: socket.id,
        };

        let game = useStore.getState().updateGame(game_id, (game) => {
          game.users.push(me);
        });

        if (!game) {
          return;
        }

        to(socket).emit("role", { role: me.role });
        to(socket).emit("game", { game });
        broadcast(game_id).emit("user_joined", { user: me });
      }
    });

    const leaveGame = (game_id: string) => {
      let me: User | null = null;
      useStore.getState().updateGame(game_id, (game) => {
        let idx = game.users.findIndex((x) => x.socketId && x.socketId === socket.id);

        if (idx !== -1) {
          me = { ...game.users.splice(idx, 1)[0] };
        }
      });

      if (!me) {
        return;
      }

      try {
        broadcast(game_id).emit("user_left", { user: me });
        socket.leave(game_id);
      } catch {}
    };

    on("leave_game", ({ game_id }) => {
      leaveGame(game_id);
    });

    socket.on("disconnecting", () => {
      let games = useStore.getState().games;

      Object.entries(games).forEach(([key, game]) => {
        let idx = (game!.users || []).findIndex(
          ({ socketId }) => socketId && socketId === socket.id
        );

        if (idx !== -1) {
          leaveGame(key);
        }
      });
    });

    on("ask_if_game_name_is_available", ({ game_id }) => {
      let available = !doesGameExist(game_id);

      to(socket).emit("is_game_name_available", { game_id, available });
    });

    on("create_game", ({ game_id, board_size }) => {
      if (doesGameExist(game_id)) {
        console.error(`Game with id: ${game_id} already exists!`);
        return;
      }

      let game = setGame(game_id, createGame(board_size));

      to(socket).emit("game_created", { game_id });
    });

    on("move", ({ game_id, hex }) => {
      let game = useStore.getState().updateGame(game_id, (game) => {
        if (game.winner) {
          return;
        }

        game.board[hex.x][hex.y] = {
          ...game.board[hex.x][hex.y],
          ...hex,
        };

        const role = game.turn.role === "player_one" ? "player_two" : "player_one";
        let winningPath = checkWinCondition(cloneDeep(game), hex);

        if (winningPath !== false) {
          game.winner = {
            player: game.turn.role as Player,
            path: winningPath,
          };
        } else {
          game.turn = { role };
        }
      });

      if (!game) {
        return;
      }

      to(game_id).emit("game", { game });
    });
  });

  return hex;
};

export { createWebsocket };
