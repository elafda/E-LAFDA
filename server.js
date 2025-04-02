const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinLafda", (lafdaId) => {
        socket.join(lafdaId);
        console.log(`User joined Lafda: ${lafdaId}`);
    });

    socket.on("sendMessage", ({ lafdaId, message }) => {
        io.to(lafdaId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
