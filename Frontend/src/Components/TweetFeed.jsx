import { useEffect, useState } from "react";
import api from "../utils/axios";
import TweetCard from "./TweetCard";
import { Loader } from "./Loader";

function TweetFeed({ feedType = "all", userId }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentUserId = localStorage.getItem("id");

  const fetchTweets = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "";
      
      if (feedType === "all") {
        endpoint = `/alltweets/${currentUserId}`;
      } else if (feedType === "following") {
        endpoint = `/followingtweets/${currentUserId}`;
      }

      const response = await api.get(endpoint);
      
      // Sort tweets by createdAt in descending order (newest first)
      const sortedTweets = response.data.tweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setTweets(sortedTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Shayari load nahi ho paayi. Kripya dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [feedType]);

  const handleDelete = (tweetId) => {
    setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-zinc-800 rounded-lg">
        {error}
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center text-gray-400 p-12 bg-zinc-800 rounded-lg">
        <p className="text-2xl mb-2">😔</p>
        <p className="text-lg">
          {feedType === "following"
            ? "Abhi tak koi shayari nahi hai. Kisi ko follow karein!"
            : "Abhi tak koi shayari nahi hai. Pehle aap likhein!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet._id}
          tweet={tweet}
          currentUserId={currentUserId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default TweetFeed;
