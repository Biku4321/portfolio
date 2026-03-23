import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const levelColor = { Expert: "#c084fc", Advanced: "#7c5cfc", Intermediate: "#06d6a0", Beginner: "#94a3b8" };
const levelBg    = { Expert: "rgba(192,132,252,0.1)", Advanced: "rgba(124,92,252,0.1)", Intermediate: "rgba(6,214,160,0.1)", Beginner: "rgba(148,163,184,0.1)" };

const SkillChip = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16,1,0.3,1] }}
    className="glass card-hover rounded-xl p-4 flex items-center gap-3 cursor-default"
  >
    {skill.icon ? (
      <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain rounded-md flex-shrink-0" />
    ) : (
      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(124,92,252,0.12)" }}>
        <Zap className="w-3.5 h-3.5 text-purple-400" />
      </div>
    )}
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-200 truncate">{skill.name}</p>
      {skill.level && (
        <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
          style={{ color: levelColor[skill.level] || "#94a3b8", background: levelBg[skill.level] || "rgba(148,163,184,0.1)" }}>
          {skill.level}
        </span>
      )}
    </div>
  </motion.div>
);

const PublicSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    axiosInstance.get("/skills")
      .then(res => {
        const data = res.data?.data ?? res.data;
        setSkills(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const categories = ["All", ...Object.keys(grouped)];
  const display = activeCategory === "All" ? grouped : { [activeCategory]: grouped[activeCategory] };

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-14">
          <p className="section-label">My toolkit</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">
            Tech <span className="grad-text">Skills</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-md mx-auto">Technologies and tools I use to bring ideas to life.</p>
        </motion.div>

        {/* Category filter */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={activeCategory === cat
                ? { background: "var(--accent)", color: "#fff", boxShadow: "0 0 20px rgba(124,92,252,0.4)" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }
              }
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(display).map(([category, items]) => (
              <motion.div key={category} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-display font-bold text-lg text-gray-200">{category || "Other"}</h2>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-gray-600">{items.length} skills</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {items.map((skill, i) => <SkillChip key={skill._id} skill={skill} index={i} />)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSkills;
