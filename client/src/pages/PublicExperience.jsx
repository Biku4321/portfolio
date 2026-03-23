// ── PublicExperience.jsx ──────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

const fallback = [
  { _id: "1", position: "Frontend Developer", company: "Example Co.", year: "2024", description: "Fallback item when API is unavailable." },
];

const PublicExperience = () => {
  const [items, setItems]     = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/experience")
      .then(res => setItems(res.data?.length ? res.data : fallback))
      .catch(() => setItems(fallback))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <div className="max-w-4xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="section-label">My journey</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">
            Work <span className="grad-text">Experience</span>
          </h1>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        ) : (
          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-px"
              style={{ background: "linear-gradient(to bottom, #7c5cfc, transparent)" }} />

            <div className="space-y-6">
              {items.map((item, i) => (
                <motion.div
                  key={item._id || item.position}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16,1,0.3,1] }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="absolute left-0 top-5 w-3 h-3 rounded-full -translate-x-[1.75rem]"
                    style={{ background: "#7c5cfc", boxShadow: "0 0 10px #7c5cfc" }} />

                  <div className="glass card-hover rounded-2xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-gray-100 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-purple-400" />
                          {item.position}
                        </h3>
                        <p className="text-purple-400 font-medium text-sm mt-0.5">{item.company}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <Calendar className="w-3 h-3" /> {item.year}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    {item.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {item.skills.map(s => <span key={s} className="tag text-xs">{s}</span>)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { PublicExperience as default };
