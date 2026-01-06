import { useState } from "react";
import axios from "axios";
import { AiOutlineClose, AiOutlineCamera, AiOutlineLoading3Quarters } from "react-icons/ai";

function EditProfileModal({ user, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }

            setAvatarFile(file);
            setError("");

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let avatarUrl = formData.avatar;

            // If new avatar selected, use base64
            if (avatarFile) {
                avatarUrl = avatarPreview;
            }

            const updateData = {
                ...formData,
                avatar: avatarUrl,
            };

            const response = await axios.put(
                `http://localhost:8080/api/v1/updateProfile`,
                updateData,
                { headers }
            );

            alert("Profile updated successfully!");
            onUpdate(response.data.user);
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <AiOutlineClose className="text-2xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#E50914] bg-zinc-800 flex items-center justify-center">
                                <img
                                    src={avatarPreview || `https://ui-avatars.com/api/?name=${formData.username}&background=E50914&color=fff&bold=true`}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

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
                            Click to change profile picture
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E50914] transition"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E50914] transition"
                            placeholder="@username"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E50914] transition"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#E50914] text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
