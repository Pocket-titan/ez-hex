import socketio from "socket.io";
import _ from "lodash";
import { Game, Id, BoardSize, Board, Player, Role, Hex } from "./types";

const PORT = process.env.PORT || 3001;
const io = socketio(PORT);
const hex = io.of("/hex");

let games: {
  [Id: string]: Game;
} = {};

const DEFAULT_BOARD_SIZE: BoardSize = [11, 11];

let create_board = (board_size: BoardSize = DEFAULT_BOARD_SIZE): Board =>
  [...Array(board_size[0]).keys()].map((x) =>
    [...Array(board_size[1]).keys()].map((y) => {
      return {
        x,
        y,
        occupied_by: "empty",
      };
    })
  );

let create_game = (board_size: BoardSize = DEFAULT_BOARD_SIZE): Game => ({
  board: create_board(board_size),
  turn: (["player_one", "player_two"] as Player[])[_.random(0, 1)],
  users: [],
});

console.log(`Server is listening on port ${PORT} 🚀`);

hex.on("connection", (socket) => {
  let id = socket.id;
  let rooms: { game_id: Id; role: Role }[] = [];

  socket.on("JOIN_GAME", (game_id: Id) => {
    let game = games[game_id];
    let role: Role;

    if (!game) {
      game = create_game();
      role = "player_one";
    } else {
      let roles = game.users.map(({ role }) => role);
      role = !_.includes(roles, "player_one")
        ? "player_one"
        : !_.includes(roles, "player_two")
        ? "player_two"
        : "spectator";
    }
    game.users.push({
      id,
      role,
    });
    games[game_id] = game;

    socket.join(game_id);
    rooms.push({
      game_id,
      role,
    });

    socket.emit("ROLE", role);
    hex.to(game_id).emit("PLAYERS", game.users);
    hex.to(game_id).emit("GAME", game);
  });

  socket.on(
    "MOVE",
    ({ game_id, hex: { x, y, occupied_by } }: { game_id: Id; hex: Hex }) => {
      let game = games[game_id];

      if (!game) {
        return;
      }

      game.board[x][y] = {
        x,
        y,
        occupied_by,
      };
      game.turn = occupied_by === "player_one" ? "player_two" : "player_one";

      hex.to(game_id).emit("GAME", game);
    }
  );

  socket.on("disconnect", () => {
    console.log("leaving rooms", rooms);
    rooms.forEach(({ game_id, role }) => {
      let game = games[game_id];
      _.remove(game.users, {
        id, // my_id!
        role,
      });
      socket.leave(game_id);

      if (game.users.length > 0) {
        hex.to(game_id).emit("GAME", game);
      }
    });
  });
});
