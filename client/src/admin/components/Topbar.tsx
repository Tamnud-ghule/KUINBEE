import { useAuth } from "@/hooks/use-auth";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";

type TopbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

export function Topbar({ onToggleSidebar, sidebarOpen }: TopbarProps) {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-10 h-16 px-4 md:px-6" style={{ left: sidebarOpen ? '16rem' : '0' }}>
      <div className="flex items-center justify-between h-full">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.username}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
