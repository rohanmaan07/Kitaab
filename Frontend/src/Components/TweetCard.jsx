import { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

function TweetCard({ tweet, onDelete, onLike, onBookmarkChange, currentUserId }) {
  const [isLiked, setIsLiked] = useState(
    tweet.like?.includes(currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(tweet.like?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Check if tweet is bookmarked
  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    try {
      const response = await axios.get(
        getApiUrl("userInfo"),
        { headers }
      );
      setIsBookmarked(response.data.bookmarks?.includes(tweet._id) || false);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        getApiUrl(`like/${tweet._id}`),
        { id: currentUserId },
        { headers }
      );

      // Toggle like state
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

      if (onLike) onLike(tweet._id);
    } catch (error) {
      console.error("Error liking tweet:", error);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        getApiUrl(`bookmark/${tweet._id}`),
        { id: currentUserId },
        { headers }
      );

      setIsBookmarked(!isBookmarked);

      // Show toast notification
      const message = response.data.message;
      alert(message);

      if (onBookmarkChange) onBookmarkChange();
    } catch (error) {
      console.error("Error bookmarking tweet:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this poetry?")) {
      try {
        await axios.delete(
          getApiUrl(`delete/${tweet._id}`),
          { headers }
        );
        alert("Poetry deleted successfully!");
        if (onDelete) onDelete(tweet._id);
      } catch (error) {
        console.error("Error deleting tweet:", error);
        alert("Error deleting poetry");
      }
    }
  };

  // Get user details from userDetails array
  const userDetails = tweet.userDetails?.[0] || tweet.userId;
  const username = userDetails?.username || "Anonymous";
  const avatar = userDetails?.avatar || `https://ui-avatars.com/api/?name=${username}&background=E50914&color=fff&bold=true`;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4 hover:bg-zinc-750 transition-all duration-200">
      {/* User Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#E50914]"
          />
          <div>
            <Link
              to={`/user/${userDetails?._id}`}
              className="font-semibold text-white hover:text-[#E50914] transition"
            >
              @{username}
            </Link>
            <p className="text-xs text-gray-400">
              {new Date(tweet.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Delete button - only show if it's user's own tweet */}
        {(currentUserId === tweet.userId?._id || currentUserId === tweet.userId) && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition"
            title="Delete post"
          >
            <AiOutlineDelete className="text-xl" />
          </button>
        )}
      </div>

      {/* Tweet Content */}
      <div className="mb-4">
        <p className="text-white text-lg whitespace-pre-line leading-relaxed">
          {tweet.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-3 mt-3 border-t border-zinc-700">
        {/* Like Button with Animation */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E50914] transition group"
        >
          <div className="relative">
            {isLiked ? (
              <AiFillHeart className="text-2xl text-[#E50914] animate-pulse" />
            ) : (
              <AiOutlineHeart className="text-2xl group-hover:scale-110 transition-transform" />
            )}
          </div>
          <span className={`text-sm font-medium ${isLiked ? "text-[#E50914]" : ""}`}>
            {likeCount > 0 ? likeCount : ""}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="text-gray-400 hover:text-[#E50914] transition"
          title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
        >
          {isBookmarked ? (
            <BsBookmarkFill className="text-lg text-[#E50914]" />
          ) : (
            <BsBookmark className="text-lg" />
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* View Count (Optional) */}
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <AiOutlineEye className="text-lg" />
          <span>{Math.floor(Math.random() * 100) + 10}</span>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
