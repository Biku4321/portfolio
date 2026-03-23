import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Trophy } from "lucide-react";

const EMPTY = {
  title: "", organizer: "", rank: "", description: "",
  techStack: "", achievements: "", github: "", liveDemo: "",
  image: "", year: "", featured: false,
};

const InputField = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="input-field text-sm" />
  </div>
);

const HackathonsAdmin = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(null); // null = create
  const [form, setForm]       = useState(EMPTY);

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
      techStack:    (h.techStack    || []).join(", "),
      achievements: (h.achievements || []).join("\n"),
    });
    setModal(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      techStack:    form.techStack.split(",").map(s => s.trim()).filter(Boolean),
      achievements: form.achievements.split("\n").map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing) await axiosInstance.put(`/hackathons/${editing}`, payload);
      else         await axiosInstance.post("/hackathons", payload);
      setModal(false); fetch();
    } catch (err) { console.error(err); }
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
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{h.organizer} {h.year && `· ${h.year}`}</p>
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

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Title *" name="title" value={form.title} onChange={handleChange} placeholder="e.g. PharmaBot" />
                    <InputField label="Organizer" name="organizer" value={form.organizer} onChange={handleChange} placeholder="e.g. IIT Bombay" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Rank / Award" name="rank" value={form.rank} onChange={handleChange} placeholder="e.g. Top 25 Nationally" />
                    <InputField label="Year" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2024" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                      className="input-field text-sm resize-none" placeholder="Describe the hackathon..." />
                  </div>
                  <InputField label="Tech Stack (comma separated)" name="techStack" value={form.techStack} onChange={handleChange}
                    placeholder="React, Python, OpenCV, MongoDB" />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">
                      Achievements (one per line)
                    </label>
                    <textarea name="achievements" value={form.achievements} onChange={handleChange} rows={4}
                      className="input-field text-sm resize-none"
                      placeholder={"Ranked in Top 25 nationally\nImplemented OpenCV for road recognition\nBuilt dynamic routing system"} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="GitHub URL" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
                    <InputField label="Live Demo URL" name="liveDemo" value={form.liveDemo} onChange={handleChange} placeholder="https://..." />
                  </div>
                  <InputField label="Image URL" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                      className="w-4 h-4 rounded accent-purple-500" />
                    <span className="text-sm text-gray-300">Featured hackathon</span>
                  </label>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2 px-5">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-5">
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save</>}
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
};

export default HackathonsAdmin;