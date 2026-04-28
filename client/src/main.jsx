import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { HelmetProvider } from "react-helmet-async";
import { inject } from '@vercel/analytics'
inject()

ReactDOM.createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ToastProvider>
);
