import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import CreateTweet from "../Components/CreateTweet";
import TweetFeed from "../Components/TweetFeed";
import LeftSidebar from "../Components/LeftSidebar";
import RightSidebar from "../Components/RightSidebar";

function ShayariTimeline() {
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateTweet, setShowCreateTweet] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=E50914&color=fff`;

  useEffect(() => {
    if (searchParams.get("compose") === "true") {
      setShowCreateTweet(true);

      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🔒 Login Required</h1>
          <p className="text-gray-400 mb-6">
            Please login to read and share poetry!
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#E50914] px-6 py-3 rounded text-white hover:bg-opacity-90 transition"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const handleTweetCreated = () => {
    setShowCreateTweet(false);
    setSearchParams({});
    setActiveTab(activeTab === "all" ? "following" : "all");
    setTimeout(() => setActiveTab("all"), 100);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1280px] mx-auto flex relative">
        <aside className="hidden lg:block w-[250px] fixed h-screen left-0 top-16 border-r border-zinc-800 overflow-y-auto custom-scrollbar bg-black">
          <LeftSidebar />
        </aside>

        <main className="flex-1 min-h-screen border-x border-zinc-800 lg:ml-[250px] lg:mr-[350px] mt-16">
          <div className="max-w-[600px] mx-auto">
            <div className="border-b border-zinc-800 p-4 bg-black sticky top-16 z-20">
              <h1 className="text-2xl font-bold text-white">Poetry Timeline</h1>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                Express your heart through words{" "}
                <AiOutlineHeart className="text-[#E50914]" />
              </p>
            </div>

            <div className="border-b border-zinc-800 p-4 bg-black">
              {showCreateTweet ? (
                <CreateTweet
                  onTweetCreated={handleTweetCreated}
                  onClose={() => {
                    setShowCreateTweet(false);
                    setSearchParams({});
                  }}
                />
              ) : (
                <button
                  onClick={() => setShowCreateTweet(true)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-lg transition text-left"
                >
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E50914]"
                  />
                  <span className="text-gray-400 text-lg">
                    What's happening?
                  </span>
                </button>
              )}
            </div>

            <div className="flex border-b border-zinc-800 bg-black sticky top-16 z-10">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 px-6 py-4 font-semibold transition relative ${
                  activeTab === "all"
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                For You
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`flex-1 px-6 py-4 font-semibold transition relative ${
                  activeTab === "following"
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                Following
                {activeTab === "following" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]"></div>
                )}
              </button>
            </div>

            <div className="pb-20 lg:pb-0">
              <TweetFeed feedType={activeTab} />
            </div>
          </div>
        </main>

        <aside className="hidden xl:block w-[350px] fixed h-screen right-0 top-16 overflow-y-auto custom-scrollbar bg-black">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default ShayariTimeline;
