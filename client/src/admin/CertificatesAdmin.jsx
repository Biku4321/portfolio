import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Award, Upload, FileText, Image, Link } from "lucide-react";

const EMPTY = { title: "", issuer: "", year: "", url: "", fileType: "link" };

// ── detect fileType from URL (fallback when fileType field missing in old data) ──
const detectFileType = (url, storedType) => {
  if (storedType && storedType !== "link") return storedType;
  if (!url) return "link";
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".pdf") || url.includes("/raw/upload/")) return "pdf";
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(clean) || url.includes("/image/upload/") || url.includes("cloudinary")) return "image";
  return "link";
};

const FileTypeIcon = ({ type }) => {
  if (type === "pdf")   return <FileText className="w-3.5 h-3.5" />;
  if (type === "image") return <Image    className="w-3.5 h-3.5" />;
  return <Link className="w-3.5 h-3.5" />;
};

export default function CertificatesAdmin() {
  const toast = useToast?.();
  const push = o => toast?.pushToast ? toast.pushToast(o) : alert(o.message);

  const [certs, setCerts]         = useState([]);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal]         = useState(false);
  const [previewModal, setPreviewModal] = useState(null); // { url, fileType, title }

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
    setForm({
      title:    c.title    || "",
      issuer:   c.issuer   || c.authority || "",
      year:     c.year     || "",
      url:      c.url      || "",
      fileType: c.fileType || detectFileType(c.url, c.fileType),
    });
    setModal(true);
  };

  // ── Upload handler — stores fileType returned by server ──
  const handleFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await axiosInstance.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url      = res.data?.url ?? res.data?.secure_url;
      const fileType = res.data?.fileType || detectFileType(url, null);
      if (!url) throw new Error("No URL");
      setForm(p => ({ ...p, url, fileType }));
      push({ type: "success", message: `${fileType === "pdf" ? "PDF" : "Image"} uploaded successfully!` });
    } catch { push({ type: "error", message: "Upload failed" }); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.title) { push({ type: "error", message: "Title is required" }); return; }
    setLoading(true);
    try {
      const payload = {
        title:    form.title,
        issuer:   form.issuer,
        authority: form.issuer, // also save to authority for backward compat
        year:     form.year,
        url:      form.url,
        fileType: form.url ? detectFileType(form.url, form.fileType) : "link",
      };
      if (editId) { await axiosInstance.put(`/certificates/${editId}`, payload); push({ type: "success", message: "Updated!" }); }
      else        { await axiosInstance.post("/certificates", payload);           push({ type: "success", message: "Added!" }); }
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Certificates</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {/* List */}
      {certs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />No certificates yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map((c, i) => {
            const ft = detectFileType(c.url, c.fileType);
            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(251,191,36,0.1)" }}>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-gray-100 text-sm truncate">{c.title}</p>
                    {(c.issuer || c.authority) && <p className="text-purple-400 text-xs mt-0.5">{c.issuer || c.authority}</p>}
                    {c.year && <p className="text-xs text-gray-500 mt-0.5">{c.year}</p>}
                    {c.url && (
                      <button
                        onClick={() => setPreviewModal({ url: c.url, fileType: ft, title: c.title })}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
                      >
                        <FileTypeIcon type={ft} />
                        {ft === "pdf" ? "Preview PDF" : ft === "image" ? "Preview Image" : "Open Link"} ↗
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit modal ── */}
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
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Title *</label>
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AWS Solutions Architect" className="input-field text-sm" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Issuer</label>
                      <input value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} placeholder="e.g. Amazon" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Year</label>
                      <input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="e.g. 2024" className="input-field text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Certificate File / URL</label>
                    <div className="space-y-2">
                      {/* Upload button */}
                      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all ${uploading ? "opacity-60" : "hover:opacity-80"}`}
                        style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
                        {uploading
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                          : <><Upload className="w-4 h-4" /> Upload Image or PDF</>}
                        <input type="file" accept="image/*,application/pdf" onChange={handleFile} disabled={uploading} className="hidden" />
                      </label>

                      {/* Manual URL */}
                      <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value, fileType: detectFileType(e.target.value, null) }))}
                        placeholder="Or paste certificate URL / PDF link..." className="input-field text-xs" />

                      {/* Preview of uploaded file */}
                      {form.url && (
                        <div className="mt-2 p-3 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="flex items-center gap-1.5 text-gray-400">
                              <FileTypeIcon type={detectFileType(form.url, form.fileType)} />
                              {detectFileType(form.url, form.fileType) === "pdf" ? "PDF document" : detectFileType(form.url, form.fileType) === "image" ? "Image file" : "External link"}
                            </span>
                            <a href={form.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">Open ↗</a>
                          </div>
                          {detectFileType(form.url, form.fileType) === "image" && (
                            <img src={form.url} alt="preview" className="w-full rounded-lg object-contain max-h-32" />
                          )}
                          {detectFileType(form.url, form.fileType) === "pdf" && (
                            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(124,92,252,0.08)" }}>
                              <FileText className="w-5 h-5 text-purple-400" />
                              <span className="text-gray-400 truncate">{form.url.split("/").pop()}</span>
                            </div>
                          )}
                        </div>
                      )}
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

      {/* ── Preview modal (image or PDF) ── */}
      <AnimatePresence>
        {previewModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" onClick={() => setPreviewModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-3xl rounded-2xl overflow-hidden pointer-events-auto"
                style={{ background: "#0f0f1a", border: "1px solid rgba(124,92,252,0.2)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2">
                    <FileTypeIcon type={previewModal.fileType} />
                    <p className="text-sm font-medium text-gray-200 truncate">{previewModal.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={previewModal.url} target="_blank" rel="noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg transition-colors"
                      style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
                      Open in new tab ↗
                    </a>
                    <button onClick={() => setPreviewModal(null)} className="text-gray-500 hover:text-gray-200 ml-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal content */}
                <div className="flex-1 overflow-auto p-4" style={{ minHeight: 0 }}>
                  {previewModal.fileType === "image" ? (
                    <img src={previewModal.url} alt={previewModal.title}
                      className="w-full rounded-xl object-contain max-h-[70vh] mx-auto" />
                  ) : previewModal.fileType === "pdf" ? (
                    <iframe
                      src={previewModal.url}
                      title={previewModal.title}
                      className="w-full rounded-xl"
                      style={{ height: "70vh", border: "none" }}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="mb-4">This file type can't be previewed here.</p>
                      <a href={previewModal.url} target="_blank" rel="noreferrer"
                        className="btn-primary text-sm inline-flex">Open in new tab ↗</a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}