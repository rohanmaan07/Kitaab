import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../Components/Loader";

function FollowersPage() {
  const { type } = useParams(); // "followers" or "following"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchUsers();
  }, [type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem("id");

      // Get current user details
      const userResponse = await axios.get(
        `http://localhost:8080/api/v1/userInfo`,
        { headers }
      );
      setCurrentUser(userResponse.data);

      // Get all users
      const allUsersResponse = await axios.get(
        `http://localhost:8080/api/v1/otheruser/${currentUserId}`,
        { headers }
      );

      const allUsers = allUsersResponse.data.otherUsers;
      const userList = type === "followers" 
        ? userResponse.data.followers 
        : userResponse.data.following;

      // Filter users based on followers/following IDs
      const filteredUsers = allUsers.filter(user => 
        userList?.includes(user._id)
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {type === "followers" ? "Followers" : "Following"}
        </h1>

        {users.length === 0 ? (
          <div className="text-center text-gray-400 p-12 bg-zinc-800 rounded-lg">
            <p className="text-lg">
              {type === "followers"
                ? "Abhi tak koi follower nahi hai"
                : "Abhi kisi ko follow nahi kiya"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Link
                key={user._id}
                to={`/user/${user._id}`}
                className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition border border-zinc-700"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#E50914]"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {user.name || user.username}
                  </h3>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FollowersPage;
