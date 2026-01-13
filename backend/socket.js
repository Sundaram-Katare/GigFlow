const userSockets = {};
let ioInstance;

const initSocket = (io) => {
  ioInstance = io;
  
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // User joins their personal room
    socket.on('join', (userId) => {
      if (!userId) return;
      
      userSockets[userId] = socket.id;
      socket.join(userId); // Join a room with their user ID
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          console.log(`User ${userId} disconnected`);
          delete userSockets[userId];
          break;
        }
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

/**
 * Emit hire notification to a specific user
 * @param {string} userId - The recipient user ID
 * @param {object} notificationData - Data to send
 */
const emitHiredNotification = (userId, notificationData) => {
  if (!ioInstance) {
    console.warn('Socket.io instance not initialized');
    return false;
  }

  const notification = {
    type: 'HIRE_NOTIFICATION',
    message: notificationData.message || notificationData,
    projectName: notificationData.projectName,
    bidId: notificationData.bidId,
    gigId: notificationData.gigId,
    timestamp: new Date().toISOString(),
  };

  // Emit to the user's room
  ioInstance.to(userId).emit('hiredNotification', notification);
  console.log(`Hire notification sent to user ${userId}`);
  return true;
};

/**
 * Emit notification to the gig owner when their gig is assigned
 * @param {string} userId - The gig owner's user ID
 * @param {object} notificationData - Data to send
 */
const emitAssignedNotification = (userId, notificationData) => {
  if (!ioInstance) {
    console.warn('Socket.io instance not initialized');
    return false;
  }

  const notification = {
    type: 'ASSIGNED_NOTIFICATION',
    message: notificationData.message,
    freelancerName: notificationData.freelancerName,
    projectName: notificationData.projectName,
    bidId: notificationData.bidId,
    gigId: notificationData.gigId,
    timestamp: new Date().toISOString(),
  };

  ioInstance.to(userId).emit('assignedNotification', notification);
  console.log(`Assignment notification sent to gig owner ${userId}`);
  return true;
};

/**
 * Get all connected users
 */
const getConnectedUsers = () => {
  return Object.keys(userSockets);
};

module.exports = { 
  initSocket, 
  emitHiredNotification, 
  emitAssignedNotification,
  userSockets,
  getConnectedUsers 
};