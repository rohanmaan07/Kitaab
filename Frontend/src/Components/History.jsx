import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "./Loader";
import { Link } from "react-router-dom";

function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(
        `https://kitaabrohan.onrender.com/api/v1/getOrderHistory`,
        { headers }
      );

      if (response.data.status === "success") {
        setOrders(response.data.data); 
      } else {
        setError(response.data.message || "Failed to fetch order history.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        setError("Failed to fetch order history.");
      } else {
        console.error("Error fetching order history:", error.message);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "Order Placed":
        return <span className="text-yellow-500">{status}</span>;
      case "Cancelled":
        return <span className="text-red-500">{status}</span>;
      case "Out for Delivery":
        return <span className="text-green-500">{status}</span>;
      default:
        return status;
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center w-full">
          There is no order history..
        </div>
      ) : (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl text-zinc-500 font-semibold mb-8 text-center">
            Order History
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-700 rounded-lg p-4 shadow-md transition-transform duration-300 hover:scale-105"
              >
                <h2 className="text-lg font-bold">
                  {order.book ? (
                    <Link to={`/viewDetails/${order.book._id}`} className="text-[#E50914]">
                      {order.book.tittle}
                    </Link>
                  ) : (
                    <span className="text-zinc-400">Book not found</span>
                  )}
                </h2>
                <p className="text-zinc-400">{order.book?.description || "Description not available"}</p>
                <p className="font-semibold text-lg">₹ {order.book?.price || "N/A"}</p>
                <div className="mt-2">
                  <h1 className="font-semibold text-green-500">
                    {renderStatus(order.status)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default History;
