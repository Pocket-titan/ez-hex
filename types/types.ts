type Hex = {
  x: number;
  y: number;
  occupied_by: Player | "nobody";
};

type BoardSize = [x: 9, y: 9] | [x: 11, y: 11] | [x: 13, y: 13] | [x: 19, y: 19];

type Board = Hex[][];

type Player = "player_one" | "player_two";

type Role = Player | "spectator";

type User = {
  id: string;
  role: Role;
  name: string;
  socketId?: string;
};

type Game = {
  board: Board;
  turn: User | (Partial<User> & Required<Pick<User, "role">>);
  winner?: {
    player: Player;
    path: Hex[];
  };
  users: User[];
};

// Client -> Server (ex: Client sends "move" to Server)
namespace Client {
  export type Events = {
    create_game: {
      game_id: string;
      board_size: BoardSize;
    };
    join_game: {
      game_id: string;
      user: Pick<User, "id" | "name">;
    };
    move: {
      game_id: string;
      hex: Hex;
    };
    leave_game: {
      game_id: string;
      user: Pick<User, "id" | "name">;
    };
    ask_if_game_name_is_available: {
      game_id: string;
    };
  };

  export type EventType = keyof Events;

  export type Event<T extends EventType = EventType> = Events[T];
}

// Server -> Client (ex: Server sends "user_joined" to Client)
namespace Server {
  export type Events = {
    game_not_found: {
      game_id: string;
    };
    user_joined: {
      user: User;
    };
    user_left: {
      user: User;
    };
    role: {
      role: Role;
    };
    game: {
      game: Game;
    };
    is_game_name_available: {
      game_id: string;
      available: boolean;
    };
    game_created: {
      game_id: string;
    };
  };

  export type EventType = keyof Events;

  export type Event<T extends EventType = EventType> = Events[T];
}

export type { Hex, BoardSize, Board, Player, Role, User, Game, Server, Client };
