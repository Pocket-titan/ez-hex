import { State, StateCreator } from "zustand";
import produce from "immer";

/** Makes immer work with zustand (definitely did not write this myself) */
const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: T) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api);

export default immer;
