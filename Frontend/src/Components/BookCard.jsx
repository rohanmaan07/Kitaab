import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

function BookCard({ data, fav }) {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleremove = async () => {
    try {
      const response = await axios.put(
        getApiUrl("removeBookFav"),
        { bookId: data._id },
        { headers }
      );
      if (response.status === 200) {
        alert('Book removed from favorites successfully');
      }
    } catch (error) {
      console.error("Failed to remove book from favorites:", error);
    }
  };

  return (
    <div className="w-full bg-black border border-white rounded-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-transform duration-300 overflow-hidden mb-5 ">
      <Link to={`/viewDetails/${data._id}`}>
        <img
          className="w-full h-80 object-fill rounded-t-lg"
          src={data.url}
          alt={data.tittle}
        />
        <div className="p-4 text-white">
          <h1 className="text-lg font-semibold truncate hover:text-red-600">
            {data.tittle}
          </h1>
          <p className="text-sm text-gray-400 mt-1 leading-snug">
            {data.author}
          </p>
          <p className="text-lg font-bold text-[#E50914] mt-2 leading-snug">
            ₹{data.price}
          </p>
          <p className="text-sm text-gray-500 mt-1 leading-snug">
            Language: <span className="text-gray-300">{data.language}</span>
          </p>
        </div>
      </Link>

      {fav && (

        <button
          onClick={handleremove}
          className="bg-[#E50914] w-full text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300 mt-4"
        >
          Remove
        </button>
      )}
    </div>
  );
}

export default BookCard;
