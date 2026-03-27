import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Trophy, Upload, Award } from "lucide-react";

const EMPTY = {
  title: "", organizer: "", rank: "", description: "",
  techStack: "", achievements: "", github: "", liveDemo: "",
  image: "", year: "", featured: false, certificateUrl: "",
};

const InputField = ({ label, name, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="input-field text-sm" />
  </div>
);

export default function HackathonsAdmin() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState({ cert: false, img: false });
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);

  const fetch = () => {
    setLoading(true);
    axiosInstance.get("/hackathons")
      .then(r => setItems(r.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = h  => {
    setEditing(h._id);
    setForm({
      ...h,
      techStack:      (h.techStack    || []).join(", "),
      achievements:   (h.achievements || []).join("\n"),
      certificateUrl: h.certificateUrl || "",
    });
    setModal(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  /* Upload helper — field: "certificateUrl" | "image" */
  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(p => ({ ...p, [field === "certificateUrl" ? "cert" : "img"]: true }));
    try {
      const res = await axiosInstance.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url ?? res.data?.secure_url;
      if (!url) throw new Error("No URL returned");
      setForm(p => ({ ...p, [field]: url }));
    } catch (err) {
      console.error("upload error:", err);
      alert("Upload failed. Check Cloudinary config.");
    } finally {
      setUploading(p => ({ ...p, [field === "certificateUrl" ? "cert" : "img"]: false }));
      e.target.value = "";
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.title) { alert("Title is required"); return; }
    setSaving(true);
    const payload = {
      ...form,
      techStack:    form.techStack.split(",").map(s => s.trim()).filter(Boolean),
      achievements: form.achievements.split("\n").map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing) await axiosInstance.put(`/hackathons/${editing}`, payload);
      else         await axiosInstance.post("/hackathons", payload);
      setModal(false);
      fetch();
    } catch (err) { console.error(err); alert("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this hackathon?")) return;
    await axiosInstance.delete(`/hackathons/${id}`);
    fetch();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Hackathons</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Add Hackathon
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
          No hackathons yet. Add your first one!
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((h, i) => (
            <motion.div key={h._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-gray-100">{h.title}</h3>
                  {h.rank && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(124,92,252,0.15)", color: "#c084fc", border: "1px solid rgba(124,92,252,0.25)" }}>
                      {h.rank}
                    </span>
                  )}
                  {h.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(6,214,160,0.1)", color: "#06d6a0" }}>featured</span>
                  )}
                  {/* ✅ Certificate badge */}
                  {h.certificateUrl && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(251,191,36,0.1)", color: "#f59e0b", border: "1px solid rgba(251,191,36,0.2)" }}>
                      <Award className="w-2.5 h-2.5" /> Certificate
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {h.organizer} {h.year && `· ${h.year}`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(h)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(h._id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setModal(false)} />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">

              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-7"
                style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>

                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg text-gray-100">
                    {editing ? "Edit Hackathon" : "Add Hackathon"}
                  </h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {/* Basic */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Title *" name="title" value={form.title} onChange={handleChange} placeholder="e.g. PharmaBot" />
                    <InputField label="Organizer" name="organizer" value={form.organizer} onChange={handleChange} placeholder="e.g. IIT Bombay" />
                    <InputField label="Rank / Award" name="rank" value={form.rank} onChange={handleChange} placeholder="e.g. Top 25 Nationally" />
                    <InputField label="Year" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2024" />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                      className="input-field text-sm resize-none" placeholder="Describe the hackathon..." />
                  </div>

                  <InputField label="Tech Stack (comma separated)" name="techStack" value={form.techStack}
                    onChange={handleChange} placeholder="React, Python, OpenCV, MongoDB" />

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">
                      Achievements (one per line)
                    </label>
                    <textarea name="achievements" value={form.achievements} onChange={handleChange} rows={4}
                      className="input-field text-sm resize-none"
                      placeholder={"Ranked in Top 25 nationally\nImplemented OpenCV for road recognition"} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="GitHub URL" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
                    <InputField label="Live Demo URL" name="liveDemo" value={form.liveDemo} onChange={handleChange} placeholder="https://..." />
                  </div>

                  <InputField label="Project Image URL" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />

                  {/* ✅ Certificate Upload Section */}
                  <div className="p-4 rounded-xl space-y-3"
                    style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Certificate</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Preview if already uploaded */}
                      {form.certificateUrl && (
                        <div className="relative">
                          {form.certificateUrl.toLowerCase().includes(".pdf") ? (
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center"
                              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
                              <Award className="w-7 h-7 text-amber-400" />
                            </div>
                          ) : (
                            <img src={form.certificateUrl} alt="Certificate preview"
                              className="w-16 h-16 rounded-lg object-cover"
                              style={{ border: "1px solid rgba(251,191,36,0.3)" }} />
                          )}
                          <button type="button"
                            onClick={() => setForm(p => ({ ...p, certificateUrl: "" }))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white bg-red-500 hover:bg-red-400 text-xs">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        {/* Upload button */}
                        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all ${uploading.cert ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                          style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#f59e0b" }}>
                          {uploading.cert
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                            : <><Upload className="w-4 h-4" /> Upload Certificate</>
                          }
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={e => handleUpload(e, "certificateUrl")}
                            disabled={uploading.cert}
                            className="hidden"
                          />
                        </label>

                        {/* Or paste URL */}
                        <input
                          type="url"
                          value={form.certificateUrl}
                          onChange={e => setForm(p => ({ ...p, certificateUrl: e.target.value }))}
                          placeholder="Or paste certificate URL (image or PDF)..."
                          className="input-field text-xs"
                        />
                        <p className="text-xs text-gray-600">Accepts JPG, PNG, PDF · Max 5MB</p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                      className="w-4 h-4 rounded accent-purple-500" />
                    <span className="text-sm text-gray-300">Featured hackathon</span>
                  </label>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2 px-5">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving || uploading.cert} className="btn-primary text-sm py-2 px-5">
                      {saving
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                        : <><Save className="w-4 h-4" /> {editing ? "Update" : "Add"}</>
                      }
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
