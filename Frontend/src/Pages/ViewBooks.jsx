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
        setLoading(false);
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
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Book Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-zinc-900 p-8">
              <div className="flex items-center justify-center h-[450px]">
                <img
                  src={data.url}
                  alt={data.tittle}
                  className="max-h-[450px] max-w-full w-auto h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Action Buttons Overlay */}
              {isLoggedIn && (
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  {role === "user" && (
                    <>
                      <button
                        onClick={handleFav}
                        className={`${isFavorited ? "bg-[#E50914]" : "bg-black/80 hover:bg-[#E50914]"} backdrop-blur-sm rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg`}
                        title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <AiOutlineHeart className="text-2xl text-white" />
                      </button>
                      <button
                        onClick={handleCart}
                        className={`${isInCart ? "bg-[#E50914]" : "bg-black/80 hover:bg-[#E50914]"} backdrop-blur-sm rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg`}
                        title={isInCart ? "In Cart" : "Add to Cart"}
                      >
                        <AiOutlineShoppingCart className="text-2xl text-white" />
                      </button>
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <Link
                        to={`/updateBook/${id}`}
                        className="bg-blue-600 hover:bg-blue-700 backdrop-blur-sm rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        title="Edit Book"
                      >
                        <AiOutlineEdit className="text-2xl text-white" />
                      </Link>
                      <button
                        onClick={deleteBook}
                        className="bg-red-600 hover:bg-red-700 backdrop-blur-sm rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        title="Delete Book"
                      >
                        <AiOutlineDelete className="text-2xl text-white" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Book Details */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                {data.tittle}
              </h1>
              <div className="h-1 w-20 bg-[#E50914] rounded-full"></div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Author Card */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-[#E50914] transition-all duration-300">
                <p className="text-sm text-gray-500 mb-1">Author</p>
                <p className="text-lg text-white">{data.author}</p>
              </div>

              {/* Price Card */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-[#E50914] transition-all duration-300">
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-xl font-medium text-[#E50914]">₹ {data.price}</p>
              </div>

              {/* Language Card */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-[#E50914] transition-all duration-300">
                <p className="text-sm text-gray-500 mb-1">Language</p>
                <p className="text-lg text-white">{data.language}</p>
              </div>

              {/* Category Card */}
              {data.category && (
                <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-[#E50914] transition-all duration-300">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-lg text-white">{data.category}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mt-6">
              <h2 className="text-xl text-[#E50914] mb-3">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-zinc-900 text-white py-3 px-6 rounded-lg font-medium border border-zinc-800 hover:border-[#E50914] hover:bg-zinc-800 transition-all duration-300"
              >
                Go Back
              </button>
              
              {isLoggedIn && role === "user" && (
                <button
                  onClick={handleCart}
                  className="flex-1 bg-[#E50914] text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
                >
                  {isInCart ? "In Cart" : "Add to Cart"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBooks;
