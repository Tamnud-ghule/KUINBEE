import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  BarChart3, 
  Building, 
  ShoppingCart, 
  ClipboardList, 
  Key, 
  User, 
  ArrowRight, 
  Download, 
  Filter, 
  PackageSearch,
  GridIcon,
  FolderIcon
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Dataset {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  recordCount: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Purchase {
  id: number;
  datasetId: number;
  title: string;
  price: number;
  purchaseDate: string;
}

export default function MarketplaceHome() {
  const { user } = useAuth();
  
  // Fetch datasets
  const {
    data: datasets,
    isLoading: isLoadingDatasets
  } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch categories
  const {
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch purchases
  const {
    data: purchases,
    isLoading: isLoadingPurchases
  } = useQuery<Purchase[]>({
    queryKey: ["/api/purchases"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  // Determine quick stats
  const totalDatasets = datasets?.length || 0;
  const totalCategories = categories?.length || 0;
  const totalPurchases = purchases?.length || 0;

  // Get featured datasets (limit to 3)
  const featuredDatasets = React.useMemo(() => {
    if (!datasets) return [];
    return datasets.slice(0, 3);
  }, [datasets]);

  if (isLoadingDatasets || isLoadingCategories) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Marketplace</h1>
        <p className="text-gray-600 max-w-3xl">
          Welcome to our secure B2B data marketplace. Browse, purchase, and access high-quality datasets for your business intelligence needs.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded mr-4">
                <PackageSearch className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalDatasets}</div>
                <div className="text-sm text-gray-500">Available Datasets</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/datasets" className="flex items-center justify-center">
                Browse Datasets
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded mr-4">
                <FolderIcon className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <div className="text-sm text-gray-500">Data Categories</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/categories" className="flex items-center justify-center">
                View Categories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded mr-4">
                {purchases ? (
                  <Download className="h-6 w-6 text-gray-700" />
                ) : (
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                )}
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPurchases}</div>
                <div className="text-sm text-gray-500">Your Purchases</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/purchases" className="flex items-center justify-center">
                View Purchases
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Featured Datasets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured Datasets</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/datasets">View All</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {featuredDatasets.map((dataset) => (
              <Card key={dataset.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="p-2 bg-gray-100 rounded mr-4">
                    {dataset.category.name.includes('Financial') ? (
                      <BarChart3 className="h-5 w-5 text-gray-700" />
                    ) : dataset.category.name.includes('Business') ? (
                      <Building className="h-5 w-5 text-gray-700" />
                    ) : (
                      <Database className="h-5 w-5 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium line-clamp-1">{dataset.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Badge variant="outline" className="mr-2">{dataset.category.name}</Badge>
                      <span>{dataset.recordCount.toLocaleString()} records</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-right">{formatCurrency(dataset.price)}</div>
                    <Button size="sm" className="mt-2" asChild>
                      <Link href={`/dataset/${dataset.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <Tabs defaultValue="browse">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="pt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <GridIcon className="h-5 w-5 mr-2" />
                    All Datasets
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">Browse our complete collection of {totalDatasets} professional datasets.</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/datasets">Browse Datasets</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">Browse datasets by category or industry vertical.</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/categories">View Categories</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Shopping Cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">View your cart and proceed to checkout.</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="pt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">Update your profile and account information.</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    API Keys
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">Manage your API keys for programmatic access.</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/api-key">Manage API Keys</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="purchases" className="pt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Purchase History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">View your purchase history and download datasets.</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/purchases">View Purchases</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {totalPurchases > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Recent Purchase
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-gray-600">Download your most recent purchased dataset.</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/purchases">Download Recent</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
