import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingCart, FileText, Database, Calendar, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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

export default function Datasets() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');
  
  const {
    data: datasets,
    isLoading,
    error
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

  // Filter datasets based on search term
  const filteredDatasets = datasets?.filter(dataset => {
    const searchLower = searchTerm.toLowerCase();
    return (
      dataset.title.toLowerCase().includes(searchLower) ||
      dataset.description.toLowerCase().includes(searchLower) ||
      dataset.category.name.toLowerCase().includes(searchLower)
    );
  });

  // Sort datasets
  const sortedDatasets = filteredDatasets ? [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  }) : [];

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading datasets: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Marketplace</h1>
        <p className="text-gray-600 max-w-3xl">Browse our extensive catalog of professional datasets for business intelligence, market research, and analytics.</p>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 pr-4"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 items-center">
          <div className="flex items-center bg-gray-100 rounded-md p-1 mr-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <select
            className="p-2 border rounded-md text-sm bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort datasets"
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {sortedDatasets.length} {sortedDatasets.length === 1 ? 'dataset' : 'datasets'}{searchTerm ? ` for "${searchTerm}"` : ''}
        </p>
      </div>

      {sortedDatasets.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedDatasets.map((dataset) => (
              <Card key={dataset.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{dataset.title}</CardTitle>
                  <CardDescription>
                    Category: {dataset.category.name}
                  </CardDescription>
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
          <div className="space-y-4">
            {sortedDatasets.map((dataset) => (
              <Card key={dataset.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-4 md:p-6">
                    <h3 className="text-lg font-medium">{dataset.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Category: {dataset.category.name}</p>
                    
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{dataset.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
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
                  
                  <div className="p-4 md:p-6 md:min-w-[250px] flex flex-row md:flex-col justify-between md:justify-center items-center md:border-l border-gray-200">
                    <div className="text-2xl font-bold mb-0 md:mb-4">
                      {formatCurrency(dataset.price)}
                    </div>
                    
                    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/dataset/${dataset.id}`}>
                          Details
                        </Link>
                      </Button>
                      
                      <Button className="w-full" onClick={() => handleAddToCart(dataset.id)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all categories.</p>
          <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
