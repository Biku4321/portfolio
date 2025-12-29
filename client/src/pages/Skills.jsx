import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { BadgeCheck } from "lucide-react";

const PublicSkills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/skills")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setSkills(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to fetch skills:", err));
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <h2 className="text-4xl font-bold mb-8 text-center">Skills</h2>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">
              {category || "Other"}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((skill) => (
                <div
                  key={skill._id}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 shadow-sm"
                >
                  <BadgeCheck className="text-green-500 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {skill.name}
                    {skill.level && (
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        ({skill.level})
                      </span>
                    )}
                  </span>
                  {skill.icon && (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-5 h-5 ml-auto"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicSkills;
