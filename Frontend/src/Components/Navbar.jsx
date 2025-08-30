import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for managing the hamburger menu

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Define links based on login state
  const links = isLoggedIn
    ? [
        { title: "upcoming", link: "/upcoming" },
        { title: "Shayar", link: "/shayar" },
        { title: "All Books", link: "/all-books" },
        { title: "Cart", link: "/cart" },
        { title: "Profile", link: "/profile" },
        role === "admin" ? { title: "Admin Profile", link: "/profile" } : null,
      ].filter(Boolean) // Remove any null entries from the array
    : [
        { title: "Shayar", link: "/shayar" },
        { title: "All Books", link: "/all-books" },
      ];

  return (
    <div className="bg-black flex items-center px-4 py-3 shadow-lg">
      {/* Logo */}
      <Link to={"/"} className="flex items-center">
        <i className="fas fa-book text-white text-2xl"></i>
        <h1 className="text-white ml-4 text-2xl font-semibold">Kitaab</h1>
      </Link>

      {/* Hamburger Icon */}
      <button
        className="text-white ml-auto block lg:hidden focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      {/* Links for large screens */}
      <div className="hidden lg:flex items-center gap-8 ml-auto">
        <div className="flex gap-6 text-white">
          {links.map((item, i) => (
            <div key={i} className="hover:text-[#E50914] transition duration-300">
              <Link to={item.link} className="flex items-center">
                {item.title}
              </Link>
            </div>
          ))}
        </div>
        {isLoggedIn === false && (
          <div className="flex gap-6">
            <Link to="/login">
              <button className="bg-black text-white px-4 py-2 rounded border border-[#E50914] hover:bg-[#E50914] hover:text-white transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${isOpen ? "block" : "hidden"} absolute top-16 left-0 w-full bg-black text-white z-10 transition-all duration-300 ease-in-out bg-black h-screen`}
      >
        <div className="flex flex-col gap-10 p-4 mt-10 ">
          {links.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="px-4 py-2 text-center font-bold text-3xl hover:text-[#E50914] transition duration-300"
              onClick={() => setIsOpen(false)} // Close menu on link click
            >
              {item.title}
            </Link>
          ))}
        </div>
        {isLoggedIn === false && (
          <div className="flex flex-col gap-10 mt-9  text-center font-bold text-xl ">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="bg-black text-white px-8 py-4 rounded border border-[#E50914] hover:bg-[#E50914] hover:text-white transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <button className="bg-[#E50914] text-white px-8 py-4 rounded hover:bg-opacity-90 transition duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
