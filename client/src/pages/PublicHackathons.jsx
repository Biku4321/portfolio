import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Trophy, CheckCircle2, Tag } from "lucide-react";
import { Helmet } from "react-helmet-async";

const HackathonCard = ({ h, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="glass card-hover rounded-2xl overflow-hidden"
  >
    {/* Top accent */}
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
          <h3 className="font-display font-bold text-xl text-gray-100 leading-tight">{h.title}</h3>
          {h.organizer && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="text-gray-600">🏛️</span> {h.organizer}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {h.github && (
            <a href={h.github} target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-100 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Github className="w-4 h-4" />
            </a>
          )}
          {h.liveDemo && (
            <a href={h.liveDemo} target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.25)" }}>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {h.description && (
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{h.description}</p>
      )}

      {/* Divider */}
      <div className="h-px bg-white/5 mb-5" />

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
        <ul className="space-y-2">
          {h.achievements.map((ach, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{ach}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Year badge */}
      {h.year && (
        <div className="mt-5 pt-4 border-t border-white/5">
          <span className="text-xs text-gray-600">{h.year}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const PublicHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    axiosInstance.get("/hackathons")
      .then(res => setHackathons(res.data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <Helmet>
        <title>Hackathons | Portfolio</title>
        <meta name="description" content="My hackathon participations and achievements." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="section-label">Competitions & Events</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">
            Hack<span className="grad-text">athons</span>
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Competitions I've competed in, projects I've built under pressure, and rankings I've earned.
          </p>
        </motion.div>

        {/* Stats strip */}
        {!loading && hackathons.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-14">
            <div className="glass rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold grad-text">{hackathons.length}</p>
              <p className="text-xs text-gray-500 mt-1">Hackathons</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold grad-text">
                {hackathons.filter(h => h.rank).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Awards / Rankings</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold grad-text">
                {[...new Set(hackathons.flatMap(h => h.techStack || []))].length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Technologies Used</p>
            </div>
          </motion.div>
        )}

        {/* Cards grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No hackathons added yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {hackathons.map((h, i) => <HackathonCard key={h._id} h={h} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicHackathons;