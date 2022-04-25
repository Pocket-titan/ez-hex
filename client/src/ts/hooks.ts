import { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import type { Server } from "types";
import { useSocket } from "ts/state";

function useListener<T extends Server.EventType>(
  eventType: T,
  listener: (event: Server.Event<T>) => void
) {
  useEffect(() => {
    const socket = useSocket.getState().socket;

    socket.on(eventType, (event: Server.Event<T>) => {
      listener(event);
    });

    return () => {
      socket.off(eventType, listener);
    };
  }, [eventType, listener]);
}

function useGameId() {
  let {
    params: { game_id },
  } = useRouteMatch<{ game_id: string }>();
  return game_id;
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export { useListener, useGameId, useLocalStorage };
