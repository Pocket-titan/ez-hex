type Color = string;

type Colormap = {
  background: Color;
  players: Color[];
  empty: Color;
};

const colormaps: { [key: string]: Colormap } = {
  vintage: {
    background: "hsl(45, 74%, 82%)",
    players: [
      "hsl(22, 100%, 59%)",
      "hsl(156, 43%, 67%)",
      "hsl(62, 73%, 45%)",
      "hsl(335, 100%, 50%)",
    ],
    empty: "hsl(45, 30%, 67%)",
  },
};

export default colormaps;
