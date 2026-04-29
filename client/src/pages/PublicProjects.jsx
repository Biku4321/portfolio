import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ExternalLink,
  Github,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Layers,
  Server,
  Database,
  Cloud,
} from "lucide-react";
import SEOHead from "../components/SEOHead";

// ── Custom Cursor ─────────────────────────────────────────────────────────────
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

const pageSizes = [6, 12, 24];

/* ── Project Detail Modal ─────────────────────────────────────────── */
const ProjectModal = ({ project: p, onClose }) => {
  if (!p) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--glass-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header image */}
          {p.image && (
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 30%, var(--bg-secondary))",
                }}
              />
            </div>
          )}

          <div className="p-7">
            {/* Title + close */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                {p.featured && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full mb-2"
                    style={{
                      background: "rgba(6,214,160,0.1)",
                      color: "#06d6a0",
                      border: "1px solid rgba(6,214,160,0.25)",
                    }}
                  >
                    ✦ Featured
                  </span>
                )}
                <h2
                  className="font-display text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.title}
                </h2>
                {p.category && (
                  <p className="text-sm text-purple-400 mt-1">{p.category}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {p.github && (
                  <a
  href={p.github}
  target="_blank"
  rel="noreferrer"
  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
  style={{
    color: "var(--text-secondary)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {p.liveDemo && (
                  <a
                    href={p.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all"
                    style={{
                      background: "rgba(124,92,252,0.1)",
                      border: "1px solid rgba(124,92,252,0.25)",
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
  onClick={onClose}
  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
  style={{
    color: "var(--text-muted)",
    background: "rgba(255,255,255,0.04)"
  }}
>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mt-4 mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {p.description}
            </p>

            {/* Key Features / highlights */}
            {p.impact && Object.values(p.impact).some(Boolean) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ background: "#7c5cfc" }}
                  />
                  <h3
                    className="font-display font-bold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Key Features
                  </h3>
                </div>
                <ul className="space-y-2">
                  {[
                    p.impact.performanceImprovement,
                    p.impact.userEngagement,
                    p.impact.businessValue,
                  ]
                    .filter(Boolean)
                    .map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/5 mb-6" />

            {/* Technologies Used */}
            {p.tech?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ background: "#c084fc" }}
                  />
                  <h3
                    className="font-display font-bold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Technologies Used
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="tag text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture */}
            {p.architecture &&
              Object.values(p.architecture).some(
                (v) => v && (Array.isArray(v) ? v.length : true),
              ) && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-1 h-4 rounded-full"
                      style={{ background: "#06d6a0" }}
                    />
                    <h3
                      className="font-display font-bold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Architecture
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {p.architecture.frontend?.length > 0 && (
                      <div
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Frontend
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.architecture.frontend.map((f) => (
                            <span
                              key={f}
                              className="text-xs px-2 py-0.5 rounded-md"
                              style={{ color: "var(--text-secondary)" }}
                              style={{ background: "rgba(124,92,252,0.08)" }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {p.architecture.backend?.length > 0 && (
                      <div
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Server className="w-3.5 h-3.5 text-blue-400" />
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Backend
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.architecture.backend.map((b) => (
                            <span
                              key={b}
                              className="text-xs px-2 py-0.5 rounded-md"
                              style={{ color: "var(--text-secondary)" }}
                              style={{ background: "rgba(96,165,250,0.08)" }}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {p.architecture.database && (
                      <div
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Database className="w-3.5 h-3.5 text-emerald-400" />
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Database
                          </span>
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {p.architecture.database}
                        </p>
                      </div>
                    )}
                    {p.architecture.deployment && (
                      <div
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Cloud className="w-3.5 h-3.5 text-amber-400" />
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Deployment
                          </span>
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {p.architecture.deployment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Project Card ─────────────────────────────────────────────────── */
const ProjectCard = ({ project: p, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    layout
    className="glass card-hover rounded-2xl overflow-hidden flex flex-col cursor-pointer"
    onClick={() => onClick(p)}
  >
    <div className="relative h-44 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: "linear-gradient(135deg,#7c5cfc,#c084fc)" }}
      />
      {p.image ? (
        <img
          src={p.image}
          alt={p.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-display text-4xl font-bold grad-text opacity-40">
            {p.title?.charAt(0)}
          </span>
        </div>
      )}
      {p.featured && (
        <span
          className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full text-emerald-400"
          style={{
            background: "rgba(6,214,160,0.15)",
            border: "1px solid rgba(6,214,160,0.3)",
          }}
        >
          ✦ Featured
        </span>
      )}
      {/* Click hint */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: "rgba(0,0,0,0.45)" }}
      >
        <span
          className="text-xs text-white font-medium px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(124,92,252,0.8)",
            border: "1px solid rgba(124,92,252,0.5)",
          }}
        >
          View Details →
        </span>
      </div>
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3
        className="font-display font-semibold text-base mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {p.title}
      </h3>
      <p
        className="text-sm line-clamp-2 flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {p.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
        {(p.tech || []).slice(0, 4).map((t) => (
          <span key={t} className="tag text-xs">
            {t}
          </span>
        ))}
        {(p.tech || []).length > 4 && (
          <span className="text-xs px-1" style={{ color: "var(--text-muted)" }}>
            +{p.tech.length - 4}
          </span>
        )}
      </div>
      <div className="flex gap-4 pt-3 border-t border-white/5">
        {p.liveDemo && (
          <a
            href={p.liveDemo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
          </a>
        )}
        {p.github && (
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs transition-colors font-medium"
            style={{ color: "var(--text-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-3.5 h-3.5" /> Source
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

/* ── Main Page ────────────────────────────────────────────────────── */
const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null); // for modal
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

  const fetchProjects = async (opts = {}) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (featuredOnly) q.set("featured", "true");
      if (selectedTags.length) q.set("tags", selectedTags.join(","));
      q.set("page", opts.page ?? page);
      q.set("limit", opts.limit ?? limit);
      q.set("sort", sort);
      const res = await axiosInstance.get("/projects?" + q.toString());
      const data = res.data?.data || [];
      setProjects(data);
      setTotal(res.data?.meta?.total || data.length);
      const allTags = new Set();
      data.forEach((p) => (p.tech || []).forEach((t) => allTags.add(t)));
      setTags([...allTags]);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects({ page: 1 });
  }, []);
  const totalPages = Math.ceil(total / limit);

  return (
    <div
      className="min-h-screen py-24 px-6"
      style={{ cursor: "none", background: "var(--bg-primary)" }}
    >
      <SEOHead title="Projects - Portfolio" description="My projects" />
      {/* Custom cursor */}
      <CustomCursor />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          {/* Badge (replace section-label) */}
          <SectionBadge text="What I've built" />

          {/* Heading with underline effect */}
          <h1
            className="font-display text-5xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My{" "}
            <span className="grad-text relative inline-block group">
              Projects
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{
                  background: "linear-gradient(90deg,#7c5cfc,#c084fc)",
                }}
              />
            </span>
          </h1>

          {/* Description */}
          <p className="mt-3" style={{ color: "var(--text-muted)" }}>
            {total} projects — click any card for full details.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <div className="relative flex-1 min-w-52">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProjects({ page: 1 })}
              placeholder="Search projects..."
              className="input-field pl-9 text-sm"
            />
          </div>
          <button
            onClick={() => fetchProjects({ page: 1 })}
            className="btn-primary text-sm"
          >
            <Search className="w-4 h-4" /> Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline text-sm"
            style={
              showFilters
                ? { borderColor: "rgba(124,92,252,0.4)", color: "#c084fc" }
                : {}
            }
          >
            <Filter className="w-4 h-4" /> Filters{" "}
            {selectedTags.length > 0 && `(${selectedTags.length})`}
          </button>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              fetchProjects({ page: 1 });
            }}
            className="input-field text-sm px-3 py-2 w-auto"
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest</option>
            <option value="alpha">A → Z</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(+e.target.value);
              fetchProjects({ page: 1, limit: +e.target.value });
            }}
            className="input-field text-sm px-3 py-2 w-auto"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s} per page
              </option>
            ))}
          </select>
        </motion.div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass rounded-2xl p-5">
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => {
                      setFeaturedOnly(e.target.checked);
                      fetchProjects({ page: 1 });
                    }}
                    className="w-4 h-4 rounded accent-purple-500"
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Featured only
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        const s = selectedTags.includes(t)
                          ? selectedTags.filter((x) => x !== t)
                          : [...selectedTags, t];
                        setSelectedTags(s);
                        fetchProjects({ page: 1 });
                      }}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                      style={
                        selectedTags.includes(t)
                          ? { background: "var(--accent)", color: "#fff" }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#9ca3af",
                            }
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="skeleton h-72 rounded-2xl" />
              ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--text-muted)" }}
          >
            No projects found. Try changing filters.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={page + sort + search}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((p, i) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  index={i}
                  onClick={setSelected}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-10 flex-wrap gap-4">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Showing {projects.length} of {total} projects
            </p>
            <div className="flex items-center gap-2">
              <button
  onClick={() => {
    const p = page - 1;
    setPage(p);
    fetchProjects({ page: p });
  }}
  disabled={page <= 1}
  className="p-2 rounded-xl disabled:opacity-30 transition-all"
  style={{
    color: "var(--text-secondary)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPage(p);
                      fetchProjects({ page: p });
                    }}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                    style={
                      p === page
                        ? { background: "var(--accent)", color: "#fff" }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            color: "#9ca3af",
                          }
                    }
                  >
                    {p}
                  </button>
                ))}
              <button
  onClick={() => {
    const p = page + 1;
    setPage(p);
    fetchProjects({ page: p });
  }}
  disabled={page >= totalPages}
  className="p-2 rounded-xl disabled:opacity-30 transition-all"
  style={{
    color: "var(--text-secondary)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Project detail modal */}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default PublicProjects;
