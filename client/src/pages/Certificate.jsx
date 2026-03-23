import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, Building2, BadgeCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";

const CertCard = ({ cert: c, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="glass card-hover rounded-2xl overflow-hidden flex flex-col"
  >
    {/* Top accent bar */}
    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #7c5cfc, #c084fc, #06d6a0)" }} />

    <div className="p-6 flex flex-col flex-1">
      {/* Icon + verified badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.2)" }}
        >
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <span
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.25)", color: "#06d6a0" }}
        >
          <BadgeCheck className="w-3 h-3" /> Verified
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-base text-gray-100 leading-tight mb-2">
        {c.title}
      </h3>

      {/* Meta */}
      <div className="space-y-1.5 mt-1 flex-1">
        {c.issuer && (
          <p className="flex items-center gap-2 text-sm text-purple-400 font-medium">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" /> {c.issuer}
          </p>
        )}
        {c.year && (
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3 flex-shrink-0" /> {c.year}
          </p>
        )}
        {c.description && (
          <p className="text-xs text-gray-500 leading-relaxed mt-2">{c.description}</p>
        )}
      </div>

      {/* CTA */}
      {c.url && (
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group"
        >
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          View Certificate
        </a>
      )}
    </div>
  </motion.div>
);

const Certificates = () => {
  const [certs, setCerts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    axiosInstance.get("/certificates")
      .then(res => setCerts(res.data?.data || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const issuers  = ["All", ...new Set(certs.map(c => c.issuer).filter(Boolean))];
  const displayed = filter === "All" ? certs : certs.filter(c => c.issuer === filter);

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <Helmet>
        <title>Certificates | Portfolio</title>
        <meta name="description" content="My professional certifications and achievements." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="section-label">Credentials</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">
            My <span className="grad-text">Certificates</span>
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Professional certifications validating my skills and expertise.
          </p>
        </motion.div>

        {/* Issuer filter */}
        {issuers.length > 2 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {issuers.map(iss => (
              <button
                key={iss}
                onClick={() => setFilter(iss)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={filter === iss
                  ? { background: "var(--accent)", color: "#fff", boxShadow: "0 0 20px rgba(124,92,252,0.4)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }
                }
              >
                {iss}
              </button>
            ))}
          </motion.div>
        )}

        {/* Count badge */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-center text-xs text-gray-600 mb-8"
          >
            Showing {displayed.length} certificate{displayed.length !== 1 ? "s" : ""}
          </motion.p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No certificates found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayed.map((c, i) => (
              <CertCard key={c._id || i} cert={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
