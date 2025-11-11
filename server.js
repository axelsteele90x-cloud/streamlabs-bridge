// Streamlabs → StreamElements Bridge for Render.com
import express from "express";
import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";

const STREAMLABS_SOCKET_TOKEN = process.env.STREAMLABS_SOCKET_TOKEN;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.send("✅ Streamlabs Bridge is running!");
});

const sl = new WebSocket(`wss://sockets.streamlabs.com?token=${STREAMLABS_SOCKET_TOKEN}`);

sl.on("open", () => console.log("✅ Connected to Streamlabs socket!"));
sl.on("message", (msg) => {
  try {
    const data = JSON.parse(msg);
    if (data.type === "donation") {
      const dono = data.message[0];
      console.log(`💰 ${dono.name} donated $${dono.amount}`);
      io.emit("streamlabs_donation", dono);
    }
  } catch (err) {
    console.error("⚠️ Parse error:", err);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🌐 Listening on port ${PORT}`));
