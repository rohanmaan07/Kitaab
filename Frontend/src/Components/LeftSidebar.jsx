import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import api from "../utils/axios";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineBell,
  AiFillBell,
  AiOutlineMessage,
  AiFillMessage,
  AiOutlineBook,
  AiFillBook,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { FaPenNib } from "react-icons/fa";
import { BsBookmark, BsFillBookmarkFill, BsFillPersonFill } from "react-icons/bs";

function LeftSidebar() {
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  const currentPath = location.pathname;
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notification count
  useEffect(() => {
    fetchNotificationCount();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  const menuItems = [
    {
      name: "Home",
      path: "/timeline",
      icon: AiOutlineHome,
      iconFilled: AiFillHome,
      show: true,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: AiOutlineBell,
      iconFilled: AiFillBell,
      show: true,
      badge: notificationCount,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: AiOutlineMessage,
      iconFilled: AiFillMessage,
      show: true,
      badge: 0,
    },
    {
      name: "Bookmarks",
      path: "/bookmarks",
      icon: BsBookmark,
      iconFilled: BsFillBookmarkFill,
      show: true,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: AiOutlineUser,
      iconFilled: BsFillPersonFill,
      show: true,
    },
    {
      name: "Shayar",
      path: "/shayar",
      icon: FaPenNib,
      iconFilled: FaPenNib,
      show: true,
    },
    {
      name: "All Books",
      path: "/all-books",
      icon: AiOutlineBook,
      iconFilled: AiFillBook,
      show: true,
    },
    {
      name: "Cart",
      path: "/cart",
      icon: AiOutlineShoppingCart,
      iconFilled: AiOutlineShoppingCart,
      show: true,
    },
  ];

  const isActive = (path) => {
    if (path === "/timeline" && currentPath === "/") return true;
    return currentPath === path;
  };

  return (
    <div className="px-4 py-6 space-y-2">
      {menuItems.map(
        (item) =>
          item.show && (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group relative ${isActive(item.path)
                ? "bg-[#E7484D] text-white font-semibold"
                : "text-gray-300 hover:bg-zinc-800"
                }`}
            >
              {/* Icon */}
              {isActive(item.path) ? (
                <item.iconFilled className="text-2xl" />
              ) : (
                <item.icon className="text-2xl group-hover:scale-110 transition-transform" />
              )}

              {/* Label */}
              <span className="text-lg">{item.name}</span>

              {/* Badge for notifications/messages */}
              {item.badge > 0 && (
                <span className="absolute top-2 left-8 bg-[#E50914] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          )
      )}

      {/* Post Button */}
      <Link
        to="/timeline?compose=true"
        className="block mt-4 w-full bg-[#E50914] text-white text-center py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
      >
        Post Shayari
      </Link>
    </div>
  );
}

export default LeftSidebar;
