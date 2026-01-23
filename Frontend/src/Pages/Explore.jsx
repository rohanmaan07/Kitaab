import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader } from "../Components/Loader";
import { getApiUrl } from "../config/api";

function Explore() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingStates, setFollowingStates] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const currentUserId = localStorage.getItem("id");

            // Fetch all other users
            const response = await axios.get(
                getApiUrl(`otheruser/${currentUserId}`),
                { headers }
            );

            // Get current user's following list
            const userResponse = await axios.get(
                getApiUrl("userInfo"),
                { headers }
            );

            const following = userResponse.data.following || [];

            // Set initial following states
            const states = {};
            response.data.otherUsers.forEach((user) => {
                states[user._id] = following.includes(user._id);
            });
            setFollowingStates(states);
            setUsers(response.data.otherUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            const isFollowing = followingStates[userId];
            const endpoint = isFollowing
                ? getApiUrl(`unfollow/${userId}`)
                : getApiUrl(`follow/${userId}`);

            await axios.post(endpoint, { id: headers.id }, { headers });

            // Update local state
            setFollowingStates((prev) => ({
                ...prev,
                [userId]: !isFollowing,
            }));
        } catch (error) {
            console.error("Error following/unfollowing:", error);
        }
    };

    // Filter users based on search query
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Explore Users</h1>
                    <p className="text-gray-400">
                        Discover and connect with poetry lovers
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search users by name, username, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition"
                    />
                </div>

                {/* User Count */}
                <div className="mb-4 text-gray-400 text-sm">
                    {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
                </div>

                {/* Users Grid */}
                {filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all"
                            >
                                {/* User Info */}
                                <div className="flex items-start gap-3 mb-4">
                                    <Link to={`/user/${user._id}`}>
                                        <img
                                            src={
                                                user.avatar ||
                                                `https://ui-avatars.com/api/?name=${user.username}&background=E50914&color=fff&bold=true`
                                            }
                                            alt={user.username}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 hover:border-[#E50914] transition-colors"
                                        />
                                    </Link>

                                    <div className="flex-1 min-w-0">
                                        <Link to={`/user/${user._id}`}>
                                            <h3 className="text-white font-semibold hover:text-[#E50914] transition truncate">
                                                {user.name || user.username}
                                            </h3>
                                            <p className="text-gray-400 text-sm truncate">
                                                @{user.username}
                                            </p>
                                        </Link>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 text-xs text-gray-400 mb-4">
                                    <div>
                                        <span className="font-bold text-white">
                                            {user.followers?.length || 0}
                                        </span>{" "}
                                        Followers
                                    </div>
                                    <div>
                                        <span className="font-bold text-white">
                                            {user.following?.length || 0}
                                        </span>{" "}
                                        Following
                                    </div>
                                </div>

                                {/* Follow Button */}
                                <button
                                    onClick={() => handleFollow(user._id)}
                                    className={`w-full py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${followingStates[user._id]
                                        ? "bg-transparent border border-zinc-600 text-white hover:border-red-500 hover:text-red-500 hover:bg-red-500/10"
                                        : "bg-[#E50914] text-white hover:bg-opacity-90"
                                        }`}
                                >
                                    {followingStates[user._id] ? "Following" : "Follow"}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                        <p className="text-gray-400 text-lg">No users found</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Try adjusting your search query
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Explore;
