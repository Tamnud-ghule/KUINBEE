import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Download, Search, CalendarRange } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminSales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  
  // Fetch all purchases with dataset and user details
  const { data: purchases, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/purchases"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Calculate total revenue
  const totalRevenue = purchases?.reduce((sum: number, purchase: any) => sum + purchase.amount, 0) || 0;
  
  // Filter purchases based on search and time range
  const getFilteredPurchases = () => {
    if (!purchases) return [];
    
    let filtered = [...purchases];
    
    // Apply time filter
    if (timeRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(
        (purchase) => new Date(purchase.purchaseDate) >= startDate
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (purchase) => 
          purchase.id.toString().includes(searchQuery) || 
          purchase.userId.toString().includes(searchQuery) || 
          purchase.datasetId.toString().includes(searchQuery)
      );
    }
    
    return filtered;
  };
  
  const filteredPurchases = getFilteredPurchases();
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!filteredPurchases.length) return [];
    
    // Group purchases by date
    const salesByDate = filteredPurchases.reduce((acc, purchase) => {
      const date = new Date(purchase.purchaseDate).toLocaleDateString();
      
      if (!acc[date]) {
        acc[date] = {
          date,
          sales: 0,
          revenue: 0,
        };
      }
      
      acc[date].sales += 1;
      acc[date].revenue += purchase.amount;
      
      return acc;
    }, {} as Record<string, { date: string; sales: number; revenue: number }>);
    
    return Object.values(salesByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  
  const chartData = prepareChartData();
  
  // Download sales report as CSV
  const downloadCSV = () => {
    if (!filteredPurchases.length) return;
    
    const headers = ["ID", "Date", "Dataset ID", "User ID", "Amount", "Status"];
    
    const csvContent = [
      headers.join(","),
      ...filteredPurchases.map(purchase => {
        return [
          purchase.id,
          new Date(purchase.purchaseDate).toLocaleDateString(),
          purchase.datasetId,
          purchase.userId,
          purchase.amount,
          purchase.status
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sales-report-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales & Revenue</h1>
            <p className="text-gray-500">Track and analyze your dataset sales.</p>
          </div>
          <Button 
            onClick={downloadCSV} 
            className="bg-gray-900 hover:bg-gray-800"
            disabled={!filteredPurchases.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-3xl font-bold mt-1">{filteredPurchases.length}</p>
            {timeRange !== "all" && (
              <p className="text-xs text-gray-500 mt-1">
                <CalendarRange className="inline h-3 w-3 mr-1" />
                {timeRange === "week" ? "Last 7 days" :
                 timeRange === "month" ? "Last 30 days" :
                 timeRange === "quarter" ? "Last 3 months" : "Last 12 months"}
              </p>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold mt-1">${totalRevenue.toFixed(2)}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg. Sale Value</h3>
            <p className="text-3xl font-bold mt-1">
              ${filteredPurchases.length ? (totalRevenue / filteredPurchases.length).toFixed(2) : "0.00"}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <Input
              type="search"
              placeholder="Search by ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full max-w-xs">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#374151" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available for the selected period
                </div>
              )}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Count</h3>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#374151" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available for the selected period
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sales Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading sales data...
                    </td>
                  </tr>
                ) : filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.datasetId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${purchase.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No sales found matching your search" : "No sales data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
