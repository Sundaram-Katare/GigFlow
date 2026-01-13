const userSockets = {};
let ioInstance;

const initSocket = (io) => {
  ioInstance = io;
  
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('join', (userId) => {
      if (!userId) return;
      
      userSockets[userId] = socket.id;
      socket.join(userId); 
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          console.log(`User ${userId} disconnected`);
          delete userSockets[userId];
          break;
        }
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};


const emitHiredNotification = (userId, notificationData) => {
  if (!ioInstance) {
    console.warn('Socket.io instance not initialized');
    return false;
  }

  const notification = {
    type: 'HIRE_NOTIFICATION',
    message: notificationData.message,
    projectName: notificationData.projectName,
    bidId: notificationData.bidId,
    gigId: notificationData.gigId,
    freelancerName: notificationData.freelancerName,
    timestamp: new Date().toISOString(),
  };

  ioInstance.to(userId).emit('hiredNotification', notification);
  console.log(`Hire notification sent to user ${userId}`);
  return true;
};


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


const emitRejectionNotification = (userId, notificationData) => {
  if (!ioInstance) {
    console.warn('Socket.io instance not initialized');
    return false;
  }

  const notification = {
    type: 'REJECTION_NOTIFICATION',
    message: notificationData.message,
    projectName: notificationData.projectName,
    bidId: notificationData.bidId,
    gigId: notificationData.gigId,
    hiredFreelancerName: notificationData.hiredFreelancerName,
    timestamp: new Date().toISOString(),
  };

  ioInstance.to(userId).emit('rejectionNotification', notification);
  console.log(`Rejection notification sent to user ${userId}`);
  return true;
};


const getConnectedUsers = () => {
  return Object.keys(userSockets);
};

module.exports = { 
  initSocket, 
  emitHiredNotification, 
  emitAssignedNotification,
  emitRejectionNotification,
  userSockets,
  getConnectedUsers 
};