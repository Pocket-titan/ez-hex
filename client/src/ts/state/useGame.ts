import type { Game, Role } from "types";
import create from "zustand";
import immer from "./immer";

const useGame = create<{
  game?: Game;
  role?: Role;
  setGame: (game: Game) => void;
  setRole: (role: Role) => void;
}>(
  immer((set, get) => ({
    game: undefined,
    role: undefined,
    setGame: (game) => {
      set((draft) => {
        draft.game = game;
      });
    },
    setRole: (role) => {
      set((draft) => {
        draft.role = role;
      });
    },
  }))
);

export default useGame;

export { useGame };
