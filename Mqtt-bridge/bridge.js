const mqtt = require("mqtt");
const fs = require("fs");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const options = {
  port: 8883,
  host: "localhost",
  protocol: "mqtts",
  username: "admin",
  password: "StrongPassword123",
  ca: fs.readFileSync("broker.crt"),
  rejectUnauthorized: false // ✅ self-signed cert allow
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("✅ MQTT connected");
  // সব টপিক সাবস্ক্রাইব করি
  client.subscribe(["ESP", "ESP2","ESPX","voltX","ESP3"], (err) => {
    if (err) {
      console.error("❌ Subscribe error:", err);
    } else {
      console.log("📡 Subscribed to topics ESP, ESP2,text,ESPX,voltX");
    }
  });
});

client.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

client.on("message", (topic, message) => {
  const payload = message.toString();
  const data = {
    topic,
    payload,
    timestamp: new Date().toISOString()
  };

  console.log("📩 MQTT received:", data);

  // সব frontend এ পাঠাই
  io.emit("mqtt_message", data);
});

// ---------------------------
// Socket.IO (Frontend bridge)
// ---------------------------
io.on("connection", (socket) => {
  console.log("⚡ Frontend connected");

  // LED toggle → broker publish
socket.on("publish_mqtt", ({ topic, message }) => {
  console.log(`⬆️ Publishing to '${topic}':`, message);
  client.publish(topic, message.toString(), { qos: 1 });
});

  socket.on("disconnect", () => {
    console.log("❌ Frontend disconnected");
  });
});

server.listen(4000,"0.0.0.0", () =>
  console.log("🚀 Bridge running on http://localhost:4000")
);
