import React from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Database, Calendar, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Dataset {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  recordCount: number;
  dataFormat: string;
  updateFrequency: string;
  lastUpdated: string;
  previewAvailable: boolean;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function CategoryPage() {
  const { toast } = useToast();
  const [, params] = useRoute<{ name: string }>('/category/:name');
  const categorySlug = params?.name || '';
  
  // Fetch categories
  const {
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch all datasets
  const {
    data: allDatasets,
    isLoading: isLoadingDatasets,
    error: datasetsError
  } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (datasetId: number) => {
      const res = await apiRequest("POST", "/api/cart", { datasetId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Dataset has been added to your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle add to cart
  const handleAddToCart = (datasetId: number) => {
    addToCartMutation.mutate(datasetId);
  };

  // Filter datasets by category
  const filteredDatasets = React.useMemo(() => {
    if (!allDatasets) return [];
    return allDatasets.filter(dataset => dataset.category.slug === categorySlug);
  }, [allDatasets, categorySlug]);

  // Get current category
  const currentCategory = React.useMemo(() => {
    if (!categories) return null;
    return categories.find(category => category.slug === categorySlug);
  }, [categories, categorySlug]);

  if (isLoadingCategories || isLoadingDatasets) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (datasetsError || !allDatasets) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading datasets: {datasetsError instanceof Error ? datasetsError.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Category not found. <Link href="/categories" className="underline">Browse all categories</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/categories" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to categories
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentCategory.name}</h1>
        {currentCategory.description && (
          <p className="text-gray-600 max-w-3xl">{currentCategory.description}</p>
        )}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {filteredDatasets.length} {filteredDatasets.length === 1 ? 'dataset' : 'datasets'} in this category
        </p>
      </div>

      {filteredDatasets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="line-clamp-1">{dataset.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 line-clamp-3">{dataset.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 font-normal">
                      <Database className="h-3 w-3" />
                      {dataset.recordCount.toLocaleString()} records
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1 font-normal">
                      <FileText className="h-3 w-3" />
                      {dataset.dataFormat}
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1 font-normal">
                      <Calendar className="h-3 w-3" />
                      Updated {formatDistanceToNow(new Date(dataset.lastUpdated), { addSuffix: true })}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="mt-auto border-t pt-4 flex justify-between items-center">
                <div className="text-xl font-bold">
                  {formatCurrency(dataset.price)}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/dataset/${dataset.id}`}>
                      Details
                    </Link>
                  </Button>
                  
                  <Button onClick={() => handleAddToCart(dataset.id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found in this category</h3>
          <p className="text-gray-600 mb-6">Try exploring other categories or check back later.</p>
          <Button asChild>
            <Link href="/datasets">Browse All Datasets</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
