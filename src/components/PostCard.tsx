import { useNavigate } from "react-router-dom";
import { User } from "./models/user";
import { Post } from "./models/posts";
import {IoChatbubbleOutline, IoHeart} from "react-icons/io5"

type PostWithUser = Post & {
  user?: User;
};

interface PostCardProps {
  post: PostWithUser;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <div
      onClick={handlePostClick}
      className="  rounded-sm shadow-md overflow-hidden mb-4  cursor-pointer"
    >
      <div className="p-6">
        {/* {console.log("My post Id ", post._id)} */}
        <div className="flex items-center mb-4">
          <img
            src={post.user?.profilePicture}
            alt="User Image"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-[10.5px] font-medium text-[#171717] hover:text-[#000] font-[inter]">
              {post.user?.username}
            </p>
            <p className="text-[9px] font-normal font-[inter] text-[#525252] hover:text-[#000]">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          {post.text && (
            <p className="text-[#171717] font-bold font-[inter] text-[15px] md:text-[22.5px] mb-4 hover:text-[#2f3ab2]">
              {post.text}
            </p>
          )}
          {/* {post.image && (
            <p className="text-sm text-blue-600 hover:underline">
              Click to view image
            </p>
          )} */}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[#565656] text-sm rounded"
            >
              #{tag}
            </span>
          )) ?? []}
        </div>

        <div className="flex items-center mt-4 text-gray-500 dark:text-gray-400">
          <span className="flex items-center mr-4">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            {post.likes?.length ?? 0}
          </span>
          <span className="flex items-center">
            <button className="flex flex-col items-center space-y-1 group">
              <IoChatbubbleOutline className="w-6 h-6 text-gray-600 group-hover:text-blue-500" />{" "}
              <span className="text-sm text-gray-600">
                {post.commentCount || 0}
              </span>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
