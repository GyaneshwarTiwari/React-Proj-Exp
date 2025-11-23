// server/socket.js
const jwt = require("jsonwebtoken");

let io;

module.exports.init = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Authenticate and join user-specific room
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("Authentication error"));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;

            return next();
        } catch (err) {
            return next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        // Join room
        socket.join(String(socket.userId));
        console.log(`🔥 User connected to socket: ${socket.userId}`);

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

module.exports.getIo = () => io;
