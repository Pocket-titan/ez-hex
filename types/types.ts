export type Id = string;

export type Player = "player_one" | "player_two";

export type Role = Player | "spectator";

export type Hex = {
  x: number;
  y: number;
  occupied_by: Player | "empty";
};

export type BoardSize = [11, 11] | [9, 9];

export type Board = Hex[][];

export type Game = {
  board: Board;
  turn: Player;
  winner: null | {
    player: Player;
    path: Hex[];
  };
  users: {
    id: Id;
    role: Role;
  }[];
};
