// import React, { useEffect, useState } from "react";
// import axios from "../utils/axiosInstance";
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
//     impact: { performanceImprovement: "", userEngagement: "", businessValue: "" },
//     architecture: { frontend: "", backend: "", database: "", deployment: "" },
//   });
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch projects
//   const fetch = async () => {
//     try {
//       const res = await axios.get("/api/projects");
//       const data = res.data?.data ?? res.data;
//       setProjects(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("fetch projects", err);
//     }
//   };
//   useEffect(() => {
//     fetch();
//   }, []);

//   // Handle simple text changes
//   const handleChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   // Handle nested changes (impact, architecture)
//   const handleNestedChange = (group, field, value) => {
//     setForm((p) => ({
//       ...p,
//       [group]: { ...p[group], [field]: value },
//     }));
//   };

//   // Upload image
//   const handleFile = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("image", file);
//     try {
//       setLoading(true);
//       const res = await axios.post("/api/upload", fd, {
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

//   // Save (create or update)
//   const handleSubmit = async () => {
//     if (!form.title) return push({ type: "error", message: "Title required" });
//     setLoading(true);
//     try {
//       const payload = {
//         ...form,
//         tech:
//           typeof form.tech === "string"
//             ? form.tech.split(",").map((t) => t.trim()).filter(Boolean)
//             : form.tech,
//         architecture: {
//           frontend: form.architecture.frontend
//             ? form.architecture.frontend.split(",").map((s) => s.trim())
//             : [],
//           backend: form.architecture.backend
//             ? form.architecture.backend.split(",").map((s) => s.trim())
//             : [],
//           database: form.architecture.database,
//           deployment: form.architecture.deployment,
//         },
//       };

//       if (editId) {
//         await axios.put(`/api/projects/${editId}`, payload);
//         push({ type: "success", message: "Project updated" });
//       } else {
//         await axios.post("/api/projects", payload);
//         push({ type: "success", message: "Project created" });
//       }

//       resetForm();
//       await fetch();
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
//       impact: { performanceImprovement: "", userEngagement: "", businessValue: "" },
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
//       impact: p.impact || { performanceImprovement: "", userEngagement: "", businessValue: "" },
//       architecture: p.architecture || {
//         frontend: "",
//         backend: "",
//         database: "",
//         deployment: "",
//       },
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this project?")) return;
//     try {
//       await axios.delete(`/api/projects/${id}`);
//       push({ type: "success", message: "Deleted" });
//       await fetch();
//     } catch (err) {
//       console.error(err);
//       push({ type: "error", message: "Delete failed" });
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Projects</h2>

//       {/* Form */}
//       <div className="bg-white p-4 rounded shadow mb-6">
//         <input
//           name="title"
//           placeholder="Project Title"
//           value={form.title}
//           onChange={handleChange}
//           className="p-2 border rounded mb-2 w-full"
//         />
//         <textarea
//           name="description"
//           placeholder="Short description"
//           value={form.description}
//           onChange={handleChange}
//           className="p-2 border rounded mb-2 w-full"
//           rows={4}
//         />
//         <input
//           name="github"
//           placeholder="GitHub URL"
//           value={form.github}
//           onChange={handleChange}
//           className="p-2 border rounded mb-2 w-full"
//         />
//         <input
//           name="liveDemo"
//           placeholder="Live Demo URL"
//           value={form.liveDemo}
//           onChange={handleChange}
//           className="p-2 border rounded mb-2 w-full"
//         />
//         <input
//           name="caseStudyUrl"
//           placeholder="Case study URL"
//           value={form.caseStudyUrl}
//           onChange={handleChange}
//           className="p-2 border rounded mb-2 w-full"
//         />
//         <input
//           name="tech"
//           placeholder="Technologies (comma separated)"
//           value={form.tech}
//           onChange={handleChange}
//           className="p-2 border rounded mb-2 w-full"
//         />

//         <div className="flex items-center gap-3 mb-3">
//           <input type="file" accept="image/*" onChange={handleFile} />
//           {form.image && (
//             <img
//               src={form.image}
//               alt="preview"
//               className="w-24 h-24 object-cover rounded"
//             />
//           )}
//         </div>

//         <div className="flex items-center gap-3 mb-3">
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={form.featured}
//               onChange={(e) =>
//                 setForm((p) => ({ ...p, featured: e.target.checked }))
//               }
//             />
//             <span>Featured</span>
//           </label>
//           <input
//             name="category"
//             placeholder="Category"
//             value={form.category}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//         </div>

