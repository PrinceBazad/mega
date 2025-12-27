import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck, FaCheckDouble } from "react-icons/fa";
import API_BASE_URL from "../config";

const Notification = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up periodic updates (every 10 seconds for more frequent updates)
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    // Calculate unread count
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/notifications/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "property":
        return "🏠";
      case "agent":
        return "👤";
      case "builder":
        return "🏢";
      case "project":
        return "🏗️";
      case "admin":
        return "⚙️";
      case "inquiry":
        return "💬";
      default:
        return "🔔";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="notification-container">
      <div
        className="notification-icon"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <FaBell className={unreadCount > 0 ? "notification-bell-unread" : ""} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button onClick={markAllAsRead} title="Mark all as read">
                <FaCheckDouble />
              </button>
              <button onClick={() => setShowNotifications(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                >
                  <div className="notification-content">
                    <span className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="notification-text">
                      <p>{notification.message}</p>
                      <small>
                        {notification.admin_name} •{" "}
                        {formatDate(notification.created_at)}
                      </small>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      className="mark-read-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
