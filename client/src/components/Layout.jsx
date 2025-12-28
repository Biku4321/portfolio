import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="pt-16"> {/* nav height = 64px */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

