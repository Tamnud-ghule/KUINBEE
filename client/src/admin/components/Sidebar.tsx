import { Link } from "wouter";
import { LayoutDashboard, Database, TagIcon, LineChart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const { logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">DataSecure Admin</h1>
        
        <nav className="space-y-2">
          <SidebarLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink href="/admin/datasets" icon={<Database size={20} />} label="Datasets" />
          <SidebarLink href="/admin/categories" icon={<TagIcon size={20} />} label="Categories" />
          <SidebarLink href="/admin/sales" icon={<LineChart size={20} />} label="Sales" />
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const [currentPath] = location.pathname.split('/').filter(Boolean).slice(0, 2);
  const [targetPath] = href.split('/').filter(Boolean).slice(0, 2);
  
  const isActive = currentPath === targetPath;
  
  return (
    <Link href={href}>
      <div className={`flex items-center px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
}
