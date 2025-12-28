import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const fallback = [
  { _id: "1", position: "Frontend Developer", company: "Example Co.", year: "2024", description: "Fallback item when API is unavailable." }
];

const PublicExperience = () => {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/experience")
      .then((res) => setItems(res.data?.length ? res.data : fallback))
      .catch(() => setItems(fallback))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Experience</h2>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading…</p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item._id || item.position} className="rounded-2xl shadow p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xl font-semibold">{item.position}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.year}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{item.company}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicExperience;