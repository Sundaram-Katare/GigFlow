import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  addNotification, 
  removeNotification, 
  markAsRead,
  markAllAsRead 
} from '../features/notification/notificationSlice';
import socket from '../socket';

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notification);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for hire notifications
    socket.on('hiredNotification', (notification) => {
      dispatch(addNotification({
        type: 'HIRE',
        message: notification.message,
        projectName: notification.projectName,
        bidId: notification.bidId,
        gigId: notification.gigId,
      }));
    });

    // Listen for assignment notifications
    socket.on('assignedNotification', (notification) => {
      dispatch(addNotification({
        type: 'ASSIGNED',
        message: notification.message,
        freelancerName: notification.freelancerName,
        projectName: notification.projectName,
        bidId: notification.bidId,
        gigId: notification.gigId,
      }));
    });

    return () => {
      socket.off('hiredNotification');
      socket.off('assignedNotification');
    };
  }, [dispatch]);

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const handleNotificationClick = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-opacity-20 hover:bg-white rounded-lg transition"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] p-4 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-white text-xs hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.type === 'HIRE' ? (
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {!notification.read && (
                        <span className="inline-block mt-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}