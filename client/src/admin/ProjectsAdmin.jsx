// import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useToast } from "../context/ToastContext";

// export default function ProjectsAdmin() {
//   const toast = useToast?.();
//   const push = (opts) =>
//     toast?.pushToast ? toast.pushToast(opts) : alert(opts.message);

//   const [projects, setProjects] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     github: "",
//     liveDemo: "",
//     tech: "",
//     image: "",
//     caseStudyUrl: "",
//     featured: false,
//     category: "",
//     impact: {
//       performanceImprovement: "",
//       userEngagement: "",
//       businessValue: "",
//     },
//     architecture: { frontend: "", backend: "", database: "", deployment: "" },
//   });
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchProjects = async () => {
//     try {
//       const res = await axiosInstance.get("/projects");
//       const data = res.data?.data ?? res.data;
//       setProjects(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("fetch projects", err);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleNestedChange = (group, field, value) => {
//     setForm((p) => ({
//       ...p,
//       [group]: { ...p[group], [field]: value },
//     }));
//   };

//   const handleFile = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("image", file);
//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/upload", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const url = res.data?.url ?? res.data?.secure_url ?? res.data;
//       setForm((p) => ({ ...p, image: url }));
//       push({ type: "success", message: "Image uploaded" });
//     } catch (err) {
//       console.error("upload", err);
//       push({ type: "error", message: "Upload failed" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.title) return push({ type: "error", message: "Title required" });
//     setLoading(true);

//     const payload = {
//       ...form,
//       tech:
//         typeof form.tech === "string"
//           ? form.tech
//               .split(",")
//               .map((t) => t.trim())
//               .filter(Boolean)
//           : form.tech,
//       architecture: {
//         ...form.architecture,
//         frontend:
//           typeof form.architecture.frontend === "string"
//             ? form.architecture.frontend.split(",").map((s) => s.trim())
//             : form.architecture.frontend,
//         backend:
//           typeof form.architecture.backend === "string"
//             ? form.architecture.backend.split(",").map((s) => s.trim())
//             : form.architecture.backend,
//       },
//     };

//     try {
//       if (editId) {
//         await axiosInstance.put(`/projects/${editId}`, payload);
//         push({ type: "success", message: "Project updated" });
//       } else {
//         await axiosInstance.post("/projects", payload);
//         push({ type: "success", message: "Project created" });
//       }
//       resetForm();
//       await fetchProjects();
//     } catch (err) {
//       console.error("save project", err);
//       push({ type: "error", message: "Save failed" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       title: "",
//       description: "",
//       github: "",
//       liveDemo: "",
//       tech: "",
//       image: "",
//       caseStudyUrl: "",
//       featured: false,
//       category: "",
//       impact: {
//         performanceImprovement: "",
//         userEngagement: "",
//         businessValue: "",
//       },
//       architecture: { frontend: "", backend: "", database: "", deployment: "" },
//     });
//     setEditId(null);
//   };

//   const handleEdit = (p) => {
//     setEditId(p._id);
//     setForm({
//       title: p.title || "",
//       description: p.description || "",
//       github: p.github || "",
//       liveDemo: p.liveDemo || "",
//       tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
//       image: p.image || "",
//       caseStudyUrl: p.caseStudyUrl || "",
//       featured: !!p.featured,
//       category: p.category || "",
//       impact: p.impact || {
//         performanceImprovement: "",
//         userEngagement: "",
//         businessValue: "",
//       },
//       architecture: {
//         frontend: Array.isArray(p.architecture?.frontend)
//           ? p.architecture.frontend.join(", ")
//           : "",
//         backend: Array.isArray(p.architecture?.backend)
//           ? p.architecture.backend.join(", ")
//           : "",
//         database: p.architecture?.database || "",
//         deployment: p.architecture?.deployment || "",
//       },
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this project?")) return;
//     try {
//       await axiosInstance.delete(`/projects/${id}`);
//       push({ type: "success", message: "Deleted" });
//       await fetchProjects();
//     } catch (err) {
//       console.error(err);
//       push({ type: "error", message: "Delete failed" });
//     }
//   };

//   const inputClass =
//     "p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white";

//   return (
//     // Dark mode text color fix
//     <div className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-white">
//       <h2 className="text-2xl font-bold mb-4">Projects</h2>

//       {/* Dark mode background fix */}
//       <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 space-y-4 transition-colors duration-200">
//         {/* --- Main Fields --- */}
//         <input
//           name="title"
//           placeholder="Project Title"
//           value={form.title}
//           onChange={handleChange}
//           className={inputClass}
//         />
//         <textarea
//           name="description"
//           placeholder="Short description"
//           value={form.description}
//           onChange={handleChange}
//           className={inputClass}
//           rows={4}
//         />
//         <div className="grid md:grid-cols-2 gap-3">
//           <input
//             name="github"
//             placeholder="GitHub URL"
//             value={form.github}
//             onChange={handleChange}
//             className={inputClass}
//           />
//           <input
//             name="liveDemo"
//             placeholder="Live Demo URL"
//             value={form.liveDemo}
//             onChange={handleChange}
//             className={inputClass}
//           />
//           <input
//             name="caseStudyUrl"
//             placeholder="Case study URL"
//             value={form.caseStudyUrl}
//             onChange={handleChange}
//             className={inputClass}
//           />
//           <input
//             name="tech"
//             placeholder="Technologies (comma separated)"
//             value={form.tech}
//             onChange={handleChange}
//             className={inputClass}
//           />
//         </div>

//         {/* --- Image and Meta --- */}
//         <div className="flex flex-wrap items-center gap-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFile}
//             className="text-sm text-gray-500 dark:text-gray-300
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-full file:border-0
//               file:text-sm file:font-semibold
//               file:bg-indigo-50 file:text-indigo-700
//               hover:file:bg-indigo-100
//               dark:file:bg-indigo-900 dark:file:text-indigo-300"
//           />
//           {form.image && (
//             <img
//               src={form.image}
//               alt="preview"
//               className="w-24 h-24 object-cover rounded"
//             />
//           )}
          
//           {/* Featured Toggle */}
//           <label className="flex items-center gap-2 cursor-pointer select-none border p-2 rounded dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
//             <input
//               type="checkbox"
//               checked={form.featured}
//               onChange={(e) =>
//                 setForm((p) => ({ ...p, featured: e.target.checked }))
//               }
//               className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//             />
//             <span className="font-medium">Featured (Top List)</span>
//           </label>

//           <input
//             name="category"
//             placeholder="Category"
//             value={form.category}
//             onChange={handleChange}
//             className={`${inputClass} w-auto`}
//           />
//         </div>

//         {/* --- Impact --- */}
//         <h3 className="font-semibold pt-2">Impact</h3>
//         <div className="grid md:grid-cols-3 gap-3">
//           <input
//             placeholder="Perf improvement"
//             value={form.impact.performanceImprovement}
//             onChange={(e) =>
//               handleNestedChange(
//                 "impact",
//                 "performanceImprovement",
//                 e.target.value
//               )
//             }
//             className={inputClass}
//           />
//           <input
//             placeholder="User engagement"
//             value={form.impact.userEngagement}
//             onChange={(e) =>
//               handleNestedChange("impact", "userEngagement", e.target.value)
//             }
//             className={inputClass}
//           />
//           <input
//             placeholder="Business value"
//             value={form.impact.businessValue}
//             onChange={(e) =>
//               handleNestedChange("impact", "businessValue", e.target.value)
//             }
//             className={inputClass}
//           />
//         </div>

//         {/* --- Architecture --- */}
//         <h3 className="font-semibold pt-2">Architecture</h3>
//         <div className="grid md:grid-cols-2 gap-3">
//           <input
//             placeholder="Frontend stack (comma separated)"
//             value={form.architecture.frontend}
//             onChange={(e) =>
//               handleNestedChange("architecture", "frontend", e.target.value)
//             }
//             className={inputClass}
//           />
//           <input
//             placeholder="Backend stack (comma separated)"
//             value={form.architecture.backend}
//             onChange={(e) =>
//               handleNestedChange("architecture", "backend", e.target.value)
//             }
//             className={inputClass}
//           />
//           <input
//             placeholder="Database"
//             value={form.architecture.database}
//             onChange={(e) =>
//               handleNestedChange("architecture", "database", e.target.value)
//             }
//             className={inputClass}
//           />
//           <input
//             placeholder="Deployment"
//             value={form.architecture.deployment}
//             onChange={(e) =>
//               handleNestedChange("architecture", "deployment", e.target.value)
//             }
//             className={inputClass}
//           />
//         </div>

//         {/* --- Action Buttons --- */}
//         <div className="flex gap-2 pt-2">
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
//             disabled={loading}
//           >
//             {loading
//               ? "Saving..."
//               : editId
//               ? "Update Project"
//               : "Create Project"}
//           </button>
//           <button
//             onClick={resetForm}
//             className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* --- Project List --- */}
//       <div className="space-y-4">
//         {projects.map((p) => (
//           <div
//             key={p._id}
//             className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start flex-wrap gap-4 shadow-sm"
//           >
//             <div className="flex-1 min-w-[200px]">
//               <div className="font-semibold text-lg flex items-center flex-wrap gap-2">
//                 {p.title}
//                 {/* Featured Badge */}
//                 {p.featured && (
//                   <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800">
//                     ⭐ Featured
//                   </span>
//                 )}
//               </div>
//               <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//                 {p.description}
//               </div>
//               <div className="text-sm">
//                 <strong>Tech:</strong> {(p.tech || []).join(", ")}
//               </div>
//               {p.image && (
//                 <img
//                   src={p.image}
//                   alt={p.title}
//                   className="w-32 h-24 mt-2 object-cover rounded"
//                 />
//               )}
//             </div>
//             <div className="flex-shrink-0 flex items-center gap-2 pt-2">
//               <button
//                 onClick={() => handleEdit(p)}
//                 className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(p._id)}
//                 className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, FolderOpen, Upload, ImageIcon } from "lucide-react";

const EMPTY_FORM = {
  title: "", description: "", github: "", liveDemo: "", tech: "",
  image: "", caseStudyUrl: "", featured: false, category: "",
  impact: { performanceImprovement: "", userEngagement: "", businessValue: "" },
  architecture: { frontend: "", backend: "", database: "", deployment: "" },
};

const Input = ({ label, name, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="input-field text-sm" />
  </div>
);

export default function ProjectsAdmin() {
  const toast = useToast?.();
  const push = opts => toast?.pushToast ? toast.pushToast(opts) : alert(opts.message);

  const [projects, setProjects] = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [modal, setModal]       = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("/projects");
      const data = res.data?.data ?? res.data;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchProjects(); }, []);

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleNested = (group, field, value) =>
    setForm(p => ({ ...p, [group]: { ...p[group], [field]: value } }));

  // ✅ FIX: field name must be "file" to match multer upload.single("file") on backend
  const handleFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    if (!file.type.startsWith("image/")) {
      push({ type: "error", message: "Please select an image file" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      push({ type: "error", message: "Image must be under 5MB" });
      return;
    }

    const fd = new FormData();
    fd.append("file", file); // ✅ Must be "file" — matches upload.single("file") in uploadRoutes.js

    try {
      setUploading(true);
      const res = await axiosInstance.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url ?? res.data?.secure_url;
      if (!url) throw new Error("No URL returned");
      setForm(p => ({ ...p, image: url }));
      push({ type: "success", message: "Image uploaded successfully!" });
    } catch (err) {
      console.error("upload error:", err);
      push({ type: "error", message: err.response?.data?.message || "Upload failed. Check Cloudinary config." });
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.title) { push({ type: "error", message: "Title is required" }); return; }
    setLoading(true);

    const payload = {
      ...form,
      tech: typeof form.tech === "string"
        ? form.tech.split(",").map(t => t.trim()).filter(Boolean)
        : form.tech,
      architecture: {
        ...form.architecture,
        frontend: typeof form.architecture.frontend === "string"
          ? form.architecture.frontend.split(",").map(s => s.trim()).filter(Boolean)
          : form.architecture.frontend,
        backend: typeof form.architecture.backend === "string"
          ? form.architecture.backend.split(",").map(s => s.trim()).filter(Boolean)
          : form.architecture.backend,
      },
    };

    try {
      if (editId) {
        await axiosInstance.put(`/projects/${editId}`, payload);
        push({ type: "success", message: "Project updated!" });
      } else {
        await axiosInstance.post("/projects", payload);
        push({ type: "success", message: "Project created!" });
      }
      setModal(false);
      resetForm();
      await fetchProjects();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Save failed. Try again." });
    } finally { setLoading(false); }
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); };

  const openCreate = () => { resetForm(); setModal(true); };
  const openEdit   = p => {
    setEditId(p._id);
    setForm({
      title: p.title || "", description: p.description || "",
      github: p.github || "", liveDemo: p.liveDemo || "",
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
      image: p.image || "", caseStudyUrl: p.caseStudyUrl || "",
      featured: !!p.featured, category: p.category || "",
      impact: p.impact || EMPTY_FORM.impact,
      architecture: {
        frontend:   Array.isArray(p.architecture?.frontend) ? p.architecture.frontend.join(", ") : "",
        backend:    Array.isArray(p.architecture?.backend)  ? p.architecture.backend.join(", ")  : "",
        database:   p.architecture?.database   || "",
        deployment: p.architecture?.deployment || "",
      },
    });
    setModal(true);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this project?")) return;
    try {
      await axiosInstance.delete(`/projects/${id}`);
      push({ type: "success", message: "Deleted" });
      await fetchProjects();
    } catch (err) { push({ type: "error", message: "Delete failed" }); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-100">Projects</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Project list */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No projects yet. Add your first one!
          </div>
        ) : projects.map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-5 flex items-center gap-4 flex-wrap">
            {p.image && (
              <img src={p.image} alt={p.title}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-gray-100">{p.title}</h3>
                {p.featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(6,214,160,0.1)", color: "#06d6a0" }}>✦ Featured</span>
                )}
                {p.category && (
                  <span className="tag text-xs">{p.category}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{p.description}</p>
              {p.tech?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.tech.slice(0, 4).map(t => <span key={t} className="text-xs text-gray-600 px-1.5 py-0.5 rounded bg-white/4">{t}</span>)}
                  {p.tech.length > 4 && <span className="text-xs text-gray-600">+{p.tech.length - 4}</span>}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(p)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(p._id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Modal ── */}
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
                    {editId ? "Edit Project" : "Add Project"}
                  </h2>
                  <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Basic info */}
                  <Input label="Title *" name="title" value={form.title} onChange={handleChange} placeholder="Project title" />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                      className="input-field text-sm resize-none" placeholder="Short description..." />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="GitHub URL" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." />
                    <Input label="Live Demo URL" name="liveDemo" value={form.liveDemo} onChange={handleChange} placeholder="https://..." />
                    <Input label="Tech Stack (comma separated)" name="tech" value={form.tech} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
                    <Input label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Web App, Tool, etc." />
                    <Input label="Case Study URL" name="caseStudyUrl" value={form.caseStudyUrl} onChange={handleChange} placeholder="https://..." />
                  </div>

                  {/* ✅ Image upload — fixed field name */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Project Image</label>
                    <div className="flex items-start gap-3 flex-wrap">
                      {/* Current image preview */}
                      {form.image ? (
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <img src={form.image} alt="preview"
                            className="w-24 h-24 rounded-xl object-cover"
                            style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                          <button type="button" onClick={() => setForm(p => ({ ...p, image: "" }))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white bg-red-500 hover:bg-red-400 text-xs">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                          <ImageIcon className="w-6 h-6 text-gray-600" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        {/* File upload button */}
                        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all ${uploading ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                          style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
                          {uploading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                            : <><Upload className="w-4 h-4" /> Choose Image</>
                          }
                          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
                        </label>

                        {/* Or paste URL */}
                        <input type="url" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                          placeholder="Or paste image URL directly..."
                          className="input-field text-xs" />
                        <p className="text-xs text-gray-600">Max 5MB · JPG, PNG, WebP, GIF</p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                      className="w-4 h-4 rounded accent-purple-500" />
                    <span className="text-sm text-gray-300">Featured project (shows first)</span>
                  </label>

                  {/* Impact */}
                  <div>
                    <p className="text-xs text-gray-500 mb-3 font-medium tracking-wide uppercase">Impact / Key Features</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input value={form.impact.performanceImprovement}
                        onChange={e => handleNested("impact", "performanceImprovement", e.target.value)}
                        placeholder="Performance improvement..." className="input-field text-xs" />
                      <input value={form.impact.userEngagement}
                        onChange={e => handleNested("impact", "userEngagement", e.target.value)}
                        placeholder="User engagement..." className="input-field text-xs" />
                      <input value={form.impact.businessValue}
                        onChange={e => handleNested("impact", "businessValue", e.target.value)}
                        placeholder="Business value..." className="input-field text-xs" />
                    </div>
                  </div>

                  {/* Architecture */}
                  <div>
                    <p className="text-xs text-gray-500 mb-3 font-medium tracking-wide uppercase">Architecture</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={form.architecture.frontend}
                        onChange={e => handleNested("architecture", "frontend", e.target.value)}
                        placeholder="Frontend stack (comma separated)" className="input-field text-xs" />
                      <input value={form.architecture.backend}
                        onChange={e => handleNested("architecture", "backend", e.target.value)}
                        placeholder="Backend stack (comma separated)" className="input-field text-xs" />
                      <input value={form.architecture.database}
                        onChange={e => handleNested("architecture", "database", e.target.value)}
                        placeholder="Database (e.g. MongoDB)" className="input-field text-xs" />
                      <input value={form.architecture.deployment}
                        onChange={e => handleNested("architecture", "deployment", e.target.value)}
                        placeholder="Deployment (e.g. Vercel)" className="input-field text-xs" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline text-sm py-2 px-5">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading || uploading} className="btn-primary text-sm py-2 px-5">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> {editId ? "Update" : "Create"}</>}
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
