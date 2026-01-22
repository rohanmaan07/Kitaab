import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader } from "../Components/Loader";
import TweetCard from "../Components/TweetCard";
import { getApiUrl } from "../config/api";
import { BsBookmarkFill } from "react-icons/bs";
import LeftSidebar from "../Components/LeftSidebar";
import RightSidebar from "../Components/RightSidebar";

function Bookmarks() {
  const [bookmarkedTweets, setBookmarkedTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("id");

  const headers = {
    id: currentUserId,
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchBookmarkedTweets();
  }, [isLoggedIn]);

  const fetchBookmarkedTweets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        getApiUrl("bookmarked-tweets"),
        { headers }
      );

      setBookmarkedTweets(response.data.tweets);
    } catch (error) {
      console.error("Error fetching bookmarked tweets:", error);
      setError("Could not load bookmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (tweetId) => {
    setBookmarkedTweets(bookmarkedTweets.filter((tweet) => tweet._id !== tweetId));
  };

  const handleBookmarkRemoved = () => {
    // Refresh bookmarks after removal
    fetchBookmarkedTweets();
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Three Column Layout */}
      <div className="max-w-[1280px] mx-auto flex relative">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-[250px] fixed h-screen left-0 top-16 border-r border-zinc-800 overflow-y-auto custom-scrollbar bg-black">
          <LeftSidebar />
        </aside>

        {/* Center Content Area */}
        <main className="flex-1 min-h-screen border-x border-zinc-800 lg:ml-[250px] lg:mr-[350px]">
          <div className="max-w-[600px] mx-auto">
            {/* Header */}
            <div className="border-b border-zinc-800 p-4 bg-black sticky top-16 z-10">
              <div className="flex items-center gap-3">
                <BsBookmarkFill className="text-2xl text-[#E50914]" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
                  <p className="text-gray-400 text-sm">
                    {bookmarkedTweets.length} saved {bookmarkedTweets.length === 1 ? "poetry" : "poems"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {loading ? (
                <Loader />
              ) : error ? (
                <div className="text-center text-red-500 p-8 bg-zinc-800 rounded-lg">
                  {error}
                </div>
              ) : bookmarkedTweets.length === 0 ? (
                <div className="text-center py-20">
                  <BsBookmarkFill className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-gray-400">
                    Save poems to read them later!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarkedTweets.map((tweet) => (
                    <TweetCard
                      key={tweet._id}
                      tweet={tweet}
                      onDelete={handleDelete}
                      onBookmarkChange={handleBookmarkRemoved}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-[350px] fixed h-screen right-0 top-16 border-l border-zinc-800 overflow-y-auto custom-scrollbar bg-black">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default Bookmarks;
