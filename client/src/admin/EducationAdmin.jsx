import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, GraduationCap } from "lucide-react";

const EMPTY = { degree: "", institution: "", year: "", location: "", grade: "", gradeType: "cgpa", description: "", courses: "", highlights: "" };

// FIX: Moved InputRow outside the main component to prevent input focus loss on re-renders
const InputRow = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-xs text-slate-600 dark:text-gray-400 mb-1.5 font-medium tracking-wide">
      {label}
    </label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange}
      placeholder={placeholder} 
      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 transition-colors" 
    />
  </div>
);

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
      degree: item.degree || "", 
      institution: item.institution || "",
      year: item.year || "", 
      location: item.location || "",
      grade: item.grade || "", 
      // FIX: Added .toLowerCase() to handle database casing mismatches safely
      gradeType: item.gradeType?.toLowerCase() === "aggregate" ? "aggregate" : "cgpa", 
      description: item.description || "",
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest font-medium">Manage</p>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-gray-100 transition-colors">Education</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4 shadow-sm">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-gray-500 bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
          No education entries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] shadow-sm rounded-2xl p-5 flex items-start justify-between gap-4 transition-colors">
              <div className="flex gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-transparent">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-slate-900 dark:text-gray-100 text-base">{item.degree}</p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm mt-0.5 font-medium">{item.institution}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {item.year && <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400">{item.year}</span>}
                    {item.location && <span className="text-xs text-slate-500 dark:text-gray-400">· {item.location}</span>}
                    {/* FIX: Handled case sensitivity for the list render as well */}
                    {item.grade && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-transparent">
                        {item.gradeType?.toLowerCase() === "aggregate" ? "Aggregate" : "CGPA"}: {item.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-purple-100 hover:text-purple-600 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-purple-500/20 dark:hover:text-purple-400 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item._id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-red-100 hover:text-red-600 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-7 bg-white dark:bg-[#0f0f1a] border border-slate-200 dark:border-white/10 shadow-2xl transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-gray-100">
                    {editId ? "Edit Education" : "Add Education"}
                  </h2>
                  <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-200 p-1 bg-slate-100 dark:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputRow label="Degree *" value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))} placeholder="e.g. Bachelor of Technology in CS" />
                  <InputRow label="Institution *" value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. IIT Bombay" />
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputRow label="Year" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="e.g. 2020 - 2024" />
                    <InputRow label="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Bangalore, India" />
                    
                    <div>
                      <label className="block text-xs text-slate-600 dark:text-gray-400 mb-1.5 font-medium tracking-wide">Grade Type</label>
                      <div className="flex rounded-xl overflow-hidden p-1 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                        {[{ value: "cgpa", label: "CGPA" }, { value: "aggregate", label: "Aggregate %" }].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, gradeType: opt.value }))}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                              form.gradeType === opt.value
                                ? "bg-white dark:bg-purple-500/30 text-purple-600 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-purple-500/50"
                                : "text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 border border-transparent"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <InputRow 
                      label={form.gradeType === "aggregate" ? "Aggregate %" : "CGPA"} 
                      value={form.grade} 
                      onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} 
                      placeholder={form.gradeType === "aggregate" ? "e.g. 87%" : "e.g. 8.5/10"} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 dark:text-gray-400 mb-1.5 font-medium tracking-wide">Description (optional)</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 transition-colors resize-none" placeholder="Brief description..." />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-gray-400 mb-1.5 font-medium tracking-wide">Coursework (comma separated)</label>
                    <input value={form.courses} onChange={e => setForm(p => ({ ...p, courses: e.target.value }))} placeholder="Data Structures, Algorithms, Machine Learning" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-gray-400 mb-1.5 font-medium tracking-wide">Highlights (one per line — shown as checkmarks)</label>
                    <textarea value={form.highlights} onChange={e => setForm(p => ({ ...p, highlights: e.target.value }))} rows={4} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 transition-colors resize-none" placeholder={"Active participant in hackathons\nCore member of Robotics club\nBuilt projects in Computer Vision"} />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2.5 px-6 dark:border-white/20 text-slate-700 dark:text-white border-slate-300">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary text-sm py-2.5 px-8 flex items-center justify-center min-w-[120px]">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : <><Save className="w-4 h-4 mr-2" /> {editId ? "Update" : "Add"}</>}
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