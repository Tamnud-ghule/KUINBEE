import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Loader2, ShoppingCart, Package2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
  id: number;
  userId: number;
  datasetId: number;
  createdAt: string;
  dataset: {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    recordCount: number;
    dataFormat: string;
  };
}

export default function Cart() {
  const { toast } = useToast();
  
  const {
    data: cartItems,
    isLoading,
    error,
    refetch
  } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (datasetId: number) => {
      const res = await apiRequest("DELETE", `/api/cart/${datasetId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Dataset has been removed from your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/purchase");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      toast({
        title: "Purchase complete!",
        description: "Your datasets are now available in your purchases.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle remove from cart
  const handleRemoveFromCart = (datasetId: number) => {
    removeFromCartMutation.mutate(datasetId);
  };

  // Handle purchase
  const handlePurchase = () => {
    purchaseMutation.mutate();
  };

  // Calculate cart total
  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + item.dataset.price, 0);
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading cart: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      {/* Beta Notice Banner */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold">Beta Version Notice</h2>
        <p className="mt-1">
          This is a beta version of the app. No real payments are processed.
          The datasets you're downloading are sample files for demonstration purposes.
        </p>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
      </div>


      {cartItems && cartItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-grow p-4 sm:p-6">
                    <h3 className="text-lg font-medium">{item.dataset.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.dataset.description}</p>
                    
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                      <span>{item.dataset.recordCount.toLocaleString()} records</span>
                      <span>•</span>
                      <span>{item.dataset.dataFormat}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:border-l border-gray-200">
                    <div className="text-xl font-bold">
                      {formatCurrency(item.dataset.price)}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleRemoveFromCart(item.dataset.id)}
                      disabled={removeFromCartMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePurchase}
                  disabled={purchaseMutation.isPending}
                >
                  {purchaseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Purchase
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Looks like you haven't added any datasets to your cart yet.</p>
          <Button asChild>
            <Link href="/datasets">Browse Datasets</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
