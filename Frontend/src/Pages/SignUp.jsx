import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
      const response = await axios.post(`https://kitaabrohan-hnhk.onrender.com/api/v1/signup`, formData);
      navigate("/login"); 
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Sign Up</h1>
          <div>
            <label htmlFor="Username" className="block text-lg text-white">Userame</label>
            <input
              type="text"
              id="Username"
              name="username"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg text-white mt-3">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg text-white mt-3">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E50914] text-white py-3 rounded-md hover:bg-opacity-90 transition mt-5"
            onClick={handleSubmit}
         >
            Sign Up
          </button>
    

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
