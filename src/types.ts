export type Player = "player_one" | "player_two";

export type Role = Player | "spectator";

export type Hex = {
  x: number;
  y: number;
  occupied_by: Player | "empty";
};

export type Board = Hex[][];
