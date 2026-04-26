import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Github,
  ExternalLink,
  Trophy,
  CheckCircle2,
  Award,
  X,
  Calendar,
  Building2,
  Code2,
  Layers,
  Zap,
  FileText,
  Download,
  ZoomIn,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

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

const resolveFileType = (url) => {
  if (!url) return "link";
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".pdf") || url.includes("/raw/upload/")) return "pdf";
  if (
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(clean) ||
    url.includes("/image/upload/") ||
    url.includes("cloudinary")
  )
    return "image";
  return "link";
};

const rankColor = (rank) => {
  if (!rank) return null;
  const r = rank.toLowerCase();
  if (
    r.includes("1") ||
    r.includes("first") ||
    r.includes("winner") ||
    r.includes("gold")
  )
    return {
      bg: "rgba(251,191,36,0.12)",
      border: "rgba(251,191,36,0.35)",
      text: "#f59e0b",
      icon: "🥇",
    };
  if (r.includes("2") || r.includes("second") || r.includes("silver"))
    return {
      bg: "rgba(156,163,175,0.12)",
      border: "rgba(156,163,175,0.35)",
      text: "#9ca3af",
      icon: "🥈",
    };
  if (r.includes("3") || r.includes("third") || r.includes("bronze"))
    return {
      bg: "rgba(180,83,9,0.12)",
      border: "rgba(180,83,9,0.35)",
      text: "#b45309",
      icon: "🥉",
    };
  return {
    bg: "rgba(124,92,252,0.12)",
    border: "rgba(124,92,252,0.35)",
    text: "#a78bfa",
    icon: "🏆",
  };
};

