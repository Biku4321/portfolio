import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axiosInstance";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // axiosInstance base already includes /api — call relative path
      const res = await axios.post("/admin/login", formData);
      // Expect token in res.data.token
      if (res.data?.token) {
        login(res.data.token, navigate);
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Email"
            disabled={loading}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Password"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
