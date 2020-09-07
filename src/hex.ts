export type Id = string;

export type Player = "player_one" | "player_two";

export type BoardSize = [11, 11] | [9, 9] | [7, 7];

export type Hex = {
  occupied_by: Player | "empty";
};

export type Board = Hex[][];

export type Role = Player | "spectator";

export type User = {
  role: Role;
};

export type Game = {
  board_size: BoardSize;
  board: Board;
  turn: Player;
  users: User[];
};

export type Move = {
  hex: [number, number];
  player: Player;
};
