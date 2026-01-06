import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineBell, AiOutlineMessage, AiOutlineShoppingCart, AiOutlineUser, AiOutlineLogout, AiOutlineHome, AiOutlineBook } from "react-icons/ai";
import { FiMenu, FiX } from "react-icons/fi";
import { BiBookHeart } from "react-icons/bi";
import api from "../utils/axios";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch counts
  useEffect(() => {
    if (isLoggedIn) {
      fetchCounts();
    }
  }, [isLoggedIn]);

  const fetchCounts = async () => {
    try {
      // Fetch notification count
      const notifRes = await api.get("/notifications/unread-count");
      setNotificationCount(notifRes.data.count || 0);

      // Fetch cart count
      const cartRes = await api.get("/cart");
      setCartCount(cartRes.data.cart?.length || 0);

      // Fetch unread messages count
      const msgRes = await api.get("/conversations/unread-count");
      setUnreadMessages(msgRes.data.count || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Define navigation links
  const navLinks = [
    { title: "Feed", link: "/timeline", icon: <AiOutlineHome size={20} />, show: isLoggedIn },
    { title: "Shayar", link: "/shayar", icon: <BiBookHeart size={20} />, show: true },
    { title: "All Books", link: "/all-books", icon: <AiOutlineBook size={20} />, show: true },
  ].filter(item => item.show);

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-black/95 backdrop-blur-md shadow-xl border-b border-gray-800/50" : "bg-black border-b border-gray-800/30"
    }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <i className="fas fa-book text-[#E50914] text-2xl group-hover:scale-110 transition-transform duration-200"></i>
              <div className="absolute inset-0 bg-[#E50914] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight group-hover:text-[#E50914] transition-colors duration-200">
              Kitaab
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Nav Links */}
            <div className="flex items-center gap-2">
              {navLinks.map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[15px] font-medium transition-all duration-200 ${
                    isActivePath(item.link)
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-4 border-l border-gray-800/50 pl-4">
                {/* Messages */}
                <Link
                  to="/messages"
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="Messages"
                >
                  <AiOutlineMessage size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-black">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="Notifications"
                >
                  <AiOutlineBell size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-black">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="Cart"
                >
                  <AiOutlineShoppingCart size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-black">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-2" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                    aria-label="Profile menu"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent hover:ring-gray-700 transition-all"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E50914] to-[#c4070f] flex items-center justify-center ring-2 ring-transparent hover:ring-gray-700 transition-all">
                        <span className="text-white font-bold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-black border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                      <div className="p-4 border-b border-gray-800/50">
                        <p className="text-white font-bold text-[15px] truncate">{user?.name || "User"}</p>
                        <p className="text-gray-500 text-[13px] truncate">{user?.email || ""}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-white"
                        >
                          <AiOutlineUser size={20} className="text-gray-400" />
                          <span className="text-[15px]">Profile</span>
                        </Link>
                        
                        {role === "admin" && (
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-white"
                          >
                            <i className="fas fa-crown text-yellow-500"></i>
                            <span className="text-[15px]">Admin Panel</span>
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-red-500"
                        >
                          <AiOutlineLogout size={20} />
                          <span className="text-[15px] font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login">
                  <button className="px-6 py-2 text-white font-medium text-[15px] rounded-full border border-gray-700 hover:bg-white/5 hover:border-white transition-all duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-2 bg-[#E50914] text-white font-bold text-[15px] rounded-full hover:bg-[#c4070f] transition-all duration-200 shadow-lg shadow-[#E50914]/20">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors duration-200 text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-black/98 backdrop-blur-xl transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((item, i) => (
              <Link
                key={i}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-[17px] font-medium transition-all duration-200 ${
                  isActivePath(item.link)
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  to="/messages"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <AiOutlineMessage size={20} />
                  <span className="text-[17px] font-medium">Messages</span>
                  {unreadMessages > 0 && (
                    <span className="ml-auto bg-[#E50914] text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-2">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <AiOutlineBell size={20} />
                  <span className="text-[17px] font-medium">Notifications</span>
                  {notificationCount > 0 && (
                    <span className="ml-auto bg-[#E50914] text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-2">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <AiOutlineShoppingCart size={20} />
                  <span className="text-[17px] font-medium">Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-[#E50914] text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-2">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <AiOutlineUser size={20} />
                  <span className="text-[17px] font-medium">Profile</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                  <AiOutlineLogout size={20} />
                  <span className="text-[17px] font-medium">Logout</span>
                </button>
              </>
            )}
          </div>

          {!isLoggedIn && (
            <div className="px-4 pb-6 space-y-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                <button className="w-full px-6 py-4 text-white font-medium text-[17px] rounded-2xl border border-gray-700 hover:bg-white/5 hover:border-white transition-all duration-200">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="block">
                <button className="w-full px-6 py-4 bg-[#E50914] text-white font-bold text-[17px] rounded-2xl hover:bg-[#c4070f] transition-all duration-200 shadow-lg shadow-[#E50914]/20">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
