import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Dataset, Category } from "@your-scope/shared";
import { Pencil, Trash2, Search, Plus, BarChart, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export default function AdminDatasets() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    categoryId: "",
    recordCount: 0,
    dataFormat: "",
    updateFrequency: "",
    previewAvailable: false,
    filePath: ""
  });

  // Fetch datasets
  const { data: datasets, isLoading } = useQuery<any[]>({
    queryKey: ["/api/datasets"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch categories for the dropdown
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Create/update dataset mutation
  const saveDatasetMutation = useMutation({
    mutationFn: async (datasetData: any) => {
      // Convert numeric fields from string to number
      const formattedData = {
        ...datasetData,
        price: parseFloat(datasetData.price.toString()),
        recordCount: datasetData.recordCount ? parseInt(datasetData.recordCount.toString()) : null,
        categoryId: parseInt(datasetData.categoryId.toString())
      };

      if (editingDataset) {
        await apiRequest("PUT", `/api/admin/datasets/${editingDataset.id}`, formattedData);
      } else {
        await apiRequest("POST", "/api/admin/datasets", formattedData);
      }
    },
    onSuccess: () => {
      toast({
        title: editingDataset ? "Dataset updated" : "Dataset created",
        description: editingDataset
          ? "The dataset has been updated successfully."
          : "The dataset has been added successfully.",
      });
      // Reset form and close dialog
      resetForm();
      setDialogOpen(false);
      // Invalidate and refetch datasets
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save dataset",
        variant: "destructive",
      });
    },
  });

  // Delete dataset mutation
  const deleteDatasetMutation = useMutation({
    mutationFn: async (datasetId: number) => {
      await apiRequest("DELETE", `/api/admin/datasets/${datasetId}`);
    },
    onSuccess: () => {
      toast({
        title: "Dataset deleted",
        description: "The dataset has been removed successfully.",
      });
      // Invalidate and refetch datasets
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to delete dataset";
      
      // Handle foreign key constraint errors for purchased datasets
      if (error.status === 409) {
        errorMessage = error.message || "Cannot delete dataset that has been purchased by users";
      } else {
        errorMessage = error.message || "Failed to delete dataset";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      categoryId: "",
      recordCount: 0,
      dataFormat: "",
      updateFrequency: "",
      previewAvailable: false,
      filePath: ""
    });
    setEditingDataset(null);
  };

  // Handle dataset edit
  const handleEditDataset = (dataset: Dataset) => {
    setEditingDataset(dataset);
    setFormData({
      title: dataset.title,
      description: dataset.description || "",
      price: dataset.price,
      categoryId: dataset.categoryId ? dataset.categoryId.toString() : "",
      recordCount: dataset.recordCount || 0,
      dataFormat: dataset.dataFormat || "",
      updateFrequency: dataset.updateFrequency || "",
      previewAvailable: dataset.previewAvailable || false,
      filePath: dataset.filePath || ""
    });
    setDialogOpen(true);
  };

  // Handle dataset deletion
  const handleDeleteDataset = (id: number) => {
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      deleteDatasetMutation.mutate(id);
    }
  };

  // Handle form submission
  const handleSaveDataset = (e: React.FormEvent) => {
    e.preventDefault();
    saveDatasetMutation.mutate(formData);
  };

  // Update form data
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Filter datasets based on search query
  const filteredDatasets = datasets?.filter(
    (dataset) =>
      dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dataset.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Datasets</h1>
            <p className="text-gray-500">Manage available datasets.</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dataset
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <Input
            type="search"
            placeholder="Search datasets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Datasets Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading datasets...
                    </td>
                  </tr>
                ) : filteredDatasets && filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <tr key={dataset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dataset.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(dataset.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.recordCount || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.dataFormat || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => handleEditDataset(dataset)}
                            size="sm"
                            variant="outline"
                            className="text-xs h-8"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteDataset(dataset.id)}
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 text-red-500 border-red-200 hover:bg-red-50"
                            disabled={deleteDatasetMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No datasets found matching your search" : "No datasets found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Dataset Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingDataset ? "Edit Dataset" : "Add New Dataset"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveDataset}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Financial Markets Data 2023"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Comprehensive dataset covering global financial markets..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleFormChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleFormChange("price", parseFloat(e.target.value))}
                  placeholder="99.99"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recordCount">Number of Records</Label>
                <Input
                  id="recordCount"
                  type="number"
                  min="0"
                  value={formData.recordCount}
                  onChange={(e) => handleFormChange("recordCount", parseInt(e.target.value))}
                  placeholder="10000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataFormat">Data Format</Label>
                <Input
                  id="dataFormat"
                  value={formData.dataFormat}
                  onChange={(e) => handleFormChange("dataFormat", e.target.value)}
                  placeholder="CSV, JSON, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="updateFrequency">Update Frequency</Label>
                <Input
                  id="updateFrequency"
                  value={formData.updateFrequency}
                  onChange={(e) => handleFormChange("updateFrequency", e.target.value)}
                  placeholder="Monthly, Quarterly, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filePath">File Path</Label>
                <Input
                  id="filePath"
                  value={formData.filePath}
                  onChange={(e) => handleFormChange("filePath", e.target.value)}
                  placeholder="/data/financial_markets.csv"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="previewAvailable"
                  checked={formData.previewAvailable}
                  onChange={(e) => handleFormChange("previewAvailable", e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="previewAvailable" className="text-sm font-medium text-gray-700">
                  Preview Available
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveDatasetMutation.isPending}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {saveDatasetMutation.isPending ? "Saving..." : "Save Dataset"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
