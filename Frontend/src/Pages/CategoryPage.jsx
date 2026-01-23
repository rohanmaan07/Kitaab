import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../Components/Loader";
import BookCard from "../Components/BookCard";
import { getApiUrl } from "../config/api";

function CategoryPage() {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (!cat) return "";
    return cat
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      setLoading(true);
      try {
        const formattedCategory = formatCategoryName(category);
        const response = await axios.get(
          getApiUrl(`getBooksByCategory/${encodeURIComponent(formattedCategory)}`)
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching category books:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryBooks();
    }
  }, [category]);

  return (
    <div className="pt-20 px-4 min-h-screen pb-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            {formatCategoryName(category)}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Explore the finest collection of {formatCategoryName(category).toLowerCase()}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((items, i) => (
              <BookCard key={i} data={items} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <svg
              className="w-24 h-24 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-gray-400 text-lg">
              No books found in this category
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for new additions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
