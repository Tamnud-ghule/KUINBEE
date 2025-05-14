import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Database, ShoppingCart, Users, DollarSign, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Purchase, Dataset, Category } from "@your-scope/shared";

export default function AdminDashboard() {
  // Fetch datasets
  const { data: datasets } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch purchases
  const { data: purchases } = useQuery<Purchase[]>({
    queryKey: ["/api/admin/purchases"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Calculate dashboard statistics
  const stats = {
    datasets: datasets?.length || 0,
    categories: categories?.length || 0,
    sales: purchases?.length || 0,
    revenue: purchases?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0,
  };

  // Get recent activity (purchases)
  const recentActivity = purchases
    ?.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome to the DataSecure admin dashboard.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Datasets" 
            value={stats.datasets} 
            icon={<Database className="h-6 w-6" />} 
            color="bg-blue-50 text-blue-700"
          />
          <StatCard 
            title="Categories" 
            value={stats.categories} 
            icon={<Database className="h-6 w-6" />} 
            color="bg-purple-50 text-purple-700"
          />
          <StatCard 
            title="Total Sales" 
            value={stats.sales} 
            icon={<ShoppingCart className="h-6 w-6" />} 
            color="bg-green-50 text-green-700"
          />
          <StatCard 
            title="Revenue" 
            value={`$${stats.revenue.toFixed(2)}`} 
            icon={<DollarSign className="h-6 w-6" />} 
            color="bg-yellow-50 text-yellow-700"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          Dataset #{purchase.datasetId}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          User #{purchase.userId}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          ${purchase.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        No recent activity found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Quick Tasks
            </h2>
            <div className="space-y-3">
              <QuickTask 
                title="Add New Dataset" 
                description="Upload a new dataset to the marketplace" 
                href="/admin/datasets/new" 
              />
              <QuickTask 
                title="Create Category" 
                description="Add a new category for datasets" 
                href="/admin/categories/new" 
              />
              <QuickTask 
                title="View Sales Report" 
                description="See detailed sales analytics" 
                href="/admin/sales" 
              />
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
};

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

type QuickTaskProps = {
  title: string;
  description: string;
  href: string;
};

function QuickTask({ title, description, href }: QuickTaskProps) {
  return (
    <a 
      href={href} 
      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  );
}
