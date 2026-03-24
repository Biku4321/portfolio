import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Github, Linkedin, Twitter,
  Facebook, Instagram, FileText, Briefcase, Trophy,
  Layers, Settings, GitMerge, Star, Upload, Save,
  Loader2, Plus, X, CheckCircle2,
} from "lucide-react";

const TABS = [
  { id: "basic",        label: "Basic Info",      icon: User },
  { id: "social",       label: "Social & Links",  icon: Linkedin },
  { id: "experience",   label: "Experience",      icon: Briefcase },
  { id: "achievements", label: "Achievements",    icon: Trophy },
  { id: "expertise",    label: "Expertise",       icon: Layers },
  { id: "industries",   label: "Industries",      icon: Star },
];

const Field = ({ label, name, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{label}</label>
    <input type={type} name={name} value={value || ""} onChange={onChange}
      placeholder={placeholder} className="input-field text-sm" />
  </div>
);

const TextArea = ({ label, name, value, onChange, rows = 3, placeholder = "" }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{label}</label>
    <textarea name={name} value={value || ""} onChange={onChange} rows={rows}
      placeholder={placeholder} className="input-field text-sm resize-none" />
  </div>
);

const EXPERTISE_COLORS = { primary: "#c084fc", secondary: "#60a5fa", tools: "#94a3b8", methodologies: "#06d6a0" };

export default function AboutAdmin() {
  const toast = useToast?.() ?? null;
  const push = opts => toast?.pushToast ? toast.pushToast(opts) : alert(opts.message);

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]       = useState(false);

  const [about, setAbout] = useState({
    name: "", title: "", tagline: "", bio: "", email: "", phone: "",
    location: "", profileImage: "", github: "", linkedin: "", twitter: "",
    facebook: "", instagram: "", resumeLink: "", objective: "",
    experience: { yearsOfExperience: "", companiesWorked: "", projectsCompleted: "", clientsSatisfied: "" },
    achievements: [],
    expertise: { primary: [], secondary: [], tools: [], methodologies: [] },
    industries: [],
  });

  const [newAch, setNewAch]         = useState({ metric: "", description: "", project: "", year: "" });
  const [newExp, setNewExp]         = useState({ bucket: "primary", value: "" });
  const [newIndustry, setNewIndustry] = useState("");

  useEffect(() => {
    axiosInstance.get("/about")
      .then(res => { const d = res.data?.data ?? res.data; if (d) setAbout(p => ({ ...p, ...d })); })
      .catch(console.error);
  }, []);

  const handleChange = e => setAbout(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleExp    = e => setAbout(p => ({ ...p, experience: { ...p.experience, [e.target.name]: e.target.value } }));

  const handleUpload = async (e, field = "profileImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await axiosInstance.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.url ?? res.data?.secure_url;
      if (!url) throw new Error("No URL");
      setAbout(p => ({ ...p, [field]: url }));
      push({ type: "success", message: `${field === "profileImage" ? "Photo" : "File"} uploaded!` });
    } catch { push({ type: "error", message: "Upload failed" }); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/about", about);
      push({ type: "success", message: "About saved!" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { push({ type: "error", message: "Save failed" }); }
    finally { setLoading(false); }
  };

  /* achievements */
  const addAch = () => {
    if (!newAch.metric) return;
    setAbout(p => ({ ...p, achievements: [...(p.achievements || []), { ...newAch }] }));
    setNewAch({ metric: "", description: "", project: "", year: "" });
  };
  const removeAch = i => setAbout(p => ({ ...p, achievements: p.achievements.filter((_, j) => j !== i) }));

  /* expertise */
  const addExp = () => {
    if (!newExp.value.trim()) return;
    setAbout(p => ({
      ...p,
      expertise: { ...p.expertise, [newExp.bucket]: [...(p.expertise?.[newExp.bucket] || []), newExp.value.trim()] }
    }));
    setNewExp(p => ({ ...p, value: "" }));
  };
  const removeExp = (bucket, i) => setAbout(p => ({
    ...p,
    expertise: { ...p.expertise, [bucket]: p.expertise[bucket].filter((_, j) => j !== i) }
  }));

  /* industries */
  const addInd = () => {
    if (!newIndustry.trim()) return;
    setAbout(p => ({ ...p, industries: [...(p.industries || []), newIndustry.trim()] }));
    setNewIndustry("");
  };
  const removeInd = i => setAbout(p => ({ ...p, industries: p.industries.filter((_, j) => j !== i) }));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1"><User className="w-4 h-4 text-purple-400" /><p className="text-xs text-gray-500 uppercase tracking-widest">Manage</p></div>
          <h1 className="font-display text-2xl font-bold text-gray-100">About Page</h1>
        </div>
        <button onClick={handleSave} disabled={loading}
          className="btn-primary text-sm py-2 px-5 min-w-28 justify-center">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={activeTab === tab.id
              ? { background: "var(--accent)", color: "#fff" }
              : { color: "#6b7280" }
            }>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass rounded-2xl p-7 space-y-5">

        {/* ── BASIC INFO ── */}
        {activeTab === "basic" && (<>
          <div className="flex flex-col sm:flex-row items-start gap-6 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Avatar preview */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-3"
                style={{ border: "2px solid rgba(124,92,252,0.3)" }}>
                {about.profileImage
                  ? <img src={about.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(124,92,252,0.1)" }}>
                      <span className="font-display text-3xl font-bold grad-text">{about.name?.charAt(0) || "?"}</span>
                    </div>
                }
              </div>
              <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${uploading ? "opacity-60" : "hover:opacity-80"}`}
                style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
                {uploading ? <><Loader2 className="w-3 h-3 animate-spin" /> Uploading…</> : <><Upload className="w-3 h-3" /> Upload Photo</>}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, "profileImage")} disabled={uploading} className="hidden" />
              </label>
            </div>
            <div className="flex-1 grid sm:grid-cols-2 gap-4 w-full">
              <Field label="Full Name" name="name" value={about.name} onChange={handleChange} placeholder="Bikash Samanta" />
              <Field label="Title / Role" name="title" value={about.title} onChange={handleChange} placeholder="Full Stack Developer" />
              <Field label="Email" name="email" value={about.email} onChange={handleChange} placeholder="you@email.com" />
              <Field label="Phone" name="phone" value={about.phone} onChange={handleChange} placeholder="+91 ..." />
              <Field label="Location" name="location" value={about.location} onChange={handleChange} placeholder="Silchar, Assam" />
              <Field label="Tagline" name="tagline" value={about.tagline} onChange={handleChange} placeholder="Building the web, one line at a time" />
            </div>
          </div>
          <TextArea label="Bio" name="bio" value={about.bio} onChange={handleChange} rows={4} placeholder="Short biography about yourself..." />
          <TextArea label="Career Objective" name="objective" value={about.objective} onChange={handleChange} rows={3} placeholder="Your career objective..." />
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">Resume Link</label>
            <div className="flex items-center gap-2">
              <input name="resumeLink" value={about.resumeLink || ""} onChange={handleChange}
                placeholder="https://drive.google.com/..." className="input-field text-sm flex-1" />
              <label className={`inline-flex items-center gap-1.5 px-3 py-3 rounded-xl cursor-pointer text-xs font-medium flex-shrink-0 ${uploading ? "opacity-60" : "hover:opacity-80"}`}
                style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Upload</>}
                <input type="file" accept="application/pdf" onChange={e => handleUpload(e, "resumeLink")} disabled={uploading} className="hidden" />
              </label>
            </div>
          </div>
        </>)}

        {/* ── SOCIAL & LINKS ── */}
        {activeTab === "social" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "GitHub URL",    name: "github",    icon: <Github className="w-4 h-4" />,    placeholder: "https://github.com/..." },
              { label: "LinkedIn URL",  name: "linkedin",  icon: <Linkedin className="w-4 h-4" />,  placeholder: "https://linkedin.com/in/..." },
              { label: "Twitter URL",   name: "twitter",   icon: <Twitter className="w-4 h-4" />,   placeholder: "https://twitter.com/..." },
              { label: "Facebook URL",  name: "facebook",  icon: <Facebook className="w-4 h-4" />,  placeholder: "https://facebook.com/..." },
              { label: "Instagram URL", name: "instagram", icon: <Instagram className="w-4 h-4" />, placeholder: "https://instagram.com/..." },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{f.icon}</span>
                  <input name={f.name} value={about[f.name] || ""} onChange={handleChange}
                    placeholder={f.placeholder} className="input-field text-sm pl-9" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EXPERIENCE NUMBERS ── */}
        {activeTab === "experience" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Years of Experience", name: "yearsOfExperience", placeholder: "e.g. 3" },
              { label: "Projects Completed",  name: "projectsCompleted", placeholder: "e.g. 15" },
              { label: "Companies Worked",    name: "companiesWorked",   placeholder: "e.g. 4" },
              { label: "Clients Satisfied",   name: "clientsSatisfied",  placeholder: "e.g. 100%" },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium tracking-wide">{f.label}</label>
                <input name={f.name} value={about.experience?.[f.name] || ""} onChange={handleExp}
                  placeholder={f.placeholder} className="input-field text-sm" />
              </div>
            ))}
          </div>
        )}

        {/* ── ACHIEVEMENTS ── */}
        {activeTab === "achievements" && (<>
          {/* Existing list */}
          {(about.achievements || []).length > 0 && (
            <div className="space-y-2 mb-4">
              {about.achievements.map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}>
                  <div>
                    <p className="font-medium text-sm text-gray-100">{a.metric}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.description} — {a.project} ({a.year})</p>
                  </div>
                  <button onClick={() => removeAch(i)} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Add new */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Add Achievement</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={newAch.metric} onChange={e => setNewAch(p => ({ ...p, metric: e.target.value }))}
                placeholder="Metric (e.g. 40% perf improvement)" className="input-field text-xs" />
              <input value={newAch.project} onChange={e => setNewAch(p => ({ ...p, project: e.target.value }))}
                placeholder="Project name" className="input-field text-xs" />
              <input value={newAch.year} onChange={e => setNewAch(p => ({ ...p, year: e.target.value }))}
                placeholder="Year (e.g. 2024)" className="input-field text-xs" />
              <input value={newAch.description} onChange={e => setNewAch(p => ({ ...p, description: e.target.value }))}
                placeholder="Short description" className="input-field text-xs" />
            </div>
            <button onClick={addAch} className="btn-primary text-xs py-2 px-4">
              <Plus className="w-3.5 h-3.5" /> Add Achievement
            </button>
          </div>
        </>)}

        {/* ── EXPERTISE ── */}
        {activeTab === "expertise" && (<>
          {/* Add form */}
          <div className="p-4 rounded-xl space-y-3 mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Add Skill to Bucket</p>
            <div className="flex gap-3 flex-wrap">
              <select value={newExp.bucket} onChange={e => setNewExp(p => ({ ...p, bucket: e.target.value }))}
                className="input-field text-sm w-auto">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tools">Tools</option>
                <option value="methodologies">Methodologies</option>
              </select>
              <input value={newExp.value} onChange={e => setNewExp(p => ({ ...p, value: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addExp()}
                placeholder="e.g. React, Docker, Agile" className="input-field text-sm flex-1 min-w-40" />
              <button onClick={addExp} className="btn-primary text-sm py-2 px-4">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
          {/* Buckets */}
          <div className="grid sm:grid-cols-2 gap-4">
            {["primary","secondary","tools","methodologies"].map(bucket => (
              <div key={bucket} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-semibold capitalize mb-3" style={{ color: EXPERTISE_COLORS[bucket] }}>{bucket}</p>
                {(about.expertise?.[bucket] || []).length === 0
                  ? <p className="text-xs text-gray-600 italic">None added</p>
                  : <div className="flex flex-wrap gap-1.5">
                      {(about.expertise[bucket] || []).map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                          style={{ background: `${EXPERTISE_COLORS[bucket]}15`, color: EXPERTISE_COLORS[bucket], border: `1px solid ${EXPERTISE_COLORS[bucket]}25` }}>
                          {item}
                          <button onClick={() => removeExp(bucket, i)} className="hover:opacity-70">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                }
              </div>
            ))}
          </div>
        </>)}

        {/* ── INDUSTRIES ── */}
        {activeTab === "industries" && (<>
          <div className="flex gap-3 mb-5">
            <input value={newIndustry} onChange={e => setNewIndustry(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addInd()}
              placeholder="e.g. Fintech, Healthcare, EdTech" className="input-field text-sm flex-1" />
            <button onClick={addInd} className="btn-primary text-sm py-2 px-4">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {(about.industries || []).length === 0
            ? <p className="text-gray-600 text-sm text-center py-6">No industries added yet.</p>
            : <div className="flex flex-wrap gap-2">
                {about.industries.map((ind, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)", color: "#c084fc" }}>
                    {ind}
                    <button onClick={() => removeInd(i)} className="hover:opacity-70">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
          }
        </>)}
      </motion.div>

      {/* Bottom save bar */}
      <div className="flex justify-end mt-4">
        <button onClick={handleSave} disabled={loading}
          className="btn-primary text-sm py-2.5 px-6 justify-center">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Save About Page</>}
        </button>
      </div>
    </div>
  );
}
