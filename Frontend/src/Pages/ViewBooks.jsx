import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Loader } from "../Components/Loader"; // Assuming you have a Loader component

function ViewBooks() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/getBookDetails/${id}`);
        setData(response.data.data);
        setIsFavorited(response.data.isFavorited);
        setIsInCart(response.data.isInCart);
      } catch (err) {
        setError("Error fetching book details");
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    fetchBooks();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleFav = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/addBookFav`, {}, { headers });
      alert(response.data.message);
      setIsFavorited(!isFavorited);
    } catch (err) {
      alert("Error adding to favorites");
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/addToCart`, {}, { headers });
      alert(response.data.message);
      setIsInCart(!isInCart);
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const deleteBook = async () => {
    const response = await axios.delete(`http://localhost:8080/api/v1/deleteBook`, { headers });
    alert(response.data.message);
    navigate("/all-books");
  };

  // Render Loader while loading is true
  if (loading) return <Loader />;

  // Render error if there is any
  if (error) return <div>{error}</div>;

  // Render book details if data is present
  if (!data) return <div>Book not found</div>;

  return (
    <div className="flex justify-center items-center h-auto bg-black text-white mx-auto">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto rounded-lg shadow-lg p-4 space-y-8 md:space-y-0 md:space-x-8 overflow-hidden">
        {/* Left Side - Book Image and Icons */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          <img
            src={data.url}
            alt={data.tittle}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
          {/* Icon Container */}
          {isLoggedIn && (
            <div className="absolute top-4 right-4 flex space-x-2">
              {role === "user" && (
                <>
                  <button
                    onClick={handleFav}
                    className={`bg-black rounded-full p-2 transition duration-300 ${isFavorited ? "bg-[#E50914]" : "hover:bg-[#E50914]"}`}
                  >
                    <AiOutlineHeart className="text-3xl text-white" />
                  </button>
                  <button
                    onClick={handleCart}
                    className={`bg-black rounded-full p-2 transition duration-300 ${isInCart ? "bg-[#E50914]" : "hover:bg-[#E50914]"}`}
                  >
                    <AiOutlineShoppingCart className="text-3xl text-white" />
                  </button>
                </>
              )}
              {role === "admin" && (
                <>
                  <Link to={`/updateBook/${id}`} className="bg-black rounded-full p-2 hover:bg-[#E50914] transition duration-300">
                    <AiOutlineEdit className="text-3xl text-white" />
                  </Link>
                  <button
                    onClick={deleteBook}
                    className="bg-black rounded-full p-2 hover:bg-[#E50914] transition duration-300"
                  >
                    <AiOutlineDelete className="text-3xl text-white" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#E50914] mb-4 leading-tight tracking-wide">
            {data.tittle}
          </h1>

          <p className="text-lg">
            <span className="text-[#E50914]">Author: </span>
            <span className="text-gray-300">{data.author}</span>
          </p>

          <p className="text-lg">
            <span className="text-[#E50914]">Price: </span>
            <span className="text-gray-300">₹ {data.price}</span>
          </p>

          <p className="text-lg">
            <span className="text-[#E50914]">Language: </span>
            <span className="text-gray-300">{data.language}</span>
          </p>

          <div className="text-lg leading-relaxed text-gray-400 border-t border-gray-700 pt-4">
            <h2 className="text-xl md:text-2xl text-[#E50914] mb-2">Description</h2>
            <p>{data.description}</p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="bg-black text-white py-2 px-4 rounded-lg border border-[#E50914] hover:bg-[#E50914] hover:text-white transition duration-300 mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewBooks;