const CertModal = ({ url, title, onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const ft = resolveFileType(url);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex flex-col rounded-2xl overflow-hidden"
          style={{
            maxWidth: 860,
            maxHeight: "92vh",
            background: "var(--bg-secondary)",
            border: "1px solid rgba(124,92,252,0.25)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--glass-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.25)",
                }}
              >
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Certificate
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#60a5fa",
                }}
              >
                <Download className="w-3 h-3" />{" "}
                {ft === "pdf" ? "Download PDF" : "Save Image"}
              </a>
              <button
                onClick={onClose}
                data-cursor-hover
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text-muted)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-auto" style={{ minHeight: 0 }}>
            {ft === "image" ? (
              <img
                src={url}
                alt={title}
                className="w-full rounded-xl object-contain max-h-[75vh] mx-auto"
              />
            ) : ft === "pdf" ? (
              <div className="relative h-[75vh]">
                {!loaded && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl"
                    style={{ background: "var(--bg-tertiary)" }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Loading PDF…
                    </p>
                  </div>
                )}
                <iframe
                  src={url}
                  title={title}
                  onLoad={() => setLoaded(true)}
                  className="w-full h-full rounded-xl"
                  style={{ border: "none" }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <FileText
                  className="w-12 h-12 opacity-20"
                  style={{ color: "var(--text-muted)" }}
                />
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className="btn-primary text-sm"
                >
                  Open Certificate ↗
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const HackathonModal = ({ h, onClose, onViewCert }) => {
  if (!h) return null;
  const rc = rankColor(h.rank);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl rounded-2xl overflow-hidden overflow-y-auto"
          style={{
            maxHeight: "90vh",
            background: "var(--bg-secondary)",
            border: "1px solid var(--glass-border)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,92,252,0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            {h.image ? (
              <img
                src={h.image}
                alt={h.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,92,252,0.25), rgba(192,132,252,0.15), rgba(6,214,160,0.1))",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Trophy
                    className="w-16 h-16 opacity-15"
                    style={{ color: "#7c5cfc" }}
                  />
                </div>
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--bg-secondary) 0%, transparent 55%)",
              }}
            />
            {h.featured && (
              <span
                className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(6,214,160,0.15)",
                  border: "1px solid rgba(6,214,160,0.3)",
                  color: "#06d6a0",
                  backdropFilter: "blur(8px)",
                }}
              >
                ✦ Featured
              </span>
            )}
          </div>
          <div className="px-7 pb-7 -mt-4">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex-1 min-w-0">
                {rc && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{
                      background: rc.bg,
                      border: `1px solid ${rc.border}`,
                      color: rc.text,
                    }}
                  >
                    {rc.icon} {h.rank}
                  </span>
                )}
                <h2
                  className="font-display text-2xl font-bold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {h.title}
                </h2>
                {h.organizer && (
                  <p
                    className="text-sm mt-1 flex items-center gap-1.5"
                    style={{ color: "var(--accent)" }}
                  >
                    <Building2 className="w-3.5 h-3.5" /> {h.organizer}
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0 mt-1">
                {h.github && (
                  <a
                    href={h.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {h.liveDemo && (
                  <a
                    href={h.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{
                      background: "rgba(124,92,252,0.1)",
                      border: "1px solid rgba(124,92,252,0.25)",
                      color: "#c084fc",
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  data-cursor-hover
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-muted)",
                    cursor: "none",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {h.year && (
              <p
                className="flex items-center gap-1.5 text-xs mt-2 mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                <Calendar className="w-3.5 h-3.5" /> {h.year}
              </p>
            )}
            <div
              className="h-px my-4"
              style={{ background: "var(--glass-border)" }}
            />
            {h.description && (
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {h.description}
              </p>
            )}
            {h.achievements?.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <h3
                    className="font-display font-bold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Achievements
                  </h3>
                </div>
                <ul className="space-y-2">
                  {h.achievements.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {h.techStack?.length > 0 && (
              <div className="mb-5">
                <div
                  className="h-px mb-4"
                  style={{ background: "var(--glass-border)" }}
                />
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ background: "#c084fc" }}
                  />
                  <h3
                    className="font-display font-bold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Tech Stack
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {h.techStack.map((t) => (
                    <span key={t} className="tag text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {h.certificateUrl && (
              <>
                <div
                  className="h-px mb-4"
                  style={{ background: "var(--glass-border)" }}
                />
                <button
                  data-cursor-hover
                  onClick={() => onViewCert(h)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.08))",
                    border: "1px solid rgba(251,191,36,0.3)",
                    color: "#f59e0b",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(251,191,36,0.18)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <Award className="w-4 h-4" /> View Certificate
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const HackathonCard = ({ h, index, onClick }) => {
  const rc = rankColor(h.rank);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onClick(h)}
      layout
      data-cursor-hover
      className="glass card-hover rounded-2xl overflow-hidden flex flex-col cursor-none group"
      style={{ position: "relative" }}
    >
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg,#7c5cfc,#c084fc,#06d6a0)" }}
      />
      <div
        className="relative h-40 overflow-hidden flex-shrink-0"
        style={{ background: "var(--bg-tertiary)" }}
      >
        {h.image ? (
          <img
            src={h.image}
            alt={h.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg,rgba(124,92,252,0.1),rgba(192,132,252,0.06))",
            }}
          >
            <Trophy
              className="w-12 h-12 opacity-15"
              style={{ color: "#7c5cfc" }}
            />
          </div>
        )}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
          }}
        >
          <span
            className="text-xs font-semibold px-4 py-2 rounded-full text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            style={{
              background: "rgba(124,92,252,0.85)",
              border: "1px solid rgba(192,132,252,0.4)",
            }}
          >
            View Details →
          </span>
        </div>
        {h.featured && (
          <span
            className="absolute top-2.5 left-2.5 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(6,214,160,0.15)",
              border: "1px solid rgba(6,214,160,0.3)",
              color: "#06d6a0",
              backdropFilter: "blur(8px)",
            }}
          >
            ✦ Featured
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {rc && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit"
            style={{
              background: rc.bg,
              border: `1px solid ${rc.border}`,
              color: rc.text,
            }}
          >
            {rc.icon} {h.rank}
          </span>
        )}
        <h3
          className="font-display font-bold text-lg leading-tight mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {h.title}
        </h3>
        {h.organizer && (
          <p
            className="text-xs flex items-center gap-1.5 mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            <Building2 className="w-3 h-3" /> {h.organizer}
          </p>
        )}
        {h.description && (
          <p
            className="text-sm line-clamp-2 flex-1 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {h.description}
          </p>
        )}
        {h.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {h.techStack.slice(0, 4).map((t) => (
              <span key={t} className="tag text-xs">
                {t}
              </span>
            ))}
            {h.techStack.length > 4 && (
              <span
                className="text-xs px-2 py-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                +{h.techStack.length - 4}
              </span>
            )}
          </div>
        )}
        <div
          className="flex items-center justify-between mt-4 pt-4 flex-wrap gap-2"
          style={{ borderTop: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center gap-3">
            {h.year && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <Calendar className="w-3 h-3" /> {h.year}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {h.github && (
              <a
                href={h.github}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-secondary)",
                }}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {h.liveDemo && (
              <a
                href={h.liveDemo}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(124,92,252,0.1)",
                  border: "1px solid rgba(124,92,252,0.2)",
                  color: "#c084fc",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {h.certificateUrl && (
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                title="Has certificate"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.25)",
                  color: "#f59e0b",
                }}
              >
                <Award className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PublicHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [certModal, setCertModal] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/hackathons")
      .then((res) => setHackathons(res.data?.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
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
  const openCert = (h) => {
    setSelected(null);
    setCertModal({ url: h.certificateUrl, title: h.title });
  };

  return (
    <div
      className="min-h-screen py-24 px-6"
      style={{ background: "var(--bg-primary)", cursor: "none" }}
    >
      <CustomCursor />
      <Helmet>
        <title>Hackathons | Portfolio</title>
      </Helmet>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="blob"
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(124,92,252,0.14),transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="blob"
          style={{
            position: "absolute",
            bottom: 0,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(192,132,252,0.08),transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <SectionBadge text="Competitions & Events" />

          {/* Heading */}
          <h1
            className="font-display text-5xl md:text-6xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="relative inline-block group">
              Hack
              <span className="grad-text">athons</span>
              {/* Underline for full word */}
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
            className="mt-3 max-w-md mx-auto text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {hackathons.length > 0
              ? `${hackathons.length} competitions — click any card for full details.`
              : "Competitions I've competed in, projects built under pressure, and rankings earned."}
          </p>
        </motion.div>

        {!loading && hackathons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-4 mb-14"
          >
            {[
              {
                val: hackathons.length,
                label: "Total Hackathons",
                icon: Trophy,
              },
              {
                val: hackathons.filter((h) => h.rank).length,
                label: "Ranked",
                icon: Award,
              },
              {
                val: hackathons.filter((h) => h.certificateUrl).length,
                label: "Certificates",
                icon: FileText,
              },
            ].map(({ val, label, icon: Icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="glass rounded-2xl p-4 text-center"
              >
                <Icon className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                <p className="font-display text-2xl font-bold grad-text">
                  {val}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="skeleton h-80 rounded-2xl" />
              ))}
          </div>
        ) : hackathons.length === 0 ? (
          <div
            className="text-center py-24 glass rounded-2xl"
            style={{ color: "var(--text-muted)" }}
          >
            <Trophy className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-display font-semibold">
              No hackathons added yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="grid"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {hackathons.map((h, i) => (
                <HackathonCard
                  key={h._id}
                  h={h}
                  index={i}
                  onClick={setSelected}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <HackathonModal
            h={selected}
            onClose={() => setSelected(null)}
            onViewCert={openCert}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {certModal && (
          <CertModal
            url={certModal.url}
            title={certModal.title}
            onClose={() => setCertModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicHackathons;
