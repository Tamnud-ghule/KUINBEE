/**
 * DatasetCatalog component - Displays filterable catalog of available datasets
 * Allows sorting, filtering, and pagination of the dataset collection
 */
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Dataset {
  id: string;
  title: string;
  description: string;
  price: string;
  recordCount: string;
  lastUpdated: string;
  industries: string[];
  compliance: string[];
}

const DatasetCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  // Mock dataset list
  const datasets: Dataset[] = [
    {
      id: '1',
      title: 'Enterprise Financial Records Dataset',
      description: 'Comprehensive financial records from Fortune 500 companies with anonymized identifiers',
      price: '$2,499',
      recordCount: '1.2 million',
      lastUpdated: 'May 1, 2025',
      industries: ['Finance', 'Insurance', 'Banking'],
      compliance: ['GDPR', 'HIPAA', 'SOC 2'],
    },
    {
      id: '2',
      title: 'Healthcare Provider Network Data',
      description: 'Detailed healthcare provider network information across all 50 states',
      price: '$1,899',
      recordCount: '850,000',
      lastUpdated: 'April 15, 2025',
      industries: ['Healthcare', 'Insurance'],
      compliance: ['HIPAA', 'SOC 2'],
    },
    {
      id: '3',
      title: 'Global Supply Chain Metrics',
      description: 'Supply chain performance metrics from global logistics and manufacturing operations',
      price: '$3,299',
      recordCount: '2.4 million',
      lastUpdated: 'April 28, 2025',
      industries: ['Manufacturing', 'Logistics', 'Retail'],
      compliance: ['GDPR', 'ISO 27001'],
    },
    {
      id: '4',
      title: 'Consumer Behavior Analytics',
      description: 'Anonymized consumer purchasing patterns and behavioral analytics across digital platforms',
      price: '$1,999',
      recordCount: '4.7 million',
      lastUpdated: 'April 10, 2025',
      industries: ['Retail', 'Marketing', 'E-commerce'],
      compliance: ['CCPA', 'GDPR'],
    },
    {
      id: '5',
      title: 'Commercial Real Estate Transactions',
      description: 'Commercial property transactions and valuation data from major metropolitan areas',
      price: '$2,799',
      recordCount: '680,000',
      lastUpdated: 'March 22, 2025',
      industries: ['Real Estate', 'Finance', 'Insurance'],
      compliance: ['GDPR'],
    },
    {
      id: '6',
      title: 'Industry Patent Database',
      description: 'Comprehensive patent filings and intellectual property registrations across technology sectors',
      price: '$3,499',
      recordCount: '1.8 million',
      lastUpdated: 'April 5, 2025',
      industries: ['Technology', 'Legal', 'Manufacturing'],
      compliance: ['SOC 2'],
    },
  ];

  // Filter datasets based on search query and industry filter
  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || 
                           dataset.industries.includes(industryFilter);
    
    return matchesSearch && matchesIndustry;
  });

  // Sort datasets based on sort selection
  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
      case 'price-high':
        return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'records':
        return parseInt(b.recordCount.replace(/[^0-9]/g, '')) - parseInt(a.recordCount.replace(/[^0-9]/g, ''));
      case 'popularity':
      default:
        return parseInt(a.id) - parseInt(b.id); // Simulating popularity sorting
    }
  });

  // Get all unique industries for filter dropdown
  const allIndustries = Array.from(new Set(datasets.flatMap(dataset => dataset.industries)));

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Marketplace</h1>
          <p className="text-gray-500 max-w-2xl">
            Browse our curated collection of enterprise-grade datasets with comprehensive compliance and security features.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-gray-900 text-white">Request Custom Dataset</Button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Datasets
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Industry
            </label>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {allIndustries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="newest">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="records">Record Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-500">
          Showing {sortedDatasets.length} of {datasets.length} datasets
        </p>
      </div>

      {/* Dataset grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedDatasets.map((dataset) => (
          <Card key={dataset.id} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl">{dataset.title}</CardTitle>
              <div className="flex flex-wrap gap-1 mt-2">
                {dataset.industries.slice(0, 2).map((industry) => (
                  <Badge key={industry} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
                {dataset.industries.length > 2 && (
                  <Badge variant="outline" className="text-xs">+{dataset.industries.length - 2}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 text-sm mb-4">{dataset.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Records</p>
                  <p className="font-medium">{dataset.recordCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Updated</p>
                  <p className="font-medium">{dataset.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{dataset.price}</p>
              </div>
              <Link href={`/dataset/${dataset.id}`}>
                <Button variant="outline" className="border-gray-900 text-gray-900">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No results */}
      {sortedDatasets.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No datasets found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setIndustryFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DatasetCatalog;