//         <div className="grid md:grid-cols-3 gap-3 mb-3">
//           <input
//             placeholder="Perf improvement"
//             value={form.impact.performanceImprovement}
//             onChange={(e) =>
//               handleNestedChange("impact", "performanceImprovement", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             placeholder="User engagement"
//             value={form.impact.userEngagement}
//             onChange={(e) =>
//               handleNestedChange("impact", "userEngagement", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             placeholder="Business value"
//             value={form.impact.businessValue}
//             onChange={(e) =>
//               handleNestedChange("impact", "businessValue", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//         </div>

//         <div className="grid md:grid-cols-2 gap-3 mb-3">
//           <input
//             placeholder="Frontend stack (comma separated)"
//             value={form.architecture.frontend}
//             onChange={(e) =>
//               handleNestedChange("architecture", "frontend", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             placeholder="Backend stack (comma separated)"
//             value={form.architecture.backend}
//             onChange={(e) =>
//               handleNestedChange("architecture", "backend", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             placeholder="Database"
//             value={form.architecture.database}
//             onChange={(e) =>
//               handleNestedChange("architecture", "database", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             placeholder="Deployment"
//             value={form.architecture.deployment}
//             onChange={(e) =>
//               handleNestedChange("architecture", "deployment", e.target.value)
//             }
//             className="p-2 border rounded"
//           />
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-indigo-600 text-white rounded"
//           >
//             {loading ? "Saving..." : editId ? "Update" : "Create"}
//           </button>
//           <button
//             onClick={resetForm}
//             className="px-4 py-2 border rounded"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Project list */}
//       <div className="space-y-4">
//         {projects.map((p) => (
//           <div
//             key={p._id}
//             className="bg-gray-50 p-4 rounded flex justify-between items-start"
//           >
//             <div>
//               <div className="font-semibold text-lg">{p.title}</div>
//               <div className="text-sm text-gray-600 mb-2">{p.description}</div>
//               <div className="text-sm">Tech: {(p.tech || []).join(", ")}</div>
//               {p.image && (
//                 <img
//                   src={p.image}
//                   alt={p.title}
//                   className="w-32 h-24 mt-2 object-cover rounded"
//                 />
//               )}
//             </div>
//             <div className="space-x-2">
//               <button onClick={() => handleEdit(p)} className="text-blue-500">
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(p._id)}
//                 className="text-red-500"
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
import axios from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

