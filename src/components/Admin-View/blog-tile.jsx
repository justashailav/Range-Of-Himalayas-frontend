import React from "react";
import { Button } from "../ui/button";
import { Calendar, Tag, User } from "lucide-react";

export default function BlogTile({ blog, handleEdit, handleDelete }) {
  if (!blog) return null;

  const handleEditClick = () => {
    handleEdit(blog);
  };

  const formattedDateTime = new Date(blog.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const tagList = Array.isArray(blog?.tags)
    ? blog.tags
    : typeof blog?.tags === "string"
    ? blog.tags.split(",")
    : [];

  // ✅ Fallback image URL
  const imageSrc =
    blog.coverImage && blog.coverImage.trim() !== ""
      ? blog.coverImage
      : "/default-blog-cover.jpg"; // place this in your /public folder

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden max-w-sm mx-auto">
      {/* Cover Image */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={blog.title || "Blog Cover"}
          onError={(e) => (e.target.src = "/default-blog-cover.jpg")}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
      </div>

      {/* Blog Info */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-700 transition-colors duration-300">
          {blog.title}
        </h2>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3">
          {blog.metaDescription || (blog.content?.slice(0, 120) ?? "") + "..."}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User size={14} className="text-gray-400" />
            <span>{blog.author || "Admin"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-gray-400" />
            <span>{formattedDateTime}</span>
          </div>
        </div>

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tagList.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                <Tag size={12} />
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-2">
          <Button
            onClick={handleEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Edit
          </Button>

          <Button
            onClick={() => handleDelete(blog?._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
