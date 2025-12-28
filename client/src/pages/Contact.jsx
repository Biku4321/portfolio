import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import SEOHead from "../components/SEOHead";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errorText, setErrorText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorText("");
    try {
      const res = await axios.post("/contact", form);
      const success = res.data?.success ?? true;
      if (success) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorText(res.data?.message || "Server rejected the request");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorText(err?.response?.data?.message || "Network or server error");
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto">
      <SEOHead title="Contact - Portfolio" description="Contact me" />
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          required
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
      </form>

      {status === "sent" && <p className="text-green-600 mt-3">Message sent!</p>}
      {status === "error" && (
        <p className="text-red-600 mt-3">Failed to send. {errorText ? `Error: ${errorText}` : ""}</p>
      )}
    </div>
  );
};

export default Contact;
