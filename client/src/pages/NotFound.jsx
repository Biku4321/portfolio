// ── NotFound.jsx ─────────────────────────────────────────────────────────────
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      {/* Ambient blob */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
          style={{ background: "radial-gradient(circle, #7c5cfc, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-md"
      >
        <p className="font-display text-9xl font-bold grad-text mb-4 leading-none">404</p>
        <h1 className="font-display text-3xl font-bold text-gray-100 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-outline">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate("/")} className="btn-primary">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
