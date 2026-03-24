import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Zap } from "lucide-react";

const EMPTY = { name: "", category: "", level: "Intermediate", icon: "", isTop: false };
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const levelColors = { Expert: "#c084fc", Advanced: "#7c5cfc", Intermediate: "#06d6a0", Beginner: "#94a3b8" };

export default function SkillsAdmin() {
  const toast = useToast?.();
  const push = o => toast?.pushToast ? toast.pushToast(o) : alert(o.message);

  const [skills, setSkills]   = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState(false);

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const fetchSkills = async () => {
    try {
      const res = await axiosInstance.get("/skills");
      const data = res.data?.data ?? res.data;
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchSkills(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); };
  const openCreate = () => { reset(); setModal(true); };
  const openEdit = s => {
    setEditId(s._id);
    setForm({ name: s.name || "", category: s.category || "", level: s.level || "Intermediate", icon: s.icon || "", isTop: !!s.isTop });
    setModal(true);
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.name || !form.category) { push({ type: "error", message: "Name & Category required" }); return; }
    setLoading(true);
    try {
      if (editId) { await axiosInstance.put(`/skills/${editId}`, form); push({ type: "success", message: "Skill updated!" }); }
      else        { await axiosInstance.post("/skills", form);          push({ type: "success", message: "Skill added!" }); }
      setModal(false); reset(); await fetchSkills();
    } catch (err) { console.error(err); push({ type: "error", message: "Save failed" }); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this skill?")) return;
    try { await axiosInstance.delete(`/skills/${id}`); push({ type: "success", message: "Deleted" }); await fetchSkills(); }
    catch { push({ type: "error", message: "Delete failed" }); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-purple-400" /><p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p></div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Skills</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> Add Skill</button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-500"><Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />No skills yet. Add your first one!</div>
      ) : Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display font-bold text-base text-gray-200">{cat}</h2>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-gray-600">{items.length}</span>
          </div>
          <div className="space-y-2">
            {items.map((s, i) => (
              <motion.div key={s._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {s.icon ? <img src={s.icon} alt={s.name} className="w-8 h-8 rounded-lg object-contain" />
                    : <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,92,252,0.1)" }}><Zap className="w-4 h-4 text-purple-400" /></div>}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100 text-sm">{s.name}</span>
                      {s.level && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: levelColors[s.level] || "#94a3b8", background: `${levelColors[s.level] || "#94a3b8"}18` }}>{s.level}</span>}
                      {s.isTop && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#f59e0b" }}>⭐ Top</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl p-7" style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg text-gray-100">{editId ? "Edit Skill" : "Add Skill"}</h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Skill Name *</label><input name="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. React" className="input-field text-sm" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Category *</label><input name="category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Frontend, Backend, Tools" className="input-field text-sm" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Level</label>
                    <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} className="input-field text-sm">
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Icon URL (optional)</label><input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="https://..." className="input-field text-sm" /></div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isTop} onChange={e => setForm(p => ({ ...p, isTop: e.target.checked }))} className="w-4 h-4 rounded accent-purple-500" />
                    <span className="text-sm text-gray-300">Top Skill (show on Home)</span>
                  </label>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2 px-5">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> {editId ? "Update" : "Add"}</>}
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
