import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { Pencil, Trash2, X } from "lucide-react"; // Icons for better UI

export default function BlogsAdmin() {
  const toast = useToast?.();
  const push = (opts) =>
    toast?.pushToast ? toast.pushToast(opts) : alert(opts.message);

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs");
      setBlogs(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setForm({ title: "", content: "", image: "", tags: "" });
    setEditId(null);
  };

  const handleEdit = (blog) => {
    setEditId(blog._id);
    setForm({
      title: blog.title,
      content: blog.content,
      image: blog.image || "",
      tags: blog.tags ? blog.tags.join(", ") : "", // Array to String for input
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      push({ type: "success", message: "Blog deleted successfully" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Failed to delete blog" });
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content)
      return alert("Title and Content required");
    setLoading(true);

    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()), // String to Array
    };

    try {
      if (editId) {
        // Update existing blog
        await axiosInstance.put(`/blogs/${editId}`, payload);
        push({ type: "success", message: "Blog Updated!" });
      } else {
        // Create new blog
        await axiosInstance.post("/blogs", payload);
        push({ type: "success", message: "Blog Published!" });
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">
        {editId ? "Edit Blog" : "Manage Blogs"}
      </h2>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 space-y-3 transition-colors">
        <input
          placeholder="Blog Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <textarea
          placeholder="Write your article (Markdown supported)..."
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          placeholder="Tags (comma separated e.g. React, Tech)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 text-white rounded flex items-center gap-2 ${
              editId
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? (
              "Processing..."
            ) : editId ? (
              <>Update Blog</>
            ) : (
              "Publish Blog"
            )}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="p-4 border rounded bg-gray-50 dark:bg-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                {b.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {b.content}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {b.tags &&
                  b.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(b)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 rounded transition-colors"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}
      </div>
    </div>
  );
}