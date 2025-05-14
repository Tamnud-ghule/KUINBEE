/**
 * Homepage component for the Data Marketplace
 * Displays featured datasets and main navigation
 */
import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HomePage: React.FC = () => {
  // Featured datasets
  const featuredDatasets = [
    {
      id: '1',
      title: 'Enterprise Financial Records Dataset',
      description: 'Comprehensive financial records from Fortune 500 companies with anonymized identifiers',
      price: '$2,499',
      industry: 'Finance',
      recordCount: '1.2 million',
    },
    {
      id: '3',
      title: 'Global Supply Chain Metrics',
      description: 'Supply chain performance metrics from global logistics and manufacturing operations',
      price: '$3,299',
      industry: 'Logistics',
      recordCount: '2.4 million',
    },
    {
      id: '6',
      title: 'Industry Patent Database',
      description: 'Comprehensive patent filings and intellectual property registrations across technology sectors',
      price: '$3,499',
      industry: 'Technology',
      recordCount: '1.8 million',
    },
  ];

  // Main categories
  const mainCategories = [
    {
      id: 'finance',
      name: 'Finance & Banking',
      icon: (
        <svg className="h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      icon: (
        <svg className="h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      ),
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: (
        <svg className="h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      ),
    },
    {
      id: 'logistics',
      name: 'Logistics & Supply Chain',
      icon: (
        <svg className="h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden mb-16 shadow-sm border border-gray-100">
        <div className="px-8 py-16 md:py-20 md:px-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Enterprise-Grade Data Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access secure, verified, and compliant datasets to power your business intelligence and strategic decision-making.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/datasets">
              <Button className="text-white bg-gray-900 hover:bg-gray-800 px-8 py-6 text-lg h-auto">
                Browse Datasets
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 px-8 py-6 text-lg h-auto">
                Explore Categories
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              GDPR & HIPAA Compliant
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Enterprise Security
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Regular Updates
            </div>
          </div>
        </div>
      </div>

      {/* Categories section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          <Link href="/categories">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              View All Categories
              <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <div className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-6 h-full flex items-center cursor-pointer transition-colors">
                <div className="p-3 bg-white rounded-full mr-4 shadow-sm">
                  {category.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured datasets section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Datasets</h2>
          <Link href="/datasets">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              View All Datasets
              <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDatasets.map((dataset) => (
            <Card key={dataset.id} className="flex flex-col h-full border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">{dataset.title}</CardTitle>
                <Badge variant="outline" className="w-fit">{dataset.industry}</Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 mb-4">{dataset.description}</p>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                    </svg>
                    {dataset.recordCount} records
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="font-bold text-gray-900">{dataset.price}</p>
                <Link href={`/dataset/${dataset.id}`}>
                  <Button variant="outline" className="border-gray-900 text-gray-900">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Need Custom Data Solutions?</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-8">
          Our team of data specialists can create custom datasets or data streams tailored to your specific business requirements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-gray-900 hover:bg-gray-100">
            Contact Sales Team
          </Button>
          <Button variant="outline" className="border-gray-500 text-white hover:bg-gray-800">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
