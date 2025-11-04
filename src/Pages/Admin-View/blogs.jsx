import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "@/store/slices/blogSlice";
import BlogTile from "@/components/Admin-View/blog-tile";

export default function Blogs() {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    category: "",
    coverImage: null,
  });

  const dispatch = useDispatch();
  const { blogs, error, message } = useSelector((state) => state.blogs);

  // Fetch all blogs on load
  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  // Handle success/error
  useEffect(() => {
    if (message) {
      toast.success(message);
      resetForm();
      setOpenDialog(false);
      dispatch(getAllBlogs());
    }
    if (error) toast.error(error);
  }, [message, error, dispatch]);

  // Reset form
  const resetForm = () =>
    setBlog({
      title: "",
      author: "",
      category: "",
      tags: "",
      metaTitle: "",
      metaDescription: "",
      content: "",
      coverImage: null,
    });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setBlog((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  // Submit create/update
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(blog).forEach((key) => {
      if (key === "coverImage" && blog.coverImage) {
        formData.append("coverImage", blog.coverImage);
      } else {
        formData.append(key, blog[key]);
      }
    });

    if (currentEditedId) {
      dispatch(updateBlog(currentEditedId, formData));
    } else {
      dispatch(createBlog(formData));
    }
  };

  // Edit existing blog
  const handleEdit = (b) => {
    setCurrentEditedId(b._id);
    setOpenDialog(true);
    setBlog({
      title: b.title || "",
      author: b.author || "",
      category: b.category || "",
      tags: Array.isArray(b.tags) ? b.tags.join(", ") : b.tags || "",
      metaTitle: b.metaTitle || "",
      metaDescription: b.metaDescription || "",
      content: b.content || "",
      coverImage: null,
    });
  };

  // Delete blog
  const handleDelete = async (id) => {
    await dispatch(deleteBlog(id));
    dispatch(getAllBlogs());
  };

  return (
    <Fragment>
      {/* Add Button */}
      <div className="mb-6 w-full flex justify-start">
        <Button
          onClick={() => {
            resetForm();
            setCurrentEditedId(null);
            setOpenDialog(true);
          }}
          className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Blog
        </Button>
      </div>

      {/* Blog List */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs?.length > 0 ? (
          blogs.map((item) => (
            <BlogTile
              key={item._id}
              blog={item}
              handleDelete={() => handleDelete(item._id)}
              handleEdit={() => handleEdit(item)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No blogs available.
          </p>
        )}
      </div>

      {/* Blog Dialog Form */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#FFECE8] max-w-3xl w-[95%] mx-auto rounded-lg p-6 sm:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              {currentEditedId ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                autoComplete="off"
              >
                {/* Title */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={blog.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter blog title"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={blog.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Author name"
                  />
                </div>

                {/* Category + Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={blog.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. Agriculture, Lifestyle"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={blog.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Comma separated tags"
                    />
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={blog.metaTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="SEO title"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={blog.metaDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Short SEO description"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={blog.content}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Write your blog content..."
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-700
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#F08C7D] file:text-white
                      hover:file:bg-[#d9746a]"
                  />
                  {blog.coverImage && (
                    <div className="mt-3 relative w-32 h-32 border rounded-md overflow-hidden">
                      <img
                        src={URL.createObjectURL(blog.coverImage)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setBlog((prev) => ({ ...prev, coverImage: null }))
                        }
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#F08C7D] hover:bg-[#d9746a] text-white"
                  >
                    {currentEditedId ? "Update Blog" : "Save Blog"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
