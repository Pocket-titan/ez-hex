import create, { State, StateCreator } from "zustand";
import produce from "immer";
import type { Game, Server, User, Hex } from "types";

const immer =
  <T extends State>(config: StateCreator<T, (fn: (draft: T) => void) => void>): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce(fn) as (state: T) => T), get, api);

const useStore = create<{
  games: {
    [id: string]: Game;
  };
  users: {
    [user_id: string]: {
      [room_id: string]: {
        hovering?: Hex;
      };
    };
  };
  userIdMap: {
    [socket_id: string]: string;
  };
  setGame: (game_id: string, game: Game) => Game;
  updateGame: (game_id: string, f: (game: Game) => void) => Game | void;
  addUser: (game_id: string, user: User) => void;
  removeUser: (game_id: string, user: User | string) => User | false;
  setUserIdMap: (f: (userIdMap: { [socket_id: string]: string }) => void) => void;
}>(
  immer((set, get) => ({
    games: {},
    users: {},
    userIdMap: {},
    setGame: (game_id, game) => {
      set(({ games }) => {
        games[game_id] = game;
      });

      return get().games[game_id]!;
    },
    updateGame: (game_id, f) => {
      if (!(game_id in get().games)) {
        console.error(`Game with id: ${game_id} not found!`);
        return;
      }

      set(({ games }) => {
        f(games[game_id]!);
      });

      return get().games[game_id]!;
    },
    addUser: (game_id, user) => {
      get().updateGame(game_id, (game) => {
        game.users.push(user);
      });
    },
    removeUser: (game_id, user) => {
      let result: User | false = false;
      let myId = typeof user === "string" ? user : user.id;

      get().updateGame(game_id, (game) => {
        let idx = game.users.findIndex((x) => x.id === myId);

        if (idx !== -1) {
          result = { ...game.users.splice(idx, 1)[0] };
        }
      });

      return result;
    },
    setUserIdMap: (f) => {
      set((draft) => {
        f(draft.userIdMap);
      });
    },
  }))
);

export { useStore };
