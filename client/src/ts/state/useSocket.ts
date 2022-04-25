import { Manager } from "socket.io-client";
import type { Socket } from "socket.io-client/build/socket";
import type { Client, Server } from "types";
import create from "zustand";
import immer from "./immer";

const responseMap = {
  ask_if_game_name_is_available: "is_game_name_available",
  create_game: "game_created",
} as const;

const createSocket = () => {
  const { protocol, hostname } = window.location;
  const port = process.env.NODE_ENV === "production" ? 3000 : 3004;
  const isNgrok = hostname.includes("ngrok.io");
  const url = `${protocol === "https:" ? "wss" : "ws"}://${hostname}${
    isNgrok ? "/" : `:${port}/`
  }`;
  const manager = new Manager(url);
  const socket = manager.socket("/hex");

  if (process.env.NODE_ENV === "development") {
    socket.onAny((eventType, ...args) => {
      console.log(`received event of type: ${eventType}`, ...args);
    });
  }

  return socket;
};

const useSocket = create<{
  socket: Socket;
}>(
  immer((set, get) => ({
    socket: createSocket(),
  }))
);

async function emit<T extends Client.EventType>(
  eventType: T,
  event: Client.Event<T>
): Promise<
  T extends keyof typeof responseMap ? Server.Event<typeof responseMap[T]> : void
> {
  let { socket } = useSocket.getState();

  socket.emit(eventType, event);

  let responseEvent = (responseMap as any)[eventType] as string | undefined;

  if (responseEvent) {
    return new Promise((resolve) => {
      socket.on(responseEvent!, (event: any) => {
        resolve(event);
      });
    });
  } else {
    return new Promise((res) => res(void 0)) as any;
  }
}

export default useSocket;

export { useSocket, emit };
