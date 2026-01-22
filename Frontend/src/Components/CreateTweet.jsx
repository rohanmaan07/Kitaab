import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { AiOutlineClose, AiOutlineFileImage, AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsImageFill } from "react-icons/bs";
import { getApiUrl } from "../config/api";

function CreateTweet({ onTweetCreated, onClose }) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get user info from Redux
  const user = useSelector((state) => state.auth.user);
  const userAvatar = user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.username || "User") + "&background=E50914&color=fff";

  const MAX_IMAGES = 4;

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [description]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed!`);
      return;
    }

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setImagePreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });

    setImages(newImages);
    setError("");
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Please write something!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        getApiUrl("create"),
        {
          description: description,
          id: localStorage.getItem("id"),
        },
        { headers }
      );

      // Show success message
      setDescription("");
      setImages([]);
      setImagePreviews([]);

      if (onTweetCreated) onTweetCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating tweet:", error);
      setError(error.response?.data?.message || "Error posting shayari");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img
            src={userAvatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#E50914]"
          />
          <span className="text-white font-semibold">Share your poetry</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 hover:bg-zinc-800 rounded-full"
          >
            <AiOutlineClose className="text-xl" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Auto-resize Textarea */}
        <textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's happening?

Share your poetry with the world!"
          className="w-full bg-transparent text-white text-lg p-2 min-h-[120px] max-h-[400px] focus:outline-none resize-none overflow-y-auto custom-scrollbar"
          style={{ height: "auto" }}
        />

        {/* Image Previews Grid */}
        {imagePreviews.length > 0 && (
          <div className={`grid gap-2 mt-3 ${imagePreviews.length === 1 ? "grid-cols-1" :
            imagePreviews.length === 2 ? "grid-cols-2" :
              imagePreviews.length === 3 ? "grid-cols-3" :
                "grid-cols-2"
            }`}>
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-1.5 rounded-full hover:bg-opacity-90 transition opacity-0 group-hover:opacity-100"
                >
                  <AiOutlineClose className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
          {/* Left: Image Upload */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={images.length >= MAX_IMAGES}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
              className={`p-2 rounded-full transition ${images.length >= MAX_IMAGES
                ? "text-gray-600 cursor-not-allowed"
                : "text-[#E50914] hover:bg-[#E50914] hover:bg-opacity-10"
                }`}
              title={`Add images (${images.length}/${MAX_IMAGES})`}
            >
              <BsImageFill className="text-xl" />
            </button>

            {images.length > 0 && (
              <span className="text-xs text-gray-400">
                {images.length}/{MAX_IMAGES} images
              </span>
            )}
          </div>

          {/* Right: Post Button */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="bg-[#E50914] text-white px-5 py-2 rounded-full font-bold hover:bg-opacity-90 transition disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Posting...
                </span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTweet;