export default function ProjectsAdmin() {
  const toast = useToast?.();
  const push = (opts) => (toast?.pushToast ? toast.pushToast(opts) : alert(opts.message));

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    github: "",
    liveDemo: "",
    tech: "",
    image: "",
    caseStudyUrl: "",
    featured: false,
    category: "",
    impact: { performanceImprovement: "", userEngagement: "", businessValue: "" },
    architecture: { frontend: "", backend: "", database: "", deployment: "" },
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects");
      const data = res.data?.data ?? res.data;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleNestedChange = (group, field, value) => {
    setForm((p) => ({
      ...p,
      [group]: { ...p[group], [field]: value },
    }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.url ?? res.data?.secure_url ?? res.data;
      setForm((p) => ({ ...p, image: url }));
      push({ type: "success", message: "Image uploaded" });
    } catch (err) {
      console.error("upload", err);
      push({ type: "error", message: "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title) return push({ type: "error", message: "Title required" });
    setLoading(true);

    const payload = {
      ...form,
      tech: typeof form.tech === "string" ? form.tech.split(",").map((t) => t.trim()).filter(Boolean) : form.tech,
      architecture: {
        ...form.architecture,
        frontend: typeof form.architecture.frontend === 'string' ? form.architecture.frontend.split(",").map((s) => s.trim()) : form.architecture.frontend,
        backend: typeof form.architecture.backend === 'string' ? form.architecture.backend.split(",").map((s) => s.trim()) : form.architecture.backend,
      }
    };

    try {
      if (editId) {
        await axios.put(`/projects/${editId}`, payload);
        push({ type: "success", message: "Project updated" });
      } else {
        await axios.post("/projects", payload);
        push({ type: "success", message: "Project created" });
      }
      resetForm();
      await fetchProjects();
    } catch (err) {
      console.error("save project", err);
      push({ type: "error", message: "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      github: "",
      liveDemo: "",
      tech: "",
      image: "",
      caseStudyUrl: "",
      featured: false,
      category: "",
      impact: { performanceImprovement: "", userEngagement: "", businessValue: "" },
      architecture: { frontend: "", backend: "", database: "", deployment: "" },
    });
    setEditId(null);
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      github: p.github || "",
      liveDemo: p.liveDemo || "",
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
      image: p.image || "",
      caseStudyUrl: p.caseStudyUrl || "",
      featured: !!p.featured,
      category: p.category || "",
      impact: p.impact || { performanceImprovement: "", userEngagement: "", businessValue: "" },
      architecture: {
        frontend: Array.isArray(p.architecture?.frontend) ? p.architecture.frontend.join(", ") : "",
        backend: Array.isArray(p.architecture?.backend) ? p.architecture.backend.join(", ") : "",
        database: p.architecture?.database || "",
        deployment: p.architecture?.deployment || "",
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await axios.delete(`/projects/${id}`);
      push({ type: "success", message: "Deleted" });
      await fetchProjects();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Delete failed" });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
        {/* --- Main Fields --- */}
        <input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} className="p-2 border rounded w-full"/>
        <textarea name="description" placeholder="Short description" value={form.description} onChange={handleChange} className="p-2 border rounded w-full" rows={4}/>
        <div className="grid md:grid-cols-2 gap-3">
            <input name="github" placeholder="GitHub URL" value={form.github} onChange={handleChange} className="p-2 border rounded w-full"/>
            <input name="liveDemo" placeholder="Live Demo URL" value={form.liveDemo} onChange={handleChange} className="p-2 border rounded w-full"/>
            <input name="caseStudyUrl" placeholder="Case study URL" value={form.caseStudyUrl} onChange={handleChange} className="p-2 border rounded w-full"/>
            <input name="tech" placeholder="Technologies (comma separated)" value={form.tech} onChange={handleChange} className="p-2 border rounded w-full"/>
        </div>
        
        {/* --- Image and Meta --- */}
        <div className="flex flex-wrap items-center gap-4">
            <input type="file" accept="image/*" onChange={handleFile} />
            {form.image && <img src={form.image} alt="preview" className="w-24 h-24 object-cover rounded"/>}
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}/><span>Featured</span></label>
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="p-2 border rounded"/>
        </div>

        {/* --- Impact --- */}
        <h3 className="font-semibold pt-2">Impact</h3>
        <div className="grid md:grid-cols-3 gap-3">
            <input placeholder="Perf improvement" value={form.impact.performanceImprovement} onChange={(e) => handleNestedChange("impact", "performanceImprovement", e.target.value)} className="p-2 border rounded"/>
            <input placeholder="User engagement" value={form.impact.userEngagement} onChange={(e) => handleNestedChange("impact", "userEngagement", e.target.value)} className="p-2 border rounded"/>
            <input placeholder="Business value" value={form.impact.businessValue} onChange={(e) => handleNestedChange("impact", "businessValue", e.target.value)} className="p-2 border rounded"/>
        </div>

        {/* --- Architecture --- */}
        <h3 className="font-semibold pt-2">Architecture</h3>
        <div className="grid md:grid-cols-2 gap-3">
            <input placeholder="Frontend stack (comma separated)" value={form.architecture.frontend} onChange={(e) => handleNestedChange("architecture", "frontend", e.target.value)} className="p-2 border rounded"/>
            <input placeholder="Backend stack (comma separated)" value={form.architecture.backend} onChange={(e) => handleNestedChange("architecture", "backend", e.target.value)} className="p-2 border rounded"/>
            <input placeholder="Database" value={form.architecture.database} onChange={(e) => handleNestedChange("architecture", "database", e.target.value)} className="p-2 border rounded"/>
            <input placeholder="Deployment" value={form.architecture.deployment} onChange={(e) => handleNestedChange("architecture", "deployment", e.target.value)} className="p-2 border rounded"/>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex gap-2 pt-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Project" : "Create Project"}
          </button>
          <button onClick={resetForm} className="px-4 py-2 border rounded hover:bg-gray-100">
            Reset
          </button>
        </div>
      </div>

      {/* --- Project List --- */}
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="font-semibold text-lg">{p.title}</div>
              <div className="text-sm text-gray-600 mb-2">{p.description}</div>
              <div className="text-sm">
                <strong>Tech:</strong> {(p.tech || []).join(", ")}
              </div>
              {p.image && <img src={p.image} alt={p.title} className="w-32 h-24 mt-2 object-cover rounded"/>}
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 pt-2">
              <button onClick={() => handleEdit(p)} className="text-blue-500 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}