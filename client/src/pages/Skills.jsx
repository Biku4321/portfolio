import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Zap } from "lucide-react";

/* ── Custom Cursor ────────────────────────────────────────────────── */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 600, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600, mass: 0.1 });
  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover]")) setHovered(true);
      else setHovered(false);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
    };
  }, [mouseX, mouseY]);
  return (
    <>
      <motion.div
        ref={cursorRef}
        style={{
          position: "fixed",
          left: springX,
          top: springY,
          pointerEvents: "none",
          zIndex: 9999,
          width: hovered ? 56 : 36,
          height: hovered ? 56 : 36,
          border: `2px solid ${hovered ? "#7c5cfc" : "rgba(124,92,252,0.6)"}`,
          borderRadius: "50%",
          translateX: "-50%",
          translateY: "-50%",
          transition:
            "width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
          background: hovered ? "rgba(124,92,252,0.08)" : "transparent",
          backdropFilter: hovered ? "blur(2px)" : "none",
          boxShadow: hovered ? "0 0 20px rgba(124,92,252,0.3)" : "none",
        }}
      />
      <motion.div
        ref={dotRef}
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          pointerEvents: "none",
          zIndex: 9999,
          width: clicked ? 6 : 4,
          height: clicked ? 6 : 4,
          background: "#7c5cfc",
          borderRadius: "50%",
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.1s, height 0.1s",
          boxShadow: "0 0 8px rgba(124,92,252,0.8)",
        }}
      />
    </>
  );
};

/* Skill Level Colors */
const levelConfig = {
  Expert: { color: "#c084fc", width: "90%" },
  Advanced: { color: "#a855f7", width: "75%" },
  Intermediate: { color: "#059669", width: "60%" },
  Beginner: { color: "#64748b", width: "40%" },
};

/* Skill Card */
const SkillChip = ({ skill, index }) => {
  const level = levelConfig[skill.level] || levelConfig["Beginner"];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      data-cursor-hover
      className="group relative overflow-hidden rounded-2xl p-4 cursor-pointer
      bg-white/70 dark:bg-white/[0.04]
      backdrop-blur-2xl
      border border-white/20 dark:border-white/10
      shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]
      transition-all duration-300"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-20 pointer-events-none" />
      <div className="relative flex items-center gap-3">
        {skill.icon ? (
          <img
            src={skill.icon}
            alt={skill.name}
            className="w-8 h-8 object-contain rounded-md group-hover:scale-110 transition"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-purple-100 dark:bg-purple-500/10">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:rotate-6 transition" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">
            {skill.name}
          </p>
          {skill.level && (
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: level.color }}
            >
              {skill.level}
            </span>
          )}
          <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: level.width }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* Main Component */
const PublicSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    axiosInstance
      .get("/skills")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setSkills(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});
  const SectionBadge = ({ text }) => (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
      style={{
        background: "rgba(124,92,252,0.1)",
        border: "1px solid rgba(124,92,252,0.25)",
        color: "#a78bfa",
      }}
    >
      {text}
    </motion.span>
  );
  const categories = ["All", ...Object.keys(grouped)];
  const display =
    activeCategory === "All"
      ? grouped
      : { [activeCategory]: grouped[activeCategory] };

  return (
    <div
      className="relative min-h-screen bg-slate-50 dark:bg-[#0a0a14] py-24 px-6 overflow-hidden"
      style={{ cursor: "none" }}
    >
      {/* Custom cursor */}
      <CustomCursor />

      {/* Background Glow Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/20 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <SectionBadge text="My Toolkit" />

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tech{" "}
            <span className="relative inline-block group bg-gradient-to-r from-purple-600 to-indigo-500 text-transparent bg-clip-text">
              Skills
              {/* Hover underline */}
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{
                  background: "linear-gradient(90deg,#7c5cfc,#c084fc)",
                }}
              />
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-gray-400 mt-4 max-w-md mx-auto">
            Technologies and tools I use to build powerful digital experiences.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 relative">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-cursor-hover
                className="relative px-6 py-2 text-sm font-medium rounded-full overflow-hidden"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
                  />
                )}
                <span
                  className={`relative z-10 ${isActive ? "text-white" : "text-slate-600 dark:text-gray-400"}`}
                >
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-slate-200/50 dark:bg-white/5 rounded-xl h-20"
                />
              ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            🚀 No skills added yet
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(display).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200">
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">
                    {items.length} skills
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {items.map((skill, i) => (
                    <SkillChip key={skill._id} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSkills;
