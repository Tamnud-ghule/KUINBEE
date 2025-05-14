import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && <Sidebar />}
      <Topbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div 
        className="pt-20 pb-12 px-4 md:px-8 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}
      >
        {children}
      </div>
    </div>
  );
}
