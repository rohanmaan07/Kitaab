import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cartBooks, setCartBooks] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleRemoveFromCart = async (bookId) => {
    try {
      const response = await axios.put(
        `https://kitaabrohan.onrender.com/api/v1/removeFromCart/${bookId}`,
        {},
        { headers }
      );
      alert(response.data.message);
      fetchCartBooks(); 
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const fetchCartBooks = async () => {
    try {
      const response = await axios.get(
        `https://kitaabrohan.onrender.com/api/v1/getUserCart`,
        { headers }
      );
      setCartBooks(response.data.data);
      calculateTotal(response.data.data); // Calculate total on fetch
      console.log("Fetched cart books:", response.data.data); // Debugging log
    } catch (error) {
      console.error("Error fetching cart books:", error);
    }
  };

  const calculateTotal = (books) => {
    const total = books.reduce((acc, book) => acc + book.price, 0);
    setTotalAmount(total);
  };

  const handlePlaceOrder = async () => {
    if (cartBooks.length === 0) {
      alert(
        "Your cart is empty. Please add books to your cart before placing an order."
      );
      return;
    }

    try {
      const response = await axios.post(
        `https://kitaabrohan.onrender.com/api/v1/placeOrder`,
        { order: cartBooks },
        { headers }
      );

      alert(response.data.message);

      // Clear cart in state
      setCartBooks([]);
      setTotalAmount(0);

      navigate("/profile/orderHistory");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCartBooks();
  }, []);

  return (
    <div className="container mx-auto p-5 h-auto">
     
      {cartBooks.length === 0 ? (
        <div className="text-5xl font-semibold h-screen text-zinc-500 flex items-center justify-center w-full">
          Empty Cart..
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartBooks.map((book) => (
            <div
              key={book._id}
              className="w-full bg-black border border-white rounded-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-transform duration-300 overflow-hidden mb-10"
            >
              <Link to={`/viewDetails/${book._id}`}>
                <img
                  className="w-full h-[40vh] object-fill rounded-t-lg"
                  src={book.url}
                  alt={book.title}
                />
                <div className="p-4 text-white">
                  <h2 className="text-lg font-semibold truncate hover:text-red-600">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 leading-snug">
                    By {book.author}
                  </p>
                  <p className="text-lg font-bold text-[#E50914] mt-2 leading-snug">
                    ₹{book.price}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 leading-snug">
                    Language:{" "}
                    <span className="text-gray-300">{book.language}</span>
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleRemoveFromCart(book._id)}
                className="bg-[#E50914] w-full text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300 mt-4"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}
      {cartBooks.length > 0 && (
        <div className="mt-2 text-white flex flex-col items-center justify-center m-auto border border-white bg-gray-800 p-4 rounded w-full lg:w-[20%]">
          <h2 className="text-lg font-semibold text-center">
            Total Amount: ₹{totalAmount}
          </h2>
          <button
            onClick={handlePlaceOrder}
            className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300 mt-4 w-full"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
