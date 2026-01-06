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
          `http://localhost:8080/api/v1/getAllBookRecently`
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
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Recently Added Books
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Explore our latest collection of literary treasures
          </p>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.map((items, i) => (
              <BookCard key={i} data={items} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentlyAdd;
