import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Trophy, CheckCircle2, Award, X, ZoomIn } from "lucide-react";
import { Helmet } from "react-helmet-async";

/* ── Certificate Viewer Modal ─────────────────────────────────────── */
const CertificateModal = ({ url, title, onClose }) => {
  const isPdf = url?.toLowerCase().includes(".pdf");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
          style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(251,191,36,0.1)" }}>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-gray-100">Certificate</p>
                <p className="text-xs text-gray-500">{title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                style={{ background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.3)", color: "#c084fc" }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in new tab
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-2" style={{ maxHeight: "75vh", overflow: "auto" }}>
            {isPdf ? (
              <iframe
                src={url}
                title={`Certificate - ${title}`}
                className="w-full rounded-lg"
                style={{ height: "65vh", border: "none" }}
              />
            ) : (
              <img
                src={url}
                alt={`Certificate - ${title}`}
                className="w-full rounded-lg object-contain"
                style={{ maxHeight: "65vh" }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Hackathon Card ───────────────────────────────────────────────── */
const HackathonCard = ({ h, index, onViewCert }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="glass card-hover rounded-2xl overflow-hidden"
  >
    {/* Top accent bar */}
    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#7c5cfc,#c084fc,#06d6a0)" }} />

    <div className="p-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          {h.rank && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3"
              style={{ background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.3)", color: "#c084fc" }}>
              🏆 {h.rank}
            </span>
          )}
          <h3 className="font-display font-bold text-xl leading-tight" style={{ color: "var(--text-primary)" }}>
            {h.title}
          </h3>
          {h.organizer && (
            <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              🏛️ {h.organizer}
            </p>
          )}
        </div>

        {/* Action icons */}
        <div className="flex gap-2 flex-shrink-0">
          {h.github && (
            <a href={h.github} target="_blank" rel="noreferrer"
              title="View Code"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}>
              <Github className="w-4 h-4" />
            </a>
          )}
          {h.liveDemo && (
            <a href={h.liveDemo} target="_blank" rel="noreferrer"
              title="Live Demo"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.25)", color: "#c084fc" }}>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {h.description && (
        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
          {h.description}
        </p>
      )}

      <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Tech stack */}
      {h.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {h.techStack.map(t => (
            <span key={t} className="tag text-xs">{t}</span>
          ))}
        </div>
      )}

      {/* Achievements */}
      {h.achievements?.length > 0 && (
        <ul className="space-y-2 mb-5">
          {h.achievements.map((ach, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{ach}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer: year + View Certificate button */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {h.year ? (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{h.year}</span>
        ) : <span />}

        {/* ✅ View Certificate button — only shows if certificateUrl exists */}
        {h.certificateUrl && (
          <button
            onClick={() => onViewCert(h)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))",
              border: "1px solid rgba(251,191,36,0.3)",
              color: "#f59e0b",
              boxShadow: "0 0 0 0 rgba(251,191,36,0)",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(251,191,36,0.2)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 0 rgba(251,191,36,0)"}
          >
            <Award className="w-3.5 h-3.5" />
            View Certificate
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

/* ── Main Page ────────────────────────────────────────────────────── */
const PublicHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [certModal, setCertModal]   = useState(null); // { url, title }

  useEffect(() => {
    axiosInstance.get("/hackathons")
      .then(res => setHackathons(res.data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openCert  = h => setCertModal({ url: h.certificateUrl, title: h.title });
  const closeCert = ()  => setCertModal(null);

  return (
    <div className="min-h-screen py-24 px-6" style={{ background: "var(--bg-primary)" }}>
      <Helmet>
        <title>Hackathons | Portfolio</title>
        <meta name="description" content="My hackathon participations and achievements." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="section-label">Competitions & Events</p>
          <h1 className="font-display text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
            Hack<span className="grad-text">athons</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Competitions I've competed in, projects built under pressure, and rankings earned.
          </p>
        </motion.div>

        {/* Stats strip */}
        {!loading && hackathons.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-14">
            {[
              { val: hackathons.length,                                    label: "Hackathons" },
              { val: hackathons.filter(h => h.rank).length,               label: "Rankings" },
              { val: hackathons.filter(h => h.certificateUrl).length,     label: "Certificates" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <p className="font-display text-2xl font-bold grad-text">{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No hackathons added yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {hackathons.map((h, i) => (
              <HackathonCard key={h._id} h={h} index={i} onViewCert={openCert} />
            ))}
          </div>
        )}
      </div>

      {/* Certificate modal */}
      {certModal && (
        <CertificateModal
          url={certModal.url}
          title={certModal.title}
          onClose={closeCert}
        />
      )}
    </div>
  );
};

export default PublicHackathons;
