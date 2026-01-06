import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "../Components/Loader";
import TweetCard from "../Components/TweetCard";
import EditProfileModal from "../Components/EditProfileModal";
import { AiOutlineEdit, AiOutlineMessage } from "react-icons/ai";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const currentUserId = localStorage.getItem("id");

  const headers = {
    id: currentUserId,
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch user details
      const userResponse = await axios.get(
        `http://localhost:8080/api/v1/profile/${id}`,
        { headers }
      );
      setUser(userResponse.data.user);

      // Check if current user is following this user
      const currentUserResponse = await axios.get(
        `http://localhost:8080/api/v1/userInfo`,
        { headers }
      );
      setIsFollowing(
        currentUserResponse.data.following?.includes(id) || false
      );

      // Fetch user's tweets using dedicated endpoint
      const tweetsResponse = await axios.get(
        `http://localhost:8080/api/v1/usertweets/${id}`,
        { headers }
      );

      setTweets(tweetsResponse.data.tweets);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing
        ? `http://localhost:8080/api/v1/unfollow/${id}`
        : `http://localhost:8080/api/v1/follow/${id}`;

      const response = await axios.post(
        endpoint,
        { id: currentUserId },
        { headers }
      );

      alert(response.data.message);
      setIsFollowing(!isFollowing);
      fetchUserProfile(); // Refresh to update follower count
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      alert(error.response?.data?.message || "Error updating follow status");
    }
  };

  const handleMessage = async () => {
    try {
      // Create or get conversation with this user
      const response = await axios.post(
        "http://localhost:8080/api/v1/conversations/create",
        { receiverId: id },
        { headers }
      );

      console.log("Conversation created/found:", response.data.conversation);

      // Navigate to messages page with conversation data
      navigate("/messages", {
        state: {
          selectedConversation: response.data.conversation
        }
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl">User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUserId === id;

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Profile Header */}
      <div className="bg-zinc-900 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#E50914]"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleMessage}
                      className="px-6 py-2 rounded-lg font-semibold transition bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 flex items-center gap-2"
                    >
                      <AiOutlineMessage className="text-lg" />
                      Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg font-semibold transition ${isFollowing
                        ? "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700"
                        : "bg-[#E50914] text-white hover:bg-red-700"
                        }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                )}

                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-6 py-2 rounded-lg font-semibold transition bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 flex items-center gap-2"
                  >
                    <AiOutlineEdit className="text-lg" />
                    Edit Profile
                  </button>
                )}
              </div>

              <p className="text-gray-300 mb-4">{user.email}</p>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-white">{tweets.length}</span>
                  <span className="text-gray-400 ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold text-white">
                    {user.followers?.length || 0}
                  </span>
                  <span className="text-gray-400 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-white">
                    {user.following?.length || 0}
                  </span>
                  <span className="text-gray-400 ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Tweets */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {isOwnProfile ? "Your Posts" : `${user.username}'s Posts`}
        </h2>

        {tweets.length === 0 ? (
          <div className="text-center text-gray-400 p-12 bg-zinc-800 rounded-lg">
            <p className="text-lg">
              No posts yet! Start sharing your thoughts ✍️
            </p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              currentUserId={currentUserId}
              onDelete={() => fetchUserProfile()}
            />
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            fetchUserProfile(); // Refresh to get latest data
          }}
        />
      )}
    </div>
  );
}

export default UserProfile;
