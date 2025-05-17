import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoImage } from "react-icons/io5";
import { useForm } from "react-hook-form";
import postsServices from "../services/postsServices";
import authServices from "../services/authServices";
import { Post } from "../models/posts";

// Extend from Post interface for form specific fields
type CreatePostForm = Pick<Post, "text"> & {
  image?: FileList;
  tags: string; // We'll convert this to string[] before submission
};

export default function CreatePost() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostForm>();

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CreatePostForm) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let imageUrl = "";
      if (data.image && data.image[0]) {
        const imageFile = data.image[0];
        // Convert image to base64 or handle file upload
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(imageFile);
        });
      }

      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0); // Get current user and token
      const user = authServices.getCurrentUser();
      const token = authServices.getAccessToken();

      if (!user || !token) {
        setError("You must be logged in to create a post");
        navigate("/login");
        return;
      }

      // Create post data conforming to backend expectations
      const postData = {
        text: data.text,
        image: imageUrl || "", // Ensure empty string if no image
        tags: tags,
      };

      const response = await postsServices.createPost(postData);
      console.log("Post created successfully:", response);
      navigate("/"); // Redirect to home page
    } catch (err: any) {
      console.error("Error creating post:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to create post. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Text Content */}
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            What's on your mind?
          </label>
          <textarea
            id="text"
            {...register("text", {
              required: "Post content is required",
              minLength: {
                value: 10,
                message: "Post should be at least 10 characters long",
              },
            })}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your thoughts..."
          />
          {errors.text && (
            <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Add an image (optional)
          </label>
          <div className="mt-1 flex items-center">
            <div className="relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                  <IoImage className="text-gray-400 text-3xl" />
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                <span className="text-white text-sm">
                  {imagePreview ? "Change Image" : "Upload Image"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            {...register("tags")}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tech, programming, web development"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
