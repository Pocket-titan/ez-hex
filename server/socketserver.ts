import { createWebsocket } from "./socket";

const PORT = process.env.REACT_APP_PORT ? parseInt(process.env.REACT_APP_PORT, 10) : 3004;

const hex = createWebsocket({ port: PORT });
