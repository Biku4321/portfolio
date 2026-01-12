import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

const LabeledInput = ({ label, name, value, onChange, placeholder }) => (
  <label className="block">
    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </div>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </label>
);

const LabeledTextArea = ({ label, name, value, onChange, rows = 3 }) => (
  <label className="block">
    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </div>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows={rows}
      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </label>
);

export default function AboutAdmin() {
  const toast = useToast?.() ?? null;
  const push = (opts) =>
    toast?.pushToast ? toast.pushToast(opts) : alert(opts.message);

  const [about, setAbout] = useState({
    name: "",
    title: "",
    tagline: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    profileImage: "",
    github: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    resumeLink: "",
    objective: "",
    experience: {
      yearsOfExperience: "",
      companiesWorked: "",
      projectsCompleted: "",
      clientsSatisfied: "",
    },
    achievements: [],
    expertise: { primary: [], secondary: [], tools: [], methodologies: [] },
    industries: [],
    certifications: [],
  });

  const [loading, setLoading] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    metric: "",
    description: "",
    project: "",
    year: "",
  });
  const [newExpertise, setNewExpertise] = useState({
    bucket: "primary",
    value: "",
  });
  const [newIndustry, setNewIndustry] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/about");
        const data = res.data?.data ?? res.data;
        if (data) setAbout((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("fetch about", err);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setAbout((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpload = async (e, field = "profileImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      const res = await axiosInstance.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url ?? res.data?.secure_url ?? res.data;
      setAbout((prev) => ({ ...prev, [field]: url }));
      push({
        type: "success",
        message: `${field === "profileImage" ? "Image" : "File"} uploaded`,
      });
    } catch (err) {
      console.error("upload", err);
      push({ type: "error", message: "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const addAchievement = () => {
    if (!newAchievement.metric && !newAchievement.description) return;
    setAbout((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), { ...newAchievement }],
    }));
    setNewAchievement({
      metric: "",
      description: "",
      project: "",
      year: "",
    });
  };

  const removeAchievement = (idx) => {
    setAbout((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== idx),
    }));
  };

  const addIndustry = () => {
    if (!newIndustry.trim()) return;
    setAbout((prev) => ({
      ...prev,
      industries: [...(prev.industries || []), newIndustry.trim()],
    }));
    setNewIndustry("");
  };

  const removeIndustry = (idx) => {
    setAbout((prev) => ({
      ...prev,
      industries: prev.industries.filter((_, i) => i !== idx),
    }));
  };

  const addExpertiseValue = () => {
    const { bucket, value } = newExpertise;
    if (!value) return;
    setAbout((prev) => {
      const next = { ...prev };
      next.expertise = { ...next.expertise };
      next.expertise[bucket] = Array.isArray(next.expertise[bucket])
        ? [...next.expertise[bucket], value]
        : [value];
      return next;
    });
    setNewExpertise({ bucket: newExpertise.bucket, value: "" });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/about", about);
      push({ type: "success", message: "About saved" });
    } catch (err) {
      console.error("save about", err);
      push({ type: "error", message: "Saving failed" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">About — Admin</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 space-y-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-3">
            <LabeledInput
              label="Full name"
              name="name"
              value={about.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <LabeledInput
              label="Title"
              name="title"
              value={about.title}
              onChange={handleChange}
              placeholder="Senior Full Stack Developer"
            />
            <LabeledInput
              label="Tagline"
              name="tagline"
              value={about.tagline}
              onChange={handleChange}
              placeholder="Short tagline"
            />
            <LabeledTextArea
              label="Short bio"
              name="bio"
              value={about.bio}
              onChange={handleChange}
              rows={4}
            />
            <LabeledTextArea
              label="Objective"
              name="objective"
              value={about.objective}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Profile Image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "profileImage")}
                className="text-sm text-gray-500 dark:text-gray-400"
              />
              {about.profileImage && (
                <img
                  src={about.profileImage}
                  alt="profile"
                  className="w-28 h-28 rounded-full mt-3 object-cover"
                />
              )}
            </div>

            <LabeledInput
              label="Email"
              name="email"
              value={about.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <LabeledInput
              label="Phone"
              name="phone"
              value={about.phone}
              onChange={handleChange}
              placeholder="+91-..."
            />
            <LabeledInput
              label="Location"
              name="location"
              value={about.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
            <div className="p-2 border rounded dark:border-gray-600">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Resume
              </label>
              <div className="flex items-center gap-4 mt-1">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleUpload(e, "resumeLink")}
                  className="text-sm text-gray-500 dark:text-gray-400"
                />
                {about.resumeLink && (
                  <a
                    href={about.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Uploaded
                  </a>
                )}
              </div>
              <input
                name="resumeLink"
                placeholder="Or paste direct URL"
                value={about.resumeLink}
                onChange={handleChange}
                className={`${inputClass} w-full mt-2`}
              />
            </div>
          </div>
        </div>

        {/* Social & links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LabeledInput
            label="GitHub"
            name="github"
            value={about.github}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
          <LabeledInput
            label="LinkedIn"
            name="linkedin"
            value={about.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/..."
          />
          <LabeledInput
            label="Twitter"
            name="twitter"
            value={about.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/..."
          />
          <LabeledInput
            label="Facebook"
            name="facebook"
            value={about.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
          <LabeledInput
            label="Instagram"
            name="instagram"
            value={about.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>

        {/* Experience numbers */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Experience Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="number"
              name="yearsOfExperience"
              placeholder="Years"
              value={about.experience?.yearsOfExperience || ""}
              onChange={(e) =>
                setAbout((p) => ({
                  ...p,
                  experience: {
                    ...p.experience,
                    yearsOfExperience: e.target.value,
                  },
                }))
              }
              className={inputClass}
            />
            <input
              type="number"
              name="companiesWorked"
              placeholder="Companies"
              value={about.experience?.companiesWorked || ""}
              onChange={(e) =>
                setAbout((p) => ({
                  ...p,
                  experience: {
                    ...p.experience,
                    companiesWorked: e.target.value,
                  },
                }))
              }
              className={inputClass}
            />
            <input
              type="number"
              name="projectsCompleted"
              placeholder="Projects"
              value={about.experience?.projectsCompleted || ""}
              onChange={(e) =>
                setAbout((p) => ({
                  ...p,
                  experience: {
                    ...p.experience,
                    projectsCompleted: e.target.value,
                  },
                }))
              }
              className={inputClass}
            />
            <input
              type="number"
              name="clientsSatisfied"
              placeholder="Clients"
              value={about.experience?.clientsSatisfied || ""}
              onChange={(e) =>
                setAbout((p) => ({
                  ...p,
                  experience: {
                    ...p.experience,
                    clientsSatisfied: e.target.value,
                  },
                }))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Achievements
          </h3>
          <div className="space-y-2 mb-3">
            {about.achievements?.map((a, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {a.metric}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {a.description}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    className="text-red-500 hover:text-red-400"
                    onClick={() => removeAchievement(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              placeholder="metric (e.g., 40% perf)"
              value={newAchievement.metric}
              onChange={(e) =>
                setNewAchievement((p) => ({
                  ...p,
                  metric: e.target.value,
                }))
              }
              className={inputClass}
            />
            <input
              placeholder="project"
              value={newAchievement.project}
              onChange={(e) =>
                setNewAchievement((p) => ({
                  ...p,
                  project: e.target.value,
                }))
              }
              className={inputClass}
            />
            <input
              placeholder="year"
              value={newAchievement.year}
              onChange={(e) =>
                setNewAchievement((p) => ({ ...p, year: e.target.value }))
              }
              className={inputClass}
            />
            <input
              placeholder="short desc"
              value={newAchievement.description}
              onChange={(e) =>
                setNewAchievement((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              className={inputClass}
            />
            <div className="md:col-span-4">
              <button
                onClick={addAchievement}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add Achievement
              </button>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Industries
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              placeholder="e.g., Fintech, Healthcare"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              className={`${inputClass} flex-grow mb-0`}
            />
            <button
              onClick={addIndustry}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(about.industries || []).map((industry, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm text-gray-800 dark:text-gray-200"
              >
                {industry}
                <button
                  onClick={() => removeIndustry(i)}
                  className="text-red-500 hover:text-red-400 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expertise buckets */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Expertise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <select
              value={newExpertise.bucket}
              onChange={(e) =>
                setNewExpertise((p) => ({ ...p, bucket: e.target.value }))
              }
              className={inputClass}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="tools">Tools</option>
              <option value="methodologies">Methodologies</option>
            </select>
            <input
              placeholder="e.g., React, Node, Docker"
              value={newExpertise.value}
              onChange={(e) =>
                setNewExpertise((p) => ({ ...p, value: e.target.value }))
              }
              className={inputClass}
            />
            <button
              onClick={addExpertiseValue}
              className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 h-[42px]"
            >
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {["primary", "secondary", "tools", "methodologies"].map((k) => (
              <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="font-semibold capitalize text-gray-900 dark:text-white">
                  {k}
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {(about.expertise?.[k] || []).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save About"}
          </button>
        </div>
      </div>
    </div>
  );
}