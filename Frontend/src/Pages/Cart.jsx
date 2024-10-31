import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../Components/Loader";

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
    setLoading(true); 
    try {
      const response = await axios.get(
        `https://kitaabrohan.onrender.com/api/v1/getUserCart`,
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

// const handlePayment = async (amount) => {
//   setLoading(true);

//   try {
//     // Convert amount to smallest currency unit if it’s in INR (paisa)
//     const paymentAmount = typeof amount === "number" ? amount * 100 : 10000; // Default to 100 INR if amount is invalid

//     const response = await axios.post("https://kitaabrohan.onrender.com/api/v1/order", {
//       amount: paymentAmount
//     });

//     // Ensure `order` is defined to avoid destructuring errors
//     const order = response?.data?.data;
//     if (!order) throw new Error("Order creation failed.");

//     const options = {
//       key: "rzp_test_1XTzzNAKB6IQ6n",
//       amount: order.amount,
//       currency: "INR",
//       name: "Rohan Mandal",
//       description: "Tutorial of RazorPay",
//       order_id: order.id,
//       callback_url: "https://kitaabrohan.onrender.com/api/v1/verify",
//       prefill: {
//         name: "Rohan Mandal",
//         email: "rohanmandal@example.com",
//         contact: "9999999999"
//       },
//       notes: {
//         address: "Razorpay Corporate Office"
//       },
//       theme: {
//         color: "#121212"
//       }
//     };

//     // Ensure Razorpay script is loaded
//     if (!window.Razorpay) throw new Error("Razorpay SDK not loaded");

//     const razor = new window.Razorpay(options);
//     razor.open();
//   } catch (error) {
//     console.error("Payment initiation failed:", error);

//     // Provide user-friendly error messages based on the error type
//     if (error.response) {
//       alert(`Error: ${error.response.data.message || "Unable to process payment. Please try again."}`);
//     } else if (error.message === "Razorpay SDK not loaded") {
//       alert("Razorpay SDK failed to load. Check your internet connection and try again.");
//     } else {
//       alert("Something went wrong. Please try again.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

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
  const handlePaymentVerify = (data) => {
    const options = {
      key: "rzp_test_1XTzzNAKB6IQ6n",
      amount: data.amount,
      currency: data.currency,
      name: "Devknus",
      description: "Book Purchase",
      order_id: data.id,
      handler: async (response) => {
        try {
          const res = await fetch(
            `https://kitaabrohan.onrender.com/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            }
          );

          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);
            setCartBooks([]); 
            setTotalAmount(0);
            navigate("/profile/orderHistory");
          }
        } catch (error) {
          console.log("Error during payment verification:", error);
        }
      },
      theme: {
        color: "#5f63b8"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    fetchCartBooks();
  }, []);

  return (
    <div className="container mx-auto p-5 h-auto">
      {loading && <Loader />} 
      {!loading && cartBooks.length === 0 ? (
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
                  alt={book.tittle}
                />
                <div className="p-4 text-white">
                  <h2 className="text-lg font-semibold truncate hover:text-red-600">
                    {book.tittle}
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
