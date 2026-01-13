import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { 
  addNotification, 
  removeNotification, 
  markAsRead,
  markAllAsRead 
} from '../features/notification/notificationSlice';
import socket from '../socket';
import toast from 'react-hot-toast';

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notification);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for hire notifications (freelancer got hired)
    socket.on('hiredNotification', (notification) => {
      dispatch(addNotification({
        type: 'HIRE',
        message: notification.message,
        projectName: notification.projectName,
        bidId: notification.bidId,
        gigId: notification.gigId,
      }));
      toast.success(notification.message, {
        duration: 5000,
        position: 'top-right',
      });
    });

    // Listen for assignment notifications (client hired someone)
    socket.on('assignedNotification', (notification) => {
      dispatch(addNotification({
        type: 'ASSIGNED',
        message: notification.message,
        freelancerName: notification.freelancerName,
        projectName: notification.projectName,
        bidId: notification.bidId,
        gigId: notification.gigId,
      }));
      toast.success(notification.message, {
        duration: 5000,
        position: 'top-right',
      });
    });

    // Listen for rejection notifications (bid was rejected)
    socket.on('rejectionNotification', (notification) => {
      dispatch(addNotification({
        type: 'REJECTION',
        message: notification.message,
        projectName: notification.projectName,
        hiredFreelancerName: notification.hiredFreelancerName,
        bidId: notification.bidId,
        gigId: notification.gigId,
      }));
      toast.error(notification.message, {
        duration: 5000,
        position: 'top-right',
      });
    });

    return () => {
      socket.off('hiredNotification');
      socket.off('assignedNotification');
      socket.off('rejectionNotification');
    };
  }, [dispatch]);

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const handleNotificationClick = (id) => {
    dispatch(markAsRead(id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'HIRE':
        return <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />;
      case 'ASSIGNED':
        return <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />;
      case 'REJECTION':
        return <XCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />;
      default:
        return <Bell size={20} className="text-gray-600 flex-shrink-0 mt-1" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'HIRE':
        return 'bg-green-50';
      case 'ASSIGNED':
        return 'bg-blue-50';
      case 'REJECTION':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
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
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
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
                  className={`p-4 hover:bg-gray-100 transition cursor-pointer border-l-4 ${
                    !notification.read ? 'border-l-blue-500 bg-blue-50' : 'border-l-gray-200'
                  } ${getNotificationBgColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
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