import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "./Loader";
import { FaUser, FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApiUrl } from "../config/api";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          getApiUrl("get-all-orders"),
          { headers }
        );
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        getApiUrl(`update-status/${orderId}`),
        { status: newStatus },
        { headers }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating order status:", error.message);
      setError("Failed to update order status. Please try again later.");
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
                  <Link
                    to={`/viewDetails/${order.book?._id}`}
                    className="text-[#E50914]"
                  >
                    {order.book?.tittle || "Untitled Book"}
                  </Link>
                </h2>
                <p className="text-zinc-400">
                  {order.book?.description || "No description available"}
                </p>
                <p className="font-semibold text-lg">
                  ₹ {order.book?.price || "Price not available"}
                </p>

                <div className="mt-2">
                  <h1 className="font-semibold text-green-500">
                    <span
                      className={
                        order.status === "Cancelled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }
                    >
                      {order.status}
                    </span>
                  </h1>

                  {/* Dropdown for status update */}
                  <select
                    className="mt-5 bg-zinc-600 text-white rounded-md p-2 mr-12"
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    value={order.status} // Controlled component
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Update button */}
                  <button
                    className="bg-zinc-800 text-white px-4 py-2 rounded border border-[#E50914] hover:bg-[#E50914] hover:text-white transition duration-300"
                    onClick={() => updateOrderStatus(order._id, order.status)} // Call update function on button click
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default AllOrders;
