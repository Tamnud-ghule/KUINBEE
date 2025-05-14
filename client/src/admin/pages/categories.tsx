import { AdminLayout } from "../components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Category } from "@your-scope/shared";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminCategories() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });

  // Fetch categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Count datasets by category
  const { data: datasets } = useQuery<any[]>({
    queryKey: ["/api/datasets"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Create/update category mutation
  const saveCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; description: string; icon: string }) => {
      if (editingCategory) {
        await apiRequest("PUT", `/api/admin/categories/${editingCategory.id}`, categoryData);
      } else {
        await apiRequest("POST", "/api/admin/categories", categoryData);
      }
    },
    onSuccess: () => {
      toast({
        title: editingCategory ? "Category updated" : "Category created",
        description: editingCategory
          ? "The category has been updated successfully."
          : "The category has been added successfully.",
      });
      // Reset form and close dialog
      setFormData({ name: "", description: "", icon: "" });
      setEditingCategory(null);
      setDialogOpen(false);
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      await apiRequest("DELETE", `/api/admin/categories/${categoryId}`);
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been removed successfully.",
      });
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  // Handle category edit
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setDialogOpen(true);
  };

  // Handle category deletion
  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category? This may affect associated datasets.")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  // Handle form submission
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    saveCategoryMutation.mutate(formData);
  };

  // Filter categories based on search query
  const filteredCategories = categories?.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get dataset count for a category
  const getDatasetCount = (categoryId: number) => {
    if (!datasets) return 0;
    return datasets.filter((dataset) => dataset.categoryId === categoryId).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-gray-500">Manage dataset categories.</p>
          </div>
          <Button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", description: "", icon: "" });
              setDialogOpen(true);
            }}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datasets</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading categories...
                    </td>
                  </tr>
                ) : filteredCategories && filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {category.description || "No description"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.icon || "None"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getDatasetCount(category.id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => handleEditCategory(category)}
                            size="sm"
                            variant="outline"
                            className="text-xs h-8"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteCategory(category.id)}
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 text-red-500 border-red-200 hover:bg-red-50"
                            disabled={deleteCategoryMutation.isPending}
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
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No categories found matching your search" : "No categories found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Category Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCategory}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Finance, Healthcare, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A description of this category"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (emoji or class name)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏦 or icon-finance"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveCategoryMutation.isPending}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {saveCategoryMutation.isPending ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
