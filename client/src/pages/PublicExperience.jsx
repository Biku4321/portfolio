import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Briefcase, Calendar, ChevronRight, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
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

const parseDescription = (desc) => {
  if (!desc) return [];
  return desc
    .split(/\n|(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);
};

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
const ExpCard = ({ item, index }) => {
  const bullets = parseDescription(item.description);
  const title = item.role || item.position || "—";
  const period = item.period || item.year || "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative pl-10 md:pl-8"
    >
      <span
        className="absolute left-0 top-7 w-3.5 h-3.5 rounded-full -translate-x-[calc(50%+1px)]"
        style={{
          background: "linear-gradient(135deg,#7c5cfc,#c084fc)",
          boxShadow:
            "0 0 0 3px rgba(124,92,252,0.15), 0 0 14px rgba(124,92,252,0.45)",
        }}
      />
      <div className="exp-card rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5 group">
        <div
          className="exp-card-shimmer absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(124,92,252,0.6),transparent)",
          }}
        />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div className="flex items-start gap-3">
            <div className="exp-icon w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <h3
                className="font-display font-bold text-lg leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h3>
              <p className="font-semibold text-sm mt-0.5 flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <MapPin className="w-3 h-3" /> {item.company}
              </p>
            </div>
          </div>
          {period && (
            <span className="exp-badge inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full flex-shrink-0 self-start">
              <Calendar className="w-3 h-3" /> {period}
            </span>
          )}
        </div>
        {bullets.length > 0 && (
          <div
            className="mb-5 h-px"
            style={{ background: "var(--border-color)" }}
          />
        )}
        {bullets.length > 0 && (
          <ul className="space-y-2.5 mb-5">
            {bullets.map((point, pi) => (
              <motion.li
                key={pi}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + pi * 0.04 }}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                <motion.span
                  className="exp-bullet flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                 whileHover={{ scale: 1.15 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        )}
        {item.skills?.length > 0 && (
          <div
            className="flex flex-wrap gap-2 pt-4"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            {item.skills.map((s) => (
              <span key={s} className="tag text-xs">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PublicExperience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/experience")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen py-24 px-6"
      style={{ background: "var(--bg-primary)", cursor: "none" }}
    >
      <CustomCursor />
      <Helmet>
        <title>Experience | Portfolio</title>
        <meta name="description" content="My professional work experience." />
      </Helmet>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="blob"
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(124,92,252,0.18),transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="blob"
          style={{
            position: "absolute",
            bottom: 0,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(192,132,252,0.12),transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <SectionBadge text="My Journey" />

          {/* Heading */}
          <h1
            className="font-display text-5xl md:text-6xl font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Work{" "}
            <span className="relative inline-block group grad-text">
              Experience
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
          <p
            className="mt-4 max-w-md mx-auto text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            A timeline of my professional roles, responsibilities, and skills
            built along the way.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-6 pl-10 md:pl-8">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="skeleton h-44 rounded-2xl" />
              ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--text-muted)" }}
          >
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div
              className="absolute top-4 bottom-4"
              style={{
                left: "6px",
                width: "1px",
                background:
                  "linear-gradient(to bottom,rgba(124,92,252,0.7),rgba(124,92,252,0.15),transparent)",
              }}
            />
            <div className="space-y-7">
              {items.map((item, i) => (
                <ExpCard key={item._id || i} item={item} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .exp-card { position:relative; background:var(--glass-bg); border:1px solid var(--glass-border); box-shadow:0 4px 24px rgba(0,0,0,0.06); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); }
        .exp-card:hover { border-color:rgba(124,92,252,0.3); box-shadow:0 8px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(124,92,252,0.12); }
        .dark .exp-card { box-shadow:0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04); }
        .dark .exp-card:hover { box-shadow:0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,92,252,0.2), inset 0 1px 0 rgba(255,255,255,0.06); }
        .exp-icon { background:rgba(124,92,252,0.1); border:1px solid rgba(124,92,252,0.2); }
        :root:not(.dark) .exp-icon { background:rgba(124,92,252,0.08); border-color:rgba(124,92,252,0.15); }
        .exp-badge { background:rgba(124,92,252,0.08); border:1px solid rgba(124,92,252,0.2); color:#9333ea; }
        .dark .exp-badge { background:rgba(124,92,252,0.1); border-color:rgba(124,92,252,0.25); color:#c084fc; }
        .exp-bullet { background: linear-gradient(135deg, #22c55e, #16a34a); /* green gradient */
  border: none;
  box-shadow: 0 0 8px rgba(34,197,94,0.5); }
        :root:not(.dark) .exp-bullet { background:rgba(124,92,252,0.07); border-color:rgba(124,92,252,0.15); }
      `}</style>
    </div>
  );
};

export default PublicExperience;
