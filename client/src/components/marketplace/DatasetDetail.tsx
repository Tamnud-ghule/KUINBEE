/**
 * DatasetDetail component - Displays detailed information about a specific dataset
 * Includes metadata, pricing, compliance information, and sample data preview
 */
import React from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const DatasetDetail: React.FC = () => {
  // Get the dataset ID from the URL
  const [match, params] = useRoute('/dataset/:id');
  const datasetId = params?.id || '1';

  // In a real app, this would fetch the dataset from an API
  const dataset = {
    id: datasetId,
    title: 'Enterprise Financial Records Dataset',
    description: 'Comprehensive financial records from Fortune 500 companies with anonymized identifiers. This dataset contains quarterly financial statements, annual reports, and key performance indicators.',
    price: '$2,499',
    updateFrequency: 'Quarterly',
    recordCount: '1.2 million',
    dataFormat: 'CSV, JSON, SQL',
    compliance: ['GDPR', 'HIPAA', 'SOC 2'],
    industries: ['Finance', 'Insurance', 'Banking'],
    lastUpdated: 'May 1, 2025',
    sampleFields: [
      { name: 'company_id', type: 'String', description: 'Anonymized company identifier' },
      { name: 'quarter', type: 'Integer', description: 'Fiscal quarter (1-4)' },
      { name: 'year', type: 'Integer', description: 'Fiscal year' },
      { name: 'revenue', type: 'Decimal', description: 'Quarterly revenue in USD' },
      { name: 'expenses', type: 'Decimal', description: 'Quarterly expenses in USD' },
      { name: 'profit', type: 'Decimal', description: 'Quarterly profit in USD' },
      { name: 'assets', type: 'Decimal', description: 'Total assets in USD' },
      { name: 'liabilities', type: 'Decimal', description: 'Total liabilities in USD' },
      { name: 'equity', type: 'Decimal', description: 'Total equity in USD' },
    ],
  };

  return (
    <div className="container py-8 px-4 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{dataset.title}</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Dataset ID: {dataset.id}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-start">
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{dataset.price}</p>
            <p className="text-sm text-gray-500">per year, includes updates</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {dataset.compliance.map((item) => (
          <Badge key={item} variant="outline" className="text-xs bg-gray-100">
            {item} Compliant
          </Badge>
        ))}
        {dataset.industries.map((industry) => (
          <Badge key={industry} variant="outline" className="text-xs">
            {industry}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Record Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dataset.recordCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Update Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dataset.updateFrequency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dataset.lastUpdated}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About this Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{dataset.description}</p>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Data Format</h3>
              <p>{dataset.dataFormat}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Access Method</h3>
              <p>API, Bulk Download, Data Stream</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schema">
        <TabsList className="mb-4">
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="sample">Sample Data</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Schema</CardTitle>
              <CardDescription>
                The structure of the data included in this dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Field Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.sampleFields.map((field, index) => (
                      <tr key={field.name} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-3 px-4 border-b border-gray-100 font-mono text-sm">{field.name}</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-sm">{field.type}</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-sm">{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sample">
          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>
                Preview of the first few records (login required for full access)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-center py-12 text-gray-500">
                  Please <span className="font-medium text-gray-900">log in</span> to view sample data
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-gray-900 text-white w-full">Purchase Access</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Technical documentation and usage examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Usage Examples</h3>
                <p>
                  This dataset can be accessed through our secure API or downloaded in bulk.
                  Examples for connecting with Python, R, and SQL are provided in the
                  documentation.                
                </p>
                <h3>Terms of Use</h3>
                <p>
                  This dataset is provided for commercial use with proper licensing.
                  Redistribution is not permitted without explicit written consent.
                </p>
                <h3>Support</h3>
                <p>
                  For technical support or questions about this dataset, please contact
                  our data services team.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button className="bg-gray-900 text-white px-8">Purchase Access</Button>
      </div>
    </div>
  );
};

export default DatasetDetail;
