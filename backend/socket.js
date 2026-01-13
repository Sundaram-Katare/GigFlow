const userSockets = {};
let ioInstance;

const initSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      userSockets[userId] = socket.id;
    });

    socket.on('disconnect', () => {
      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          break;
        }
      }
    });
  });
};

const emitHiredNotification = (userId, message) => {
  const socketId = userSockets[userId];
  if (socketId && ioInstance) {
    ioInstance.to(socketId).emit('hiredNotification', message);
  }
};

module.exports = { initSocket, emitHiredNotification, userSockets };