import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../Components/BookCard";
import { Loader } from "../Components/Loader";

function RecentlyAdd() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `https://kitaabrohan.onrender.com/api/v1/getAllBookRecently`
        );
        setData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching recently added books:", error.message);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <div className="mt-8 px-4">
        <h1 className="text-white text-2xl mb-4 ">Recently Added</h1>

        {/* Loader */}
        {loading && <Loader />} 
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>} 

        {/* No Data Message */}
        {!loading && data.length === 0 && !error && (
          <p className="text-gray-500 text-center">No books have been recently added.</p>
        )}

        {/* Books Grid */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto">
            {data.map((items, i) => (
              <BookCard key={i} data={items} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RecentlyAdd;
