import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader"; // Importing the Loader component

function AddBook() {
  const [formData, setFormData] = useState({
    url: null,
    tittle: "", // Change 'tittle' to 'title'
    author: "",
    price: "",
    description: "",
    language: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        `https://kitaabrohan-hnhk.onrender.com/api/v1/addBook`,
        formDataToSend,
        { headers }
      );
      alert(response.data.message);
      navigate("/all-books");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while adding the book. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading back to false
    }
  };

  return (
    <div className="flex justify-center items-center bg-black text-white">
      <div className="w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-2 text-white">Add Book</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {loading ? (
          <Loader /> // Show loader while loading is true
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label htmlFor="url" className="block text-lg text-white">
                Book Cover Image
              </label>
              <input
                type="file"
                id="url"
                name="url"
                accept="image/*"
                onChange={handleChangeImage}
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
              Add Book
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddBook;
