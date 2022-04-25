import type { Board, BoardSize, Game, Hex, Player } from "types";
import { some } from "lodash";

const createBoard = (board_size: BoardSize): Board =>
  [...Array(board_size[0]).keys()].map((x) =>
    [...Array(board_size[1]).keys()].map((y) => {
      return {
        x,
        y,
        occupied_by: "nobody",
      };
    })
  );

const createGame = (board_size: BoardSize): Game => ({
  board: createBoard(board_size),
  turn: {
    // role: ["player_one", "player_two"][Math.round(Math.random())] as [
    //   "player_one",
    //   "player_two"
    // ][number],
    role: "player_one",
  },
  winner: undefined,
  users: [],
});

function findNeighbours(hex: Hex | [number, number], board: Board): [x: number, y: number][] {
  let [x, y] = hex instanceof Array ? hex : [hex.x, hex.y];

  const neighbours = [
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
  ].filter(([x, y]) => x >= 0 && x < board.length && y >= 0 && y < board.length) as [
    number,
    number
  ][];

  return neighbours;
}

function findFriendlyNeighbours(hex: Hex, board: Board): [x: number, y: number][] {
  if (hex.occupied_by === "nobody") {
    return [];
  }

  const player = hex.occupied_by;
  const neighbours = findNeighbours(hex, board);
  const friendlyNeighbours = neighbours.filter(([x, y]) => board[x][y].occupied_by === player) as [
    number,
    number
  ][];

  return friendlyNeighbours;
}

function traverse(board: Board, path: Hex[]): Hex[][] {
  let hex = path[path.length - 1];
  let player = hex.occupied_by as Player;

  let neighbours = findNeighbours(hex, board).filter(
    ([x, y]) => !some(path, { x, y }) && board[x][y].occupied_by === player
  );

  console.log(`neighbours`, neighbours);

  if (neighbours.length === 0) {
    return [path];
  }

  // let x = neighbours.flatMap(([x, y]) => traverse(board, [...path, { x, y, occupied_by: player }]));

  return neighbours.flatMap(([x, y]) => traverse(board, [...path, { x, y, occupied_by: player }]));
}

function checkWinCondition({ board }: Game, lastHex: Hex): false | Hex[] {
  const player = lastHex.occupied_by;

  if (player === "nobody") {
    return false;
  }

  let hexes = board.flat().filter(({ occupied_by }) => occupied_by === player);

  if (hexes.length < board.length) {
    return false;
  }

  const [isFirst, isLast]: [
    (hex: { x: number; y: number }) => boolean,
    (hex: { x: number; y: number }) => boolean
  ] =
    player === "player_one"
      ? [({ x, y }) => x === 0, ({ x, y }) => x === board.length - 1]
      : [({ x, y }) => y === 0, ({ x, y }) => y === board.length - 1];

  const [sideOne, sideTwo] = [hexes.filter(isFirst), hexes.filter(isLast)];

  if (sideOne.length === 0 || sideTwo.length === 0) {
    return false;
  }

  let paths: Hex[][] = [];
  let [starters, enders] =
    sideOne.length < sideTwo.length ? [sideOne, sideTwo] : [sideTwo, sideOne];

  for (let start of starters) {
    let pathsFromHere = traverse(board, [start]);
    paths.push(...pathsFromHere);
  }

  paths = paths
    .filter((path) => {
      if (path.length < board.length) {
        return false;
      }

      let [first, last] = [path[0], path[path.length - 1]];
      if (!(isFirst(first) !== isFirst(last) && isLast(first) !== isLast(last))) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.length - a.length);

  if (paths.length === 0) {
    return false;
  }

  let shortestPath = paths[0];
  return shortestPath;
}

export { createGame, createBoard, checkWinCondition };
