import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineMessage,
  AiFillMessage,
  AiOutlineBell,
  AiFillBell,
  AiOutlineUser,
} from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";

function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Home",
      path: "/timeline",
      icon: AiOutlineHome,
      iconFilled: AiFillHome,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: AiOutlineMessage,
      iconFilled: AiFillMessage,
      badge: 0,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: AiOutlineBell,
      iconFilled: AiFillBell,
      badge: 0,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: AiOutlineUser,
      iconFilled: BsFillPersonFill,
    },
  ];

  const isActive = (path) => {
    if (path === "/timeline" && currentPath === "/") return true;
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full relative group"
          >
            {/* Icon */}
            <div className="relative">
              {isActive(item.path) ? (
                <item.iconFilled className="text-2xl text-[#E50914]" />
              ) : (
                <item.icon className="text-2xl text-gray-400 group-hover:text-white transition-colors" />
              )}

              {/* Badge */}
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>

            {/* Active Indicator */}
            {isActive(item.path) && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E50914]"></div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
