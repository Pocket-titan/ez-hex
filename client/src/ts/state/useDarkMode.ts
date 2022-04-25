import create from "zustand";

const useDarkMode = create<{
  mode: "dark" | "light";
  setMode: (mode: "dark" | "light") => void;
}>((set, get) => ({
  mode: Array.from(document.body.classList.values()).includes("dark")
    ? "dark"
    : "light",
  setMode: (mode) => {
    set({
      mode,
    });
  },
}));

export default useDarkMode;

export { useDarkMode };
