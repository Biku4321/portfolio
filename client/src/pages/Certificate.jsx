import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Award,
  ExternalLink,
  Calendar,
  Building2,
  BadgeCheck,
  X,
  ZoomIn,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const resolveFileType = (url, stored) => {
  if (stored === "pdf") return "pdf";
  if (stored === "image") return "image";
  if (!url) return "link";
  const clean = url.split("?")[0].toLowerCase();
  // Cloudinary raw uploads contain /raw/upload/ in the URL
  if (clean.endsWith(".pdf") || url.includes("/raw/upload/")) return "pdf";
  if (
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(clean) ||
    url.includes("/image/upload/")
  )
    return "image";
  return "link";
};

// ─────────────────────────────────────────────────────────────────────────────
// Image modal
// ─────────────────────────────────────────────────────────────────────────────
const ImageModal = ({ url, title, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: 860,
          background: "var(--bg-secondary)",
          border: "1px solid rgba(124,92,252,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid var(--glass-border)" }}
        >
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </p>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-lg transition-colors"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <Download className="w-3 h-3" /> Save
            </a>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <img
            src={url}
            alt={title}
            className="w-full rounded-xl object-contain max-h-[72vh]"
          />
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// PDF modal — direct iframe to Cloudinary raw URL (correct Content-Type)
// ─────────────────────────────────────────────────────────────────────────────
const PdfModal = ({ url, title, onClose }) => {
  const [status, setStatus] = useState("loading"); // loading | ok | error

  // The iframe src IS the raw Cloudinary URL.
  // Cloudinary raw assets are served with Content-Type: application/pdf
  // so the browser's native PDF viewer handles it — no third-party viewer needed.
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3"
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col w-full rounded-2xl overflow-hidden"
          style={{
            maxWidth: 920,
            height: "93vh",
            background: "var(--bg-secondary)",
            border: "1px solid rgba(124,92,252,0.25)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--glass-border)" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <p
                className="font-semibold text-sm truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-lg transition-colors"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <Download className="w-3 h-3" /> Download
              </a>
              <button
                onClick={onClose}
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex-1" style={{ minHeight: 0 }}>
            {/* Spinner */}
            {status === "loading" && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Loading PDF…
                </p>
              </div>
            )}

            {/* Error fallback */}
            {status === "error" && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-8"
                style={{ background: "var(--bg-secondary)" }}
              >
                <AlertCircle className="w-10 h-10 text-red-400 opacity-70" />
                <div className="text-center">
                  <p
                    className="font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Preview unavailable
                  </p>
                  <p
                    className="text-sm mb-5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Your browser blocked the inline PDF viewer.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Open / Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* Direct iframe — works when Cloudinary serves raw PDF correctly */}
            <iframe
              key={url}
              src={url}
              title={title}
              onLoad={() => setStatus("ok")}
              onError={() => setStatus("error")}
              className="w-full h-full"
              style={{
                border: "none",
                display: status === "error" ? "none" : "block",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Certificate card
// ─────────────────────────────────────────────────────────────────────────────
const CertCard = ({ cert: c, index, onView }) => {
  const issuerName = c.issuer || c.authority;
  const fileType = resolveFileType(c.url, c.fileType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="glass card-hover rounded-2xl overflow-hidden flex flex-col"
    >
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg,#7c5cfc,#c084fc,#06d6a0)" }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(124,92,252,0.12)",
              border: "1px solid rgba(124,92,252,0.2)",
            }}
          >
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: "rgba(6,214,160,0.1)",
              border: "1px solid rgba(6,214,160,0.25)",
              color: "#06d6a0",
            }}
          >
            <BadgeCheck className="w-3 h-3" /> Verified
          </span>
        </div>

        <h3
          className="font-display font-bold text-base leading-tight mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {c.title}
        </h3>

        <div className="space-y-1.5 mt-1 flex-1">
          {issuerName && (
            <p className="flex items-center gap-2 text-sm text-purple-400 font-medium">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" /> {issuerName}
            </p>
          )}
          {c.year && (
            <p
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <Calendar className="w-3 h-3 flex-shrink-0" /> {c.year}
            </p>
          )}
          {c.description && (
            <p
              className="text-xs leading-relaxed mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              {c.description}
            </p>
          )}
        </div>

        {c.url && (
          <button
            onClick={() => onView(c.url, fileType, c.title)}
            data-cursor-hover
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group"
          >
            {fileType === "pdf" ? (
              <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            ) : fileType === "image" ? (
              <ZoomIn className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            {fileType === "pdf"
              ? "View Certificate (PDF)"
              : fileType === "image"
                ? "View Certificate"
                : "Open Certificate"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/certificates")
      .then((res) => setCerts(res.data?.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getIssuer = (c) => c.issuer || c.authority;
  const issuers = ["All", ...new Set(certs.map(getIssuer).filter(Boolean))];
  const displayed =
    filter === "All" ? certs : certs.filter((c) => getIssuer(c) === filter);

  const openModal = (url, fileType, title) => {
    if (fileType === "link") {
      window.open(url, "_blank", "noreferrer");
      return;
    }
    setModal({ url, fileType, title });
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
  return (
    <div
      className="min-h-screen py-24 px-6"
      style={{ cursor: "none", background: "var(--bg-primary)" }}
    >
      <Helmet>
        <title>Certificates | Portfolio</title>
        <meta
          name="description"
          content="My professional certifications and achievements."
        />
      </Helmet>

      {/* Custom cursor */}
      <CustomCursor />

      {modal?.fileType === "image" && (
        <ImageModal
          url={modal.url}
          title={modal.title}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.fileType === "pdf" && (
        <PdfModal
          url={modal.url}
          title={modal.title}
          onClose={() => setModal(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <SectionBadge text="Credentials" />

          {/* Heading */}
          <h1
            className="font-display text-5xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My{" "}
            <span className="grad-text relative inline-block group">
              Certificates
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: "linear-gradient(90deg,#7c5cfc,#c084fc)" }}
              />
            </span>
          </h1>

          {/* Description */}
          <p
            className="mt-3 max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Professional certifications validating my skills and expertise.
          </p>
        </motion.div>

        {issuers.length > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {issuers.map((iss) => (
              <button
                key={iss}
                onClick={() => setFilter(iss)}
                data-cursor-hover
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  filter === iss
                    ? {
                        background: "var(--accent)",
                        color: "#fff",
                        boxShadow: "0 0 20px rgba(124,92,252,0.4)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#9ca3af",
                      }
                }
              >
                {iss}
              </button>
            ))}
          </motion.div>
        )}

        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Showing {displayed.length} certificate
            {displayed.length !== 1 ? "s" : ""}
          </motion.p>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="skeleton h-52 rounded-2xl" />
              ))}
          </div>
        ) : displayed.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--text-muted)" }}
          >
            <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No certificates found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayed.map((c, i) => (
              <CertCard
                key={c._id || i}
                cert={c}
                index={i}
                onView={openModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
