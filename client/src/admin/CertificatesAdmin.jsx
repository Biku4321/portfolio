import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

export default function CertificatesAdmin() {
  const toast = useToast?.();
  const push = (opts) => (toast?.pushToast ? toast.pushToast(opts) : alert(opts.message));

  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({ title: "", issuer: "", year: "", url: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCerts = async () => {
    try {
      const res = await axios.get("/certificates");
      setCerts(res.data?.data || res.data);
    } catch (err) {
      console.error("fetch certs", err);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    // === FIX IS HERE ===
    // Hamesha 'file' ka istemal karein, jo ab backend se match karta hai
    fd.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = res.data?.url ?? res.data?.secure_url ?? res.data;
      setForm((prev) => ({ ...prev, url: fileUrl }));
      push({ type: "success", message: "Certificate file uploaded!" });
    } catch (err) {
      console.error("upload failed", err);
      push({ type: "error", message: "File upload failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/certificates/${editId}`, form);
        push({ type: "success", message: "Updated" });
      } else {
        await axios.post("/certificates", form);
        push({ type: "success", message: "Added" });
      }
      setEditId(null);
      setForm({ title: "", issuer: "", year: "", url: "" });
      await fetchCerts();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c) => { setEditId(c._id); setForm(c); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this?")) return;
    try {
      await axios.delete(`/certificates/${id}`);
      push({ type: "success", message: "Deleted" });
      await fetchCerts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Certificates</h2>
      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="issuer" placeholder="Issuer (e.g., Coursera)" value={form.issuer} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} className="p-2 border rounded w-full" />
        <div className="p-2 border rounded">
          <label className="text-sm text-gray-600">Certificate File</label>
          <div className="flex items-center gap-4 mt-1">
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
            {form.url && <a href={form.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">View Uploaded</a>}
          </div>
          <input name="url" placeholder="Or paste direct URL here" value={form.url} onChange={handleChange} className="p-2 border rounded w-full mt-2" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
          {loading ? "Saving..." : editId ? "Update" : "Add"}
        </button>
      </div>
      <div className="space-y-3">
        {certs.map((c) => (
          <div key={c._id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm">{c.issuer} - {c.year}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(c)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(c._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}