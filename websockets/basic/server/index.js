const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    // Update CORS to allow all
    origin: "*",
  },
});

io.on("connection", (socket) => {


  socket.on("message", (msg) => {
    console.log(msg);
  });
  socket.emit("message", "Hello from server");
});

httpServer.listen(9000, () => {
  console.log("Server is listening on port 9000");
});
