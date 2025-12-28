import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { GraduationCap } from "lucide-react";

const PublicEducation = () => {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    axios
      .get("/education")
      .then((res) => setEducation(res.data))
      .catch((err) => console.error("Failed to fetch education:", err));
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <h2 className="text-4xl font-bold mb-10 text-center flex items-center justify-center gap-2">
        <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        Education
      </h2>

      <div className="space-y-6">
        {education.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-2xl font-semibold mb-1">{item.degree}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {item.institution} &middot; {item.year}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicEducation;
