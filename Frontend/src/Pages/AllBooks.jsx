import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../Components/BookCard";
import { Loader } from "../Components/Loader";
import { getApiUrl } from "../config/api";

function AllBooks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(getApiUrl("getAllBook"));
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <div className="pt-20 px-4 h-auto">
        <h1 className="text-white text-2xl mb-4 ">All Books</h1>

        {loading ? (  // Use loading state to show loader
          <Loader />
        ) : (
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

export default AllBooks;
