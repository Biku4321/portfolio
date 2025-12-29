import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const endpoints = [
  "/projects",
  "/experience",
  "/education",
  "/skills",
  "/certificates",
  "/about",
  "/admin/me",
];

export default function AdminDebug() {
  const [results, setResults] = useState({});
  useEffect(() => {
    const run = async () => {
      const r = {};
      for (const ep of endpoints) {
        try {
          const res = await axiosInstance.get(ep);
          r[ep] = res.data;
        } catch (err) {
          r[ep] = { error: err.message };
        }
      }
      setResults(r);
    };
    run();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">API Debug</h2>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
