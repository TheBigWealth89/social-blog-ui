import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../models/posts";
import postsServices from "../services/postsServices";
import {
  IoHeart,
  IoHeartOutline,
  IoChatbubbleOutline,
  IoShareSocialOutline,
  IoBookmarkOutline,
  IoBookmark, 
} from "react-icons/io5";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const response = await postsServices.getPost(id);
        setPost(response);
        setLikesCount(response.likes?.length || 0);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    // TODO: Implement like API call
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to reading list API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.text || "Shared post",
        text: post?.text || "",
        url: window.location.href,
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show a toast notification
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.image && (
          <div className="w-full h-[500px] bg-gray-100">
            <img
              src={post.image}
              alt={post.text || "Post image"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/800x400?text=Image+Not+Available";
              }}
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center mb-6">
            <img
              src={post.user?.profilePicture}
              alt="User Image"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {post.user?.username}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-xl md:text-2xl text-gray-900 font-semibold leading-relaxed">
              {post.text}
            </p>
          </div>{" "}
          <div className="mt-6 flex flex-wrap gap-2">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Desktop Floating Sidebar */}
      <div className="hidden md:flex flex-col fixed top-1/2 transform -translate-y-1/2 left-8 space-y-6 bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={handleLike}
          className="flex flex-col items-center space-y-1 group"
        >
          {isLiked ? (
            <IoHeart className="w-6 h-6 text-red-500" />
          ) : (
            <IoHeartOutline className="w-6 h-6 text-gray-600 group-hover:text-red-500" />
          )}
          <span className="text-sm text-gray-600">{likesCount}</span>
        </button>
        <button className="flex flex-col items-center space-y-1 group">
          <IoChatbubbleOutline className="w-6 h-6 text-gray-600 group-hover:text-blue-500" />{" "}
          <span className="text-sm text-gray-600">
            {post.commentCount || 0}
          </span>
        </button>
        <button
          onClick={handleSave}
          className="flex flex-col items-center space-y-1 group"
        >
          {isSaved ? (
            <IoBookmark className="w-6 h-6 text-blue-500" />
          ) : (
            <IoBookmarkOutline className="w-6 h-6 text-gray-600 group-hover:text-blue-500" />
          )}
          <span className="text-sm text-gray-600">Save</span>
        </button>
        <button
          onClick={handleShare}
          className="flex flex-col items-center space-y-1 group"
        >
          <IoShareSocialOutline className="w-6 h-6 text-gray-600 group-hover:text-green-500" />
          <span className="text-sm text-gray-600">Share</span>
        </button>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center">
        <button
          onClick={handleLike}
          className="flex flex-col items-center space-y-1"
        >
          {isLiked ? (
            <IoHeart className="w-6 h-6 text-red-500" />
          ) : (
            <IoHeartOutline className="w-6 h-6 text-gray-600" />
          )}
          <span className="text-xs text-gray-600">{likesCount}</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <IoChatbubbleOutline className="w-6 h-6 text-gray-600" />{" "}
          <span className="text-xs text-gray-600">
            {post.commentCount || 0}
          </span>
        </button>
        <button
          onClick={handleSave}
          className="flex flex-col items-center space-y-1"
        >
          {isSaved ? (
            <IoBookmark className="w-6 h-6 text-blue-500" />
          ) : (
            <IoBookmarkOutline className="w-6 h-6 text-gray-600" />
          )}
          <span className="text-xs text-gray-600">Save</span>
        </button>
        <button
          onClick={handleShare}
          className="flex flex-col items-center space-y-1"
        >
          <IoShareSocialOutline className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600">Share</span>
        </button>
      </div>
    </div>
  );
}
