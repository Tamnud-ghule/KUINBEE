import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getQueryFn } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileArchive, BarChart, FileX, Building, CloudCog, Brain, Newspaper } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// Mapping of category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  'Financial Data': <BarChart className="h-8 w-8 text-gray-600" />,
  'Business Intelligence': <Building className="h-8 w-8 text-gray-600" />,
  'Market Research': <Newspaper className="h-8 w-8 text-gray-600" />,
  'Technical Data': <CloudCog className="h-8 w-8 text-gray-600" />,
  'AI & Machine Learning': <Brain className="h-8 w-8 text-gray-600" />,
};

export default function Categories() {
  // Fetch categories
  const {
    data: categories,
    isLoading,
    error
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading categories: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h1>
        <p className="text-gray-600 max-w-3xl">
          Explore our dataset collections organized by industry and use case. Each category contains curated, high-quality datasets with different access tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          // Get icon for this category or use default
          const CategoryIcon = () => categoryIcons[category.name] || <Database className="h-8 w-8 text-gray-600" />;

          return (
            <Card key={category.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="mb-3">
                  <CategoryIcon />
                </div>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  {category.description || `Explore ${category.name.toLowerCase()} datasets`}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileArchive className="h-4 w-4" />
                  <span>Various dataset formats</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/category/${category.slug}`}>
                    Browse {category.name} Datasets
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
