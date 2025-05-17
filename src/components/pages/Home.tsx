import { useEffect, useState } from "react";
import PostCard from "../PostCard";
import { Post } from "../models/posts";
import postsServices from "../services/postsServices";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsServices.getAllPosts();
        // console.log("Full response object:", JSON.stringify(response, null, 2));
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API");
        }

        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
