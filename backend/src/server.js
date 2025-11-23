// server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socket = require("./socket");
require("./cron/jobs");

// Create HTTP server
const server = http.createServer(app);

// Initialize socket
socket.init(server);

// Connect DB
connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
