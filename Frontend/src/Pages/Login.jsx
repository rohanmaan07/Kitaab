import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authActions } from "../Store/auth";
import { useDispatch } from "react-redux";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const response = await axios.post(
        "http://localhost:8080/api/v1/signin",
        formData
      );
      console.log(response.data);

      // Save data to localStorage
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Dispatch auth actions
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));

      // Navigate to home page
      navigate("/");
    } catch (error) {
      // Display error message if the request fails
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Log In
        </h1>

        {/* Display error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* Form for login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-lg text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-lg text-white">
              Password
            </label>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#E50914] text-white py-3 rounded-md hover:bg-opacity-90 transition"
          >
            Log In
          </button>
        </form>

        {/* Link to Sign Up */}
        <p className="text-center mt-6 text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-white hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
