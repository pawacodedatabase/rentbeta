import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminNavbar from "./adminnavbar";
import AdminBottomNav from "./bottomNav";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        <AdminNavbar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>

              < AdminBottomNav/>
        
      </div>
    </div>
  );
}