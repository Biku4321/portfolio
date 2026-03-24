import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, BookOpen, Upload } from "lucide-react";

const EMPTY = { title: "", content: "", image: "", tags: "" };

export default function BlogsAdmin() {
  const toast = useToast?.();
  const push = o => toast?.pushToast ? toast.pushToast(o) : alert(o.message);

  const [blogs, setBlogs]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal]     = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs");
      setBlogs(res.data?.data || []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchBlogs(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); };
  const openCreate = () => { reset(); setModal(true); };
  const openEdit = b => {
    setEditId(b._id);
    setForm({ title: b.title || "", content: b.content || "", image: b.image || "", tags: b.tags?.join(", ") || "" });
    setModal(true);
  };

  const handleFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await axiosInstance.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.url ?? res.data?.secure_url;
      if (!url) throw new Error("No URL");
      setForm(p => ({ ...p, image: url }));
      push({ type: "success", message: "Image uploaded!" });
    } catch { push({ type: "error", message: "Upload failed" }); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.title || !form.content) { push({ type: "error", message: "Title and Content required" }); return; }
    setLoading(true);
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [] };
    try {
      if (editId) { await axiosInstance.put(`/blogs/${editId}`, payload); push({ type: "success", message: "Updated!" }); }
      else        { await axiosInstance.post("/blogs", payload);           push({ type: "success", message: "Published!" }); }
      setModal(false); reset(); await fetchBlogs();
    } catch { push({ type: "error", message: "Save failed" }); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this blog?")) return;
    try { await axiosInstance.delete(`/blogs/${id}`); push({ type: "success", message: "Deleted" }); await fetchBlogs(); }
    catch { push({ type: "error", message: "Delete failed" }); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><BookOpen className="w-4 h-4 text-purple-400" /><p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p></div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Blogs</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />No blog posts yet.</div>
      ) : (
        <div className="space-y-3">
          {blogs.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex items-center gap-4">
              {b.image ? (
                <img src={b.image} alt={b.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
              ) : (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,92,252,0.08)" }}>
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-gray-100 text-sm truncate">{b.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{b.content}</p>
                {b.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-1.5">{b.tags.slice(0,3).map(t => <span key={t} className="tag text-xs">{t}</span>)}</div>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(b._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-7" style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg text-gray-100">{editId ? "Edit Blog Post" : "New Blog Post"}</h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Blog post title..." className="input-field text-sm" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Content *</label><textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={7} className="input-field text-sm resize-none" placeholder="Write your blog content here..." /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="React, Node.js, Web Dev" className="input-field text-sm" /></div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Cover Image</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {form.image && <img src={form.image} alt="preview" className="w-20 h-14 rounded-xl object-cover" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />}
                      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium ${uploading ? "opacity-60" : "hover:opacity-80"}`} style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload Image</>}
                        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
                      </label>
                      <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="Or paste image URL..." className="input-field text-xs flex-1 min-w-32" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2 px-5">Cancel</button>
                    <button type="submit" disabled={loading || uploading} className="btn-primary text-sm py-2 px-5">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> {editId ? "Update" : "Publish"}</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
