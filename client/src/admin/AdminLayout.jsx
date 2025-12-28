import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;