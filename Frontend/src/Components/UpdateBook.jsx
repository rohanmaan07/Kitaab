import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBook() {
  const { id } = useParams(); // Get the book ID from the URL parameters
  const [formData, setFormData] = useState({
    url: "",
    tittle: "",
    author: "",
    price: "",
    description: "",
    language: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData,[name]: value,});
    console.log("Updated Form Data:", { ...formData, [name]: value }); // Log formData on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/updateBook`,
        formData,
        { headers }
      );
      alert(response.data.message);
      navigate("/all-books");
    } catch (error) {
      console.error("Update Book Error:", error); // Log the error for debugging
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while updating the book. Please try again.");
      }
    }
  };
  
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/getBookDetails/${id}`, { headers });
        setFormData(response.data.data); 
        console.log("Fetched Data:", response.data.data); 
      } catch (error) {
        setError("Error fetching book details.");
      }
    };
    fetchBookDetails();
  }, []);

  return (
    <div className="flex justify-center items-center bg-black text-white">
      <div className="w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-2 text-white">
          Edit Book
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="url" className="block text-lg text-white">
              Book URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>
          <div>
            <label htmlFor="tittle" className="block text-lg text-white mt-3">
              Title
            </label>
            <input
              type="text"
              id="tittle" 
              name="tittle" 
              value={formData.tittle} 
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-lg text-white mt-3">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg text-white mt-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>
          
          <div className="mt-1 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="price" className="block text-lg text-white mt-3">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="language" className="block text-lg text-white mt-3">
                Language
              </label>
              <input
                type="text"
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#E50914] text-white py-3 rounded-md hover:bg-opacity-90 transition mt-5"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateBook;
