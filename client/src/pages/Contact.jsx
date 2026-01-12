import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Helmet } from "react-helmet-async"; // SEO

const Contact = () => {
  const formRef = useRef();
  const toast = useToast?.(); // Optional toast
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ user_name: "", user_email: "", message: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.user_name) tempErrors.user_name = "Name is required";
    if (!formData.user_email) {
        tempErrors.user_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
        tempErrors.user_email = "Email is invalid";
    }
    if (!formData.message) tempErrors.message = "Message is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setFormData({ user_name: "", user_email: "", message: "" });
          if(toast?.pushToast) toast.pushToast({ type: "success", message: "Message sent successfully!" });
          else alert("Message sent!");
        },
        (error) => {
          setLoading(false);
          console.error("FAILED...", error.text);
          alert("Failed to send message. Please try again.");
        }
      );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Helmet>
        <title>Contact Me | Portfolio</title>
        <meta name="description" content="Get in touch with me for freelance projects or job opportunities." />
      </Helmet>

      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Get in Touch</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Have a project in mind? Let's discuss!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info Side */}
          <div className="space-y-6">
             <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                   <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>samantabikash83939@gmail.com</span>
             </div>
             <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                   <Phone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>+91 7810998349</span>
             </div>
             <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                   <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Silchar,Assam,India</span>
             </div>
          </div>

          {/* Form Side */}
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 border ${errors.user_name ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                placeholder="Your Name"
              />
              {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 border ${errors.user_email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                placeholder="you@example.com"
              />
              {errors.user_email && <p className="text-red-500 text-xs mt-1">{errors.user_email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 border ${errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                placeholder="How can I help you?"
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;