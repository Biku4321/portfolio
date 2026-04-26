import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { GraduationCap, MapPin, CheckCircle2 } from "lucide-react";

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

// ── Custom Cursor ─────────────────────────────────────────────────────────────
const CustomCursor = () => {
  const [hovered, setHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 600, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600, mass: 0.1 });
  React.useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    const over = (e) =>
      setHovered(!!e.target.closest("a, button, [data-cursor-hover]"));
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

const EducationCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    className="relative group"
  >
    <div className="absolute left-[-28px] top-6 w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-500 dark:to-indigo-500 shadow-lg" />
    <div className="absolute left-[-22px] top-10 bottom-[-40px] w-[2px] bg-slate-200 dark:bg-white/10" />
    <div
      className="
      relative overflow-hidden rounded-2xl p-7
      bg-white/80 dark:bg-white/[0.04]
      backdrop-blur-2xl
      border border-slate-200 dark:border-white/10
      shadow-[0_8px_30px_rgb(0,0,0,0.04)]
      dark:shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]
      dark:hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]
      transition-all duration-300
    "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent dark:from-purple-500/10 dark:via-indigo-500/10" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 dark:from-white/40 to-transparent opacity-20 pointer-events-none" />
      <div className="relative">
        <div className="flex flex-wrap justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
              {item.degree}
            </h3>
            <p className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium transition-colors">
              <GraduationCap className="w-4 h-4" />
              {item.institution}
            </p>
            {item.location && (
              <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 mt-1.5 transition-colors">
                <MapPin className="w-3.5 h-3.5" />
                {item.location}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {item.year && (
              <span className="px-3 py-1 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-400/20 transition-colors">
                {item.year}
              </span>
            )}
            {item.grade && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
                {item.gradeType?.toLowerCase() === "aggregate"
                  ? "Aggregate"
                  : "CGPA"}
                : {item.grade}
              </span>
            )}
          </div>
        </div>
        {item.description && (
          <p className="text-slate-600 dark:text-gray-400 text-sm mb-5 leading-relaxed transition-colors">
            {item.description}
          </p>
        )}
        <div className="h-px bg-slate-200 dark:bg-white/10 mb-5 transition-colors" />
        {item.highlights?.length > 0 && (
          <ul className="space-y-2.5 mb-5">
            {item.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-gray-300 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        {item.courses?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.courses.map((c, i) => (
              <span
                key={i}
                data-cursor-hover
                className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all cursor-default"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const PublicEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/education")
      .then((res) => setEducation(res.data?.data ?? res.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="relative min-h-screen bg-slate-50 dark:bg-[#0a0a14] py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ cursor: "none" }}
    >
      <CustomCursor />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <SectionBadge text="Academic Background" />

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white transition-colors">
            My{" "}
            <span className="relative inline-block group bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-transparent bg-clip-text">
              Education
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
          <p className="text-slate-600 dark:text-gray-400 mt-4 max-w-md mx-auto transition-colors">
            The academic journey that shaped my technical foundation.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-6 md:pl-10">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse"
                />
              ))}
          </div>
        ) : education.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-gray-400 py-20 bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl transition-colors">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No education data found.
          </div>
        ) : (
          <div className="space-y-10 pl-8 md:pl-10">
            {education.map((item, i) => (
              <EducationCard key={item._id || i} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEducation;
