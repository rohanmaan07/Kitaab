import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../Components/Loader";

function Profile() {
  const [profile, setProfile] = useState(null); 
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://kitaabrohan-hnhk.onrender.com/api/v1/userInfo`, { headers });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  
  return (
    <div className="px-2 md:px-12 flex flex-col md:flex-row  py-8 gap-4 text-white">
      {!profile ? (
        <Loader /> 
      ) : (
        <>
          <div className="w-full md:w-1/6 ">
            <Sidebar data={profile} />
          </div>
          <div className="w-full md:w-5/6">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
