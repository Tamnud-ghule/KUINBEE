import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Database, FileText, Download, Lock, ShoppingCart, ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

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

interface Purchase {
  id: number;
  userId: number;
  datasetId: number;
  amount: number;
  encryptionKey: string;
  purchaseDate: string;
}

export default function DatasetDetail() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute<{ id: string }>('/dataset/:id');
  const datasetId = parseInt(params?.id || '0', 10);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch dataset details
  const {
    data: dataset,
    isLoading: isLoadingDataset,
    error: datasetError
  } = useQuery<Dataset>({
    queryKey: [`/api/datasets/${datasetId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: datasetId > 0,
  });

  // Check if user has purchased this dataset
  const {
    data: purchase,
    isLoading: isLoadingPurchase
  } = useQuery<{ purchase: Purchase, dataset: Dataset }>({
    queryKey: [`/api/purchases/${datasetId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && datasetId > 0,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
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

  // Generate sample preview data
  const previewData = [
    { id: 1, name: "Sample Record 1", value: 123, date: "2023-10-05" },
    { id: 2, name: "Sample Record 2", value: 456, date: "2023-10-06" },
    { id: 3, name: "Sample Record 3", value: 789, date: "2023-10-07" },
  ];

  // Handle add to cart
  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
      return;
    }
    addToCartMutation.mutate();
  };

  if (isLoadingDataset) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (datasetError || !dataset) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading dataset: {datasetError instanceof Error ? datasetError.message : 'Dataset not found'}</p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/datasets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Datasets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasPurchased = !!purchase;

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/datasets" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to datasets
        </Link>
      </div>
      
      {/* Dataset Title & Category */}
      <div className="mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-900">{dataset.title}</h1>
          {hasPurchased && (
            <Badge className="ml-4 bg-green-100 text-green-800 border-green-200">
              Purchased
            </Badge>
          )}
        </div>
        <div className="mt-2">
          <Badge variant="outline" className="text-gray-600">
            {dataset.category.name}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dataset Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Details</CardTitle>
              <CardDescription>
                Complete information about this dataset
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700">{dataset.description}</p>
              </div>
              
              {/* Key Statistics */}
              <div>
                <h3 className="text-lg font-medium mb-3">Dataset Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Database className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Record Count</p>
                      <p className="text-gray-600">{dataset.recordCount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Data Format</p>
                      <p className="text-gray-600">{dataset.dataFormat}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-gray-600">{formatDistanceToNow(new Date(dataset.lastUpdated), { addSuffix: true })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <RefreshCw className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Update Frequency</p>
                      <p className="text-gray-600">{dataset.updateFrequency}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sample Preview */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Data Preview</h3>
                  
                  {dataset.previewAvailable ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Lock className="h-4 w-4 mr-1" />
                      Preview not available
                    </div>
                  )}
                </div>
                
                {showPreview && dataset.previewAvailable && (
                  <Card className="border border-gray-200">
                    <CardContent className="p-0 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.value}</TableCell>
                              <TableCell>{item.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="p-3 text-center text-gray-500 border-t text-sm">
                        <Lock className="h-3 w-3 inline-block mr-1" />
                        Full data available after purchase
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {!showPreview && dataset.previewAvailable && (
                  <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-gray-600">
                    <p>Click 'Show Preview' to see a sample of the data structure.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Security Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Data Security & Compliance
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="mb-4">All datasets are encrypted with AES-256 encryption. Upon purchase, you will receive a unique encryption key that is required to decrypt the data.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Secure Access</h4>
                  <p className="text-sm text-gray-600">Data is accessible only with your encryption key and can be securely accessed via API.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Permission Control</h4>
                  <p className="text-sm text-gray-600">Manage access within your organization using your custom API key.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(dataset.price)}
              </div>
              
              {hasPurchased ? (
                <div className="space-y-4 mt-6">
                  <div className="p-3 bg-green-50 border border-green-100 text-green-800 rounded">
                    <p className="text-sm font-medium">You already own this dataset</p>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/download/${dataset.id}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Dataset
                    </Link>
                  </Button>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium mb-2">Your Encryption Key</h4>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono break-all">
                      {purchase.purchase.encryptionKey.substring(0, 20)}...
                      <span className="text-gray-400">[Click Download to reveal]</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      <Lock className="h-3 w-3 inline-block mr-1" />
                      Store this key securely. It's required to decrypt your data.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  <Button 
                    className="w-full" 
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? (
                      <span className="flex items-center">
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-t-transparent"></div>
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </span>
                    )}
                  </Button>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium mb-2">What's included</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
                          ✓
                        </div>
                        <span>Full dataset with {dataset.recordCount.toLocaleString()} records</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
                          ✓
                        </div>
                        <span>Secure encryption key for data access</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
                          ✓
                        </div>
                        <span>API access for direct integration</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
                          ✓
                        </div>
                        <span>Regular updates ({dataset.updateFrequency})</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
