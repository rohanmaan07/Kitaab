import { useEffect, useState } from "react";
import axios from "axios";
import  BookCard  from "./BookCard";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";

function Favourite() {
  const [fav, setFav] = useState([]);
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/getFavouriteBooks`, { headers });
        setFav(response.data.data);
      } catch (error) {
        console.error("Failed to fetch favourite books:", error);
      }
    };

    fetch();
  }, [fav]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white mb-2">My Favourites</h1>
        <div className="h-1 w-20 bg-[#E50914] rounded-full"></div>
      </div>
      
      {fav && fav.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-zinc-800 rounded-full p-6 mb-6">
            <AiOutlineHeart className="w-16 h-16 text-[#E50914]" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">No Favourites Yet</h2>
          <p className="text-gray-400 text-center mb-6">Start adding books you love to see them here!</p>
          <Link
            to="/all-books"
            className="bg-[#E50914] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {fav && fav.map((item, i) => (
            <BookCard key={i} data={item} fav={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourite;
