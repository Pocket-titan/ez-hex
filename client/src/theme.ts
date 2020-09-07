import create from "zustand";

type Theme = {};

export const useTheme = create((set) => ({
  theme: {},
}));
