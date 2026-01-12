import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Calendar, Tag } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/blogs");
        setBlogs(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <Helmet>
        <title>Blogs | My Tech Journey</title>
        <meta name="description" content="Read my latest articles on tech and development." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Latest Articles
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {blog.title}
                  </h2>
                  
                  {/* Content Preview (First 100 chars) */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No blogs found yet. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBlogs;