import { createServer } from "http";
import { createWebsocket } from "./socket";
import express from "express";
import path from "path";

const PORT = 3000;
const app = express();
const server = createServer(app);
const hex = createWebsocket({ server });

app.use(express.static(path.join(__dirname, "../", "client", "build")));
// app.use(express.static(path.join(__dirname, "../", "client", "public")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(path.dirname(__filename), "../", "client", "build", "index.html")
  );
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT} 🚀`);
});
