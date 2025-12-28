import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/certificates")
      .then(res => setCerts(res.data.data || res.data))
      .catch(err => console.error("Error fetching certificates:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading certificates...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Certificates
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {certs.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No certificates found.
            </p>
          ) : (
            certs.map((c, idx) => (
              <div key={c._id || idx} className="bg-white dark:bg-gray-800 p-6 rounded shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{c.issuer}</p>
                <p className="text-gray-500 dark:text-gray-400">{c.year}</p>
                
                {/* === FIX STARTS HERE === */}
                <a 
                  href={c.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show Certificate
                </a>
                {/* === FIX ENDS HERE === */}
                
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;