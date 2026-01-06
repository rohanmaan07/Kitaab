import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";

import {
  AiOutlineHeart,
  AiOutlineHistory,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/auth";

function Sidebar({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  return (
    <div className="p-6 rounded-lg flex flex-col items-center justify-between lg:h-[88vh] bg-black bg-opacity-90 backdrop-blur-lg shadow-lg  w-full text-white border border-gray-700 overflow-hidden   ">
      <div className="flex items-center flex-col justify-center mb-10 ">
        <img
          src={data.avatar || `https://ui-avatars.com/api/?name=${data.username}&background=E50914&color=fff&bold=true`}
          alt="User Avatar"
          className="h-[20vh] w-[20vh] rounded-full shadow-lg mb-4 transition-transform duration-500 hover:scale-105 object-cover border-4 border-[#E50914]"
        />
        <p className="text-sm font-bold text-white ">{data.username}</p>
        <p className="text-sm text-gray-400">{data.email}</p>
        <div className="w-full mt-2 h-[1px] bg-gray-600"></div>
      </div>

      {role === "user" && (
        <div className="flex flex-col items-center w-full space-y-4 mb-auto">
          <Link
            to="/profile"
            className="group flex items-center justify-between w-full py-4 px-5 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
          >
            <div className="flex items-center">
              <AiOutlineHeart className="mr-3 text-2xl text-red-500 group-hover:text-white transition duration-300" />
              <span className="text-white group-hover:text-white transition duration-300">
                Favourites
              </span>
            </div>
          </Link>

          <Link
            to="/profile/orderhistory"
            className="group flex items-center justify-between w-full py-4 px-5 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
          >
            <div className="flex items-center">
              <AiOutlineHistory className="mr-3 text-2xl text-red-500 group-hover:text-white transition duration-300" />
              <span className="text-white group-hover:text-white transition duration-300">
                History
              </span>
            </div>
          </Link>

          <Link
            to={`/user/${data._id}`}
            className="group flex items-center justify-between w-full py-4 px-5 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
          >
            <div className="flex items-center">
              <AiOutlineSetting className="mr-3 text-2xl text-red-500 group-hover:text-white transition duration-300" />
              <span className="text-white group-hover:text-white transition duration-300">
                My Profile
              </span>
            </div>
          </Link>
        </div>
      )}

      {role === "admin" && (
        <div className="flex flex-col items-center w-full space-y-4 mb-auto">
          <Link
            to="/profile"
            className="group flex items-center justify-between w-full py-4 px-5 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
          >
            <div className="flex items-center">
              <MdBorderColor className="mr-3 text-2xl text-red-500 group-hover:text-white transition duration-300" />
              <span className="text-white group-hover:text-white transition duration-300">
                All Orders
              </span>
            </div>
          </Link>

          <Link
            to="/profile/addBook"
            className="group flex items-center justify-between w-full py-4 px-5 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
          >
            <div className="flex items-center">
              <FaBook className="mr-3 text-2xl text-red-500 group-hover:text-white transition duration-300" />
              <span className="text-white group-hover:text-white transition duration-300">
                Add Book
              </span>
            </div>
          </Link>
        </div>
      )}
      <div className="w-full mt-10">
        <button
          className="flex items-center justify-center w-full bg-black text-white py-3 rounded border border-[#E50914] hover:bg-[#E50914] hover:text-white transition duration-300"
          onClick={() => {
            dispatch(authActions.logout());
            dispatch(authActions.changeRole("user"));
            localStorage.clear("id");
            localStorage.clear("token");
            localStorage.clear("role");
            navigate("/");
          }}
        >
          <AiOutlineLogout className="mr-3 text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
