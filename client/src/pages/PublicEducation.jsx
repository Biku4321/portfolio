import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, CheckCircle2 } from "lucide-react";

const EducationCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="rounded-2xl overflow-hidden"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    <div className="p-7">
      {/* Top row: degree + year/grade badges */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-gray-100 leading-snug mb-2">
            {item.degree}
          </h3>

          {/* Institution */}
          <p className="flex items-center gap-1.5 text-sm text-purple-400 font-medium mb-1">
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            {item.institution}
          </p>

          {/* Location */}
          {item.location && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {item.location}
            </p>
          )}
        </div>

        {/* Right badges — year + CGPA */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {item.year && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(124,92,252,0.15)", color: "#c084fc", border: "1px solid rgba(124,92,252,0.25)" }}>
              {item.year}
            </span>
          )}
          {item.grade && (
            <span className="text-sm font-bold" style={{ color: "#06d6a0" }}>
              CGPA: {item.grade}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{item.description}</p>
      )}

      {/* Divider */}
      <div className="h-px bg-white/5 mb-5" />

      {/* Highlight bullets (checkmark list) */}
      {item.highlights?.length > 0 && (
        <ul className="space-y-2.5 mb-5">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Coursework tags */}
      {item.courses?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.courses.map((c, i) => (
            <span key={i} className="tag text-xs">{c}</span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const PublicEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axiosInstance.get("/education")
      .then(res => setEducation(res.data?.data ?? res.data ?? []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="section-label">Academic background</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">
            My <span className="grad-text">Education</span>
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            The academic foundations that shaped my technical thinking.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-5">
            {Array(2).fill(0).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
          </div>
        ) : education.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No education data found.</div>
        ) : (
          <div className="space-y-5">
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