import socketio from "socket.io";
import { Id, Game, Board, BoardSize, Player, Move, User } from "./hex";

const PORT = process.env.PORT || 3001;
const io = socketio(PORT);

let games: {
  [id: string]: Game;
} = {};

const DEFAULT_BOARD_SIZE: BoardSize = [11, 11];

const create_board = (board_size: BoardSize = DEFAULT_BOARD_SIZE): Board =>
  [...Array(board_size[0]).keys()].map((x) =>
    [...Array(board_size[1]).keys()].map((y) => {
      return {
        occupied_by: "empty",
      };
    })
  );

const create_game = (
  board_size: BoardSize = DEFAULT_BOARD_SIZE,
  board: Board = create_board(board_size)
): Game => {
  let game = {
    board_size,
    board,
    turn: (["player_one", "player_two"] as Player[])[Math.round(Math.random())],
    users: [],
  };

  return game;
};

const apply_move = (move: Move, board: Board): Board => {
  let {
    hex: [x, y],
    player,
  } = move;

  let new_board = [...board];
  new_board[x][y].occupied_by = player;

  return new_board;
};

console.log(`Server is listening on port ${PORT} :D`);

io.on("connection", (socket) => {
  let me: User | null = null;
  let rooms: Id[] = [];

  socket.on("JOIN_GAME", (game_id: Id) => {
    let game = games[game_id];
    if (!game) {
      game = create_game();
      games[game_id] = game;
    }

    me = {
      role:
        game.users.filter(({ role }) => role === "player_one").length === 0
          ? "player_one"
          : game.users.filter(({ role }) => role === "player_two").length === 0
          ? "player_two"
          : "spectator",
    };
    game.users.push(me);

    socket.join(game_id);
    rooms.push(game_id);
    socket.emit("ROLE", me.role);
    socket.emit("GAME", game);
    io.to(game_id).emit("USER_JOINED", me);
  });

  socket.on("MOVE", (move: Move, game_id: Id) => {
    let game = games[game_id];

    if (!game) {
      return;
    }

    let new_board = apply_move(move, game.board);

    let new_game: Game = {
      ...game,
      board: new_board,
    };

    io.to(game_id).emit("GAME", new_game);
  });

  socket.on("disconnect", (reason: string) => {
    rooms.forEach((game_id) => {
      let game = games[game_id];

      if (!game || !me) {
        return;
      }

      let index = game.users.findIndex(
        (user) => user.role === (me as User).role
      );
      game.users.splice(index, 1);

      socket.leave(game_id);
      io.to(game_id).emit("USER_LEFT", me);
    });
  });
});
