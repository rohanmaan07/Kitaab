import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { BiBookHeart } from "react-icons/bi";
import api from "../utils/axios";

function PopularShayars() {
  const [shayars, setShayars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularShayars();
  }, []);

  const fetchPopularShayars = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch users with most followers or tweets
      const response = await api.get("/user/popular-shayars");
      setShayars(response.data.shayars || []);
    } catch (err) {
      console.error("Error fetching popular shayars:", err);
      setError("Failed to load shayars. Please try again.");
      setShayars([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  if (loading) {
    return (
      <section className="bg-black py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-800 rounded-lg mx-auto animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-800 rounded-lg mx-auto mt-4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#16181C] border border-gray-800/50 rounded-2xl p-6 animate-pulse">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-4 bg-gray-700 rounded mt-4"></div>
                <div className="h-3 bg-gray-700 rounded mt-2 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || shayars.length === 0) {
    return (
      <section className="bg-black py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Popular Shayars
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              {error || "No shayars found. Run 'npm run seed' in Backend folder to add data."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Popular Shayars
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Discover the voices that move hearts and inspire souls
          </p>
        </div>

        {/* Shayars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {shayars.map((shayar, index) => (
            <div
              key={shayar._id}
              className="group bg-[#16181C] border border-gray-800/50 rounded-2xl p-6 hover:border-[#E50914]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E50914]/10 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Profile Section */}
              <div className="text-center mb-4">
                <Link to={`/user/${shayar._id}`} className="inline-block">
                  <div className="relative mb-3">
                    {shayar.avatar ? (
                      <img
                        src={shayar.avatar}
                        alt={shayar.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-transparent group-hover:ring-[#E50914]/30 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E50914] to-[#c4070f] flex items-center justify-center mx-auto ring-4 ring-transparent group-hover:ring-[#E50914]/30 transition-all duration-300">
                        <span className="text-white font-bold text-2xl">
                          {shayar.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {shayar.isFollowing && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#E50914] rounded-full flex items-center justify-center border-2 border-[#16181C]">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-[#E50914] transition-colors">
                    {shayar.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{shayar.username}</p>
                </Link>
              </div>

              {/* Bio */}
              <p className="text-gray-400 text-sm text-center mb-4 line-clamp-2 italic">
                "{shayar.bio}"
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-gray-800/50">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">
                    {formatCount(shayar.followersCount)}
                  </p>
                  <p className="text-gray-500 text-xs">Followers</p>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">
                    {formatCount(shayar.tweetsCount)}
                  </p>
                  <p className="text-gray-500 text-xs">Shayaris</p>
                </div>
              </div>

              {/* Top Shayari Preview */}
              <div className="bg-black/40 rounded-xl p-3 mb-4 border border-gray-800/30">
                <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 text-center italic">
                  {shayar.topShayari}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/user/${shayar._id}`}
                  className="flex-1 bg-[#E50914] text-white text-sm font-bold py-2.5 px-4 rounded-full hover:bg-[#c4070f] transition-all duration-200 text-center"
                >
                  View Profile
                </Link>
                <button
                  className={`p-2.5 rounded-full transition-all duration-200 ${
                    shayar.isFollowing
                      ? "bg-white/10 text-[#E50914] hover:bg-white/15"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label={shayar.isFollowing ? "Following" : "Follow"}
                >
                  <AiOutlineUser size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PopularShayars;
