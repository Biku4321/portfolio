import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Award, Upload } from "lucide-react";

const EMPTY = { title: "", issuer: "", year: "", url: "" };

export default function CertificatesAdmin() {
  const toast = useToast?.();
  const push = o => toast?.pushToast ? toast.pushToast(o) : alert(o.message);

  const [certs, setCerts]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal]     = useState(false);

  const fetchCerts = async () => {
    try {
      const res = await axiosInstance.get("/certificates");
      setCerts(res.data?.data || res.data || []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchCerts(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); };
  const openCreate = () => { reset(); setModal(true); };
  const openEdit = c => {
    setEditId(c._id);
    setForm({ title: c.title || "", issuer: c.issuer || "", year: c.year || "", url: c.url || "" });
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
      setForm(p => ({ ...p, url }));
      push({ type: "success", message: "Certificate uploaded!" });
    } catch { push({ type: "error", message: "Upload failed" }); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.title) { push({ type: "error", message: "Title is required" }); return; }
    setLoading(true);
    try {
      if (editId) { await axiosInstance.put(`/certificates/${editId}`, form); push({ type: "success", message: "Updated!" }); }
      else        { await axiosInstance.post("/certificates", form);          push({ type: "success", message: "Added!" }); }
      setModal(false); reset(); await fetchCerts();
    } catch { push({ type: "error", message: "Save failed" }); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this certificate?")) return;
    try { await axiosInstance.delete(`/certificates/${id}`); push({ type: "success", message: "Deleted" }); await fetchCerts(); }
    catch { push({ type: "error", message: "Delete failed" }); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-purple-400" /><p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p></div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Certificates</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus className="w-4 h-4" /> Add Certificate</button>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><Award className="w-12 h-12 mx-auto mb-3 opacity-20" />No certificates yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(251,191,36,0.1)" }}>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-gray-100 text-sm truncate">{c.title}</p>
                  {c.issuer && <p className="text-purple-400 text-xs mt-0.5">{c.issuer}</p>}
                  {c.year && <p className="text-xs text-gray-500 mt-0.5">{c.year}</p>}
                  {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-1 block truncate">View Certificate ↗</a>}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}><Trash2 className="w-3.5 h-3.5" /></button>
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
              <div className="w-full max-w-md rounded-2xl p-7" style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg text-gray-100">{editId ? "Edit Certificate" : "Add Certificate"}</h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AWS Solutions Architect" className="input-field text-sm" /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Issuer</label><input value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} placeholder="e.g. Amazon" className="input-field text-sm" /></div>
                    <div><label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Year</label><input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="e.g. 2024" className="input-field text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Certificate File / URL</label>
                    <div className="space-y-2">
                      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all ${uploading ? "opacity-60" : "hover:opacity-80"}`} style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload File</>}
                        <input type="file" accept="image/*,application/pdf" onChange={handleFile} disabled={uploading} className="hidden" />
                      </label>
                      <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="Or paste certificate URL..." className="input-field text-xs" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2 px-5">Cancel</button>
                    <button type="submit" disabled={loading || uploading} className="btn-primary text-sm py-2 px-5">
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
