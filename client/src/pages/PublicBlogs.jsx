import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { Calendar, Tag, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";

const BlogCard = ({ blog, index }) => {
  const readTime = blog.content ? Math.max(1, Math.ceil(blog.content.split(" ").length / 200)) : 3;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16,1,0.3,1] }}
      className="glass card-hover rounded-2xl overflow-hidden flex flex-col"
    >
      {blog.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(9,9,15,0.8))" }} />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> {readTime} min read
          </span>
        </div>
        <h2 className="font-display font-bold text-lg text-gray-100 mb-2 leading-snug line-clamp-2">{blog.title}</h2>
        <p className="text-gray-400 text-sm line-clamp-3 flex-1 leading-relaxed">{blog.content}</p>
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/5">
            {blog.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="tag text-xs inline-flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

const PublicBlogs = () => {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    axiosInstance.get("/blogs")
      .then(res => setBlogs(res.data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const allTags    = ["All", ...new Set(blogs.flatMap(b => b.tags || []))];
  const displayed  = filter === "All" ? blogs : blogs.filter(b => b.tags?.includes(filter));

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <Helmet>
        <title>Blogs | Tech Articles</title>
        <meta name="description" content="Read my latest articles on tech and development." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="section-label">My thoughts</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">
            Latest <span className="grad-text">Articles</span>
          </h1>
          <p className="text-gray-500 mt-3">Thoughts, tutorials, and insights from my dev journey.</p>
        </motion.div>

        {/* Tag filter */}
        {allTags.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12">
            {allTags.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={filter === t
                  ? { background: "var(--accent)", color: "#fff", boxShadow: "0 0 20px rgba(124,92,252,0.35)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }
                }>
                {t}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
          </div>
        ) : displayed.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {displayed.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No articles found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBlogs;
