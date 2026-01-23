import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader } from "../Components/Loader";
import { getApiUrl } from "../config/api";
import {
  AiFillHeart,
  AiOutlineUser,
  AiOutlineCheck,
  AiOutlineDelete
} from "react-icons/ai";
import { BsBellFill, BsBell } from "react-icons/bs";
import LeftSidebar from "../Components/LeftSidebar";
import RightSidebar from "../Components/RightSidebar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchNotifications();
    fetchUnreadCount();

    // Polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        getApiUrl("notifications/all"),
        { headers }
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        getApiUrl("notifications/unread-count"),
        { headers }
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        getApiUrl(`notifications/read/${notificationId}`),
        {},
        { headers }
      );

      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        getApiUrl("notifications/read-all"),
        {},
        { headers }
      );

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        getApiUrl(`notifications/delete/${notificationId}`),
        { headers }
      );

      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <AiFillHeart className="text-[#E50914] text-2xl" />;
      case "follow":
        return <AiOutlineUser className="text-blue-500 text-2xl" />;
      default:
        return <BsBell className="text-gray-400 text-2xl" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now - notifDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return notifDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Three Column Layout */}
      <div className="max-w-[1280px] mx-auto flex relative">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-[250px] fixed h-screen left-0 top-16 border-r border-zinc-800 overflow-y-auto custom-scrollbar bg-black">
          <LeftSidebar />
        </aside>

        {/* Center Content Area */}
        <main className="flex-1 min-h-screen border-x border-zinc-800 lg:ml-[250px] lg:mr-[350px]">
          <div className="max-w-[600px] mx-auto">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-black sticky top-16 z-10">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BsBellFill className="text-2xl text-[#E50914]" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                    {unreadCount > 0 && (
                      <p className="text-sm text-[#E50914]">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#E50914] hover:text-white transition flex items-center gap-1"
                  >
                    <AiOutlineCheck />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              {loading ? (
                <div className="p-8">
                  <Loader />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <BsBell className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No notifications yet
                  </h3>
                  <p className="text-gray-400">
                    When someone likes or follows you, you'll see it here!
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`border-b border-zinc-800 p-4 hover:bg-zinc-900 transition cursor-pointer ${!notification.read ? "bg-zinc-900 bg-opacity-50" : ""
                        }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification._id);
                        }
                        if (notification.tweetId) {
                          navigate(`/timeline`);
                        } else if (notification.type === "follow") {
                          navigate(`/user/${notification.sender._id}`);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Sender Avatar */}
                        <img
                          src={notification.sender.avatar}
                          alt={notification.sender.username}
                          className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700"
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white">
                            <Link
                              to={`/user/${notification.sender._id}`}
                              className="font-bold hover:text-[#E50914] transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              @{notification.sender.username}
                            </Link>
                            <span className="text-gray-400 ml-2">
                              {notification.message.replace(notification.sender.username, "")}
                            </span>
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-gray-500 hover:text-red-500 transition"
                        >
                          <AiOutlineDelete className="text-lg" />
                        </button>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#E50914] rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-[350px] fixed h-screen right-0 top-16 border-l border-zinc-800 overflow-y-auto custom-scrollbar bg-black">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default Notifications;
