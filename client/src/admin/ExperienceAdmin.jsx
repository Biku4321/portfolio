import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Briefcase } from "lucide-react";

const EMPTY = { role: "", company: "", period: "", description: "", skills: "" };

export default function ExperienceAdmin() {
  const toast = useToast?.();
  const push = o => toast?.pushToast ? toast.pushToast(o) : alert(o.message);

  const [items, setItems]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState(false);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/experience");
      const data = res.data?.data ?? res.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchItems(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); };
  const openCreate = () => { reset(); setModal(true); };
  const openEdit = e => {
    setEditId(e._id);
    setForm({ role: e.role || "", company: e.company || "", period: e.period || "", description: e.description || "", skills: Array.isArray(e.skills) ? e.skills.join(", ") : (e.skills || "") });
    setModal(true);
  };

  const handleSubmit = async ev => {
    ev?.preventDefault();
    if (!form.role || !form.company) { push({ type: "error", message: "Role & Company required" }); return; }
    setLoading(true);
    const payload = { ...form, skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [] };
    try {
      if (editId) { await axiosInstance.put(`/experience/${editId}`, payload); push({ type: "success", message: "Updated!" }); }
      else        { await axiosInstance.post("/experience", payload);          push({ type: "success", message: "Added!" }); }
      setModal(false); reset(); await fetchItems();
    } catch (err) { console.error(err); push({ type: "error", message: "Save failed" }); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this experience?")) return;
    try { await axiosInstance.delete(`/experience/${id}`); push({ type: "success", message: "Deleted" }); await fetchItems(); }
    catch { push({ type: "error", message: "Delete failed" }); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><Briefcase className="w-4 h-4 text-purple-400" /><p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p></div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Experience</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> Add Experience</button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />No experience added yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((e, i) => (
            <motion.div key={e._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(124,92,252,0.1)" }}>
                  <Briefcase className="w-4 h-4 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-gray-100 text-sm">{e.role}</p>
                  <p className="text-purple-400 text-xs mt-0.5 font-medium">{e.company}</p>
                  {e.period && <p className="text-xs text-gray-500 mt-0.5">{e.period}</p>}
                  {e.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{e.description}</p>}
                  {e.skills?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{e.skills.slice(0,4).map(s => <span key={s} className="tag text-xs">{s}</span>)}</div>}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(e._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Trash2 className="w-3.5 h-3.5" /></button>
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
              <div className="w-full max-w-lg rounded-2xl p-7" style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg text-gray-100">{editId ? "Edit Experience" : "Add Experience"}</h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Role *</label><input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Full Stack Developer" className="input-field text-sm" /></div>
                    <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Company *</label><input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Acme Corp" className="input-field text-sm" /></div>
                    <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Period</label><input value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} placeholder="e.g. Jan 2023 - Present" className="input-field text-sm" /></div>
                    <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Skills (comma separated)</label><input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, Node.js, MongoDB" className="input-field text-sm" /></div>
                  </div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field text-sm resize-none" placeholder="Describe your role and responsibilities..." /></div>
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
