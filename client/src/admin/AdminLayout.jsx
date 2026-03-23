import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-950 text-gray-100 flex">
    <Sidebar />
    <main
      className="flex-1 overflow-auto p-8"
      style={{ background: "#09090f" }}
    >
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
