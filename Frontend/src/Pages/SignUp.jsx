import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCamera, AiOutlineLoading3Quarters } from "react-icons/ai";
import { getApiUrl } from "../config/api";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let avatarUrl = "";

      // Convert image to base64 if selected
      if (avatarFile) {
        avatarUrl = avatarPreview; // Already in base64 format from FileReader
      }

      // Prepare signup data
      const signupData = {
        ...formData,
        avatar: avatarUrl || `https://ui-avatars.com/api/?name=${formData.username}&background=E50914&color=fff&bold=true`,
      };

      const response = await axios.post(
        getApiUrl("signup"),
        signupData
      );

      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred during signup. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white py-8">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Sign Up</h1>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#E50914] bg-zinc-800 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <AiOutlineCamera className="text-6xl text-gray-500" />
              )}
            </div>

            {/* Upload Button Overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <AiOutlineCamera className="text-4xl text-white" />
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <p className="text-gray-400 text-sm mt-3 text-center">
            {avatarPreview ? "Click to change" : "Upload profile picture"}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            (Optional - Max 5MB)
          </p>
        </div>

        <div>
          <label htmlFor="Username" className="block text-lg text-white">Username</label>
          <input
            type="text"
            id="Username"
            name="username"
            value={formData.username}
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
          disabled={uploading}
          className="w-full bg-[#E50914] text-white py-3 rounded-md hover:bg-opacity-90 transition mt-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={handleSubmit}
        >
          {uploading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
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
