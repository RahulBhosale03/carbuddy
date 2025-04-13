const socketio = require("socket.io");
const setUpSocket = (server) => {
  const frontEndUrl = process.env.FRONTEND_URL;
  const io = new socketio.Server(server,{
    cors: {
      origin: frontEndUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling"], // Force long polling (disable WebSockets)
    allowEIO3: true, // Support older socket.io clients
  });
  io.on("connection", (socket) => {
    // console.log("User connected: ", socket.id);
    // Join particular group related to ride.
    socket.on("joinRoom", (rideId) => {
      socket.join(rideId);
      socket.broadcast.to(rideId).emit('newUserJoined');
      // console.log(`User with socketId ${socket.id} joined Ride ${rideId}`);
    });
    // Listen/Receive updated coords
    socket.on("locationUpdate", ({ rideId, lat, lng, name }) => {
      // emit/broadcast to particular group of ride
      socket.broadcast.to(rideId).emit("newLocation", { id: socket.id, lat, lng, name });
    });

    socket.on('leaveRoom',(rideId)=>{
      socket.broadcast.to(rideId).emit('removeUser', {id: socket.id});
      socket.leave(rideId);
      // console.log(`User with socketId ${socket.id} left Ride ${rideId}`);
    })
    socket.on("disconnect", () => {
      // console.log("User disconnected: ", socket.id);
    });
  });
  return io
};
module.exports = { setUpSocket };
