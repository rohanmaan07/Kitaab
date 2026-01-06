import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

function RightSidebar() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem("id");
      const response = await api.get(`/otheruser/${currentUserId}`);

      // Get current user's following list
      const userResponse = await api.get(`/userInfo`);

      const following = userResponse.data.following || [];

      // Set initial following states
      const states = {};
      response.data.otherUsers.forEach((user) => {
        states[user._id] = following.includes(user._id);
      });
      setFollowingStates(states);

      // Show only first 5 users
      setSuggestions(response.data.otherUsers.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const currentUserId = localStorage.getItem("id");
      const isFollowing = followingStates[userId];
      const endpoint = isFollowing
        ? `/unfollow/${userId}`
        : `/follow/${userId}`;

      await api.post(endpoint, { id: currentUserId });

      // Update local state
      setFollowingStates((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Who to Follow Widget */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
        <h2 className="text-xl font-bold text-white px-4 py-3">
          Who to follow
        </h2>

        <div className="divide-y divide-zinc-800">
          {loading ? (
            // Loading Skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="px-4 py-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-zinc-700 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))
          ) : suggestions.length > 0 ? (
            suggestions.map((user) => (
              <div
                key={user._id}
                className="px-4 py-3 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Link to={`/user/${user._id}`}>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 hover:border-[#E50914] transition-colors"
                    />
                  </Link>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/user/${user._id}`}>
                      <h3 className="text-white font-semibold hover:underline truncate">
                        {user.name || user.username}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        @{user.username}
                      </p>
                    </Link>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => handleFollow(user._id)}
                    className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                      followingStates[user._id]
                        ? "bg-transparent border border-zinc-600 text-white hover:border-red-500 hover:text-red-500 hover:bg-red-500/10"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    {followingStates[user._id] ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <p>No suggestions available</p>
            </div>
          )}
        </div>

        {/* Show More */}
        {suggestions.length > 0 && (
          <Link
            to="/explore"
            className="block px-4 py-3 text-[#E7484D] hover:bg-zinc-800 transition-colors"
          >
            Show more
          </Link>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-4 px-4">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>·</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Cookie Policy</a>
        </div>
        <p className="text-xs text-gray-600 mt-2">© 2026 Kitaab, Inc.</p>
      </div>
    </div>
  );
}

export default RightSidebar;
