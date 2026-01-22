import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../Components/Loader";
import { getApiUrl, API_BASE_URL } from "../config/api";

function Cart() {
  const [cartBooks, setCartBooks] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleRemoveFromCart = async (bookId) => {
    try {
      const response = await axios.put(
        getApiUrl(`removeFromCart/${bookId}`),
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
    setLoading(true);
    try {
      const response = await axios.get(
        getApiUrl("getUserCart"),
        { headers }
      );
      setCartBooks(response.data.data);
      calculateTotal(response.data.data);
      console.log("Fetched cart books:", response.data.data);
    } catch (error) {
      console.error("Error fetching cart books:", error);
      toast.error("Error fetching cart: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (books) => {
    const total = books.reduce((acc, book) => acc + book.price, 0);
    setTotalAmount(total);
  };

  const handlePayment = async (amount) => {
    setLoading(true);

    try {
      // Convert amount to smallest currency unit if it’s in INR (paisa)
      const paymentAmount = typeof amount === "number" ? amount * 100 : 10000; // Default to 100 INR if amount is invalid

      const response = await axios.post(getApiUrl("order"), {
        amount: paymentAmount
      });

      // Ensure `order` is defined to avoid destructuring errors
      const order = response?.data?.data;
      if (!order) throw new Error("Order creation failed.");

      const options = {
        key: "rzp_test_DUtdKeiVCIaufb",
        amount: order.amount,
        currency: "INR",
        name: "Kitaab - Book Store",
        description: "Book Purchase Payment",
        order_id: order.id,
        callback_url: `${API_BASE_URL}/api/v1/verify`,
        prefill: {
          name: "Rohan Mandal",
          email: "rohanmandal@example.com",
          contact: "9999999999"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#121212"
        }
      };

      // Ensure Razorpay script is loaded
      if (!window.Razorpay) throw new Error("Razorpay SDK not loaded");

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);

      // Provide user-friendly error messages based on the error type
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Unable to process payment. Please try again."}`);
      } else if (error.message === "Razorpay SDK not loaded") {
        alert("Razorpay SDK failed to load. Check your internet connection and try again.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderAfterPayment = async () => {
    try {
      const response = await axios.post(
        getApiUrl("placeOrder"),
        { order: cartBooks },
        { headers }
      );

      toast.success(response.data.message);
      setCartBooks([]);
      setTotalAmount(0);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartBooks.length === 0) {
      toast.warning("Your cart is empty. Please add books to your cart before placing an order.");
      return;
    }

    // Trigger payment first
    await handlePayment(totalAmount);
  };


  useEffect(() => {
    fetchCartBooks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-white mb-2">Shopping Cart</h1>
          <div className="h-1 w-24 bg-[#E50914] rounded-full"></div>
        </div>

        {loading && <Loader />}

        {!loading && cartBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <svg
              className="w-32 h-32 text-gray-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-3xl font-semibold text-zinc-500 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-6">Add some books to get started!</p>
            <Link
              to="/all-books"
              className="bg-[#E50914] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-300"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#E50914] transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Book Image */}
                    <Link to={`/viewDetails/${book._id}`} className="flex-shrink-0">
                      <img
                        className="w-full sm:w-32 h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                        src={book.url}
                        alt={book.tittle}
                      />
                    </Link>

                    {/* Book Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <Link to={`/viewDetails/${book._id}`}>
                          <h2 className="text-xl font-semibold text-white hover:text-[#E50914] transition-colors mb-2">
                            {book.tittle}
                          </h2>
                        </Link>
                        <p className="text-gray-400 text-sm mb-2">By {book.author}</p>
                        <p className="text-gray-500 text-sm">Language: {book.language}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-2xl font-medium text-[#E50914]">₹{book.price}</p>
                        <button
                          onClick={() => handleRemoveFromCart(book._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            {cartBooks.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Items ({cartBooks.length})</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-4">
                      <div className="flex justify-between text-xl font-semibold text-white">
                        <span>Total Amount</span>
                        <span className="text-[#E50914]">₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#E50914] text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 text-lg"
                  >
                    Place Order
                  </button>

                  <div className="mt-4 text-center">
                    <Link
                      to="/all-books"
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
