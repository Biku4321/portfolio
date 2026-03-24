import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, GraduationCap } from "lucide-react";

const EMPTY = { degree: "", institution: "", year: "", location: "", grade: "", description: "", courses: "", highlights: "" };

const EducationAdmin = () => {
  const [list, setList]       = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState(false);

  const fetchList = async () => {
    try {
      const res = await axiosInstance.get("/education");
      const data = res.data?.data ?? res.data;
      setList(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchList(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); };
  const openCreate = () => { reset(); setModal(true); };
  const openEdit = item => {
    setEditId(item._id);
    setForm({
      degree: item.degree || "", institution: item.institution || "",
      year: item.year || "", location: item.location || "",
      grade: item.grade || "", description: item.description || "",
      courses:    Array.isArray(item.courses)    ? item.courses.join(", ")    : (item.courses || ""),
      highlights: Array.isArray(item.highlights) ? item.highlights.join("\n") : (item.highlights || ""),
    });
    setModal(true);
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.degree) { alert("Degree is required"); return; }
    setLoading(true);
    const payload = {
      ...form,
      courses:    form.courses    ? form.courses.split(",").map(s => s.trim()).filter(Boolean)    : [],
      highlights: form.highlights ? form.highlights.split("\n").map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editId) await axiosInstance.put(`/education/${editId}`, payload);
      else        await axiosInstance.post("/education", payload);
      setModal(false); reset(); await fetchList();
    } catch (err) { console.error(err); alert("Failed to save"); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this entry?")) return;
    try { await axiosInstance.delete(`/education/${id}`); await fetchList(); }
    catch { alert("Delete failed"); }
  };

  const InputRow = ({ label, name, placeholder, type = "text" }) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{label}</label>
      <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder} className="input-field text-sm" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><GraduationCap className="w-4 h-4 text-purple-400" /><p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p></div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Education</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> Add Education</button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />No education entries yet.</div>
      ) : (
        <div className="space-y-3">
          {list.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(124,92,252,0.1)" }}>
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-gray-100 text-sm">{item.degree}</p>
                  <p className="text-purple-400 text-xs mt-0.5 font-medium">{item.institution}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.year && <span className="text-xs text-gray-500">{item.year}</span>}
                    {item.location && <span className="text-xs text-gray-500">· {item.location}</span>}
                    {item.grade && <span className="text-xs font-medium" style={{ color: "#06d6a0" }}>CGPA: {item.grade}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(item._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Trash2 className="w-3.5 h-3.5" /></button>
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
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-7" style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg text-gray-100">{editId ? "Edit Education" : "Add Education"}</h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputRow label="Degree *" name="degree" placeholder="e.g. Bachelor of Technology in CS" />
                  <InputRow label="Institution *" name="institution" placeholder="e.g. IIT Bombay" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputRow label="Year" name="year" placeholder="e.g. 2020 - 2024" />
                    <InputRow label="Location" name="location" placeholder="e.g. Bangalore, India" />
                    <InputRow label="Grade / CGPA" name="grade" placeholder="e.g. 9.2/10 or 85%" />
                  </div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Description (optional)</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="input-field text-sm resize-none" placeholder="Brief description..." /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Coursework (comma separated)</label><input value={form.courses} onChange={e => setForm(p => ({ ...p, courses: e.target.value }))} placeholder="Data Structures, Algorithms, Machine Learning" className="input-field text-sm" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Highlights (one per line — shown as checkmarks)</label><textarea value={form.highlights} onChange={e => setForm(p => ({ ...p, highlights: e.target.value }))} rows={4} className="input-field text-sm resize-none" placeholder={"Active participant in hackathons\nCore member of Robotics club\nBuilt projects in Computer Vision"} /></div>
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
};

export default EducationAdmin;
