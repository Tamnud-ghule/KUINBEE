import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, CheckCircle, Copy, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApiKeyResponse {
  apiKey: string;
}

export default function ApiKey() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Regenerate API key mutation
  const regenerateKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/regenerate-api-key');
      const data = await res.json();
      return data as ApiKeyResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/user'], {
        ...user,
        apiKey: data.apiKey
      });
      
      toast({
        title: 'API Key Regenerated',
        description: 'Your new API key has been generated successfully.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Regenerate API Key',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Copy API key to clipboard
  const copyToClipboard = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setCopied(true);
      
      toast({
        title: 'API Key Copied',
        description: 'The API key has been copied to your clipboard.'
      });
      
      setTimeout(() => setCopied(false), 3000);
    }
  };
  
  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>
            Use this key to authenticate with our API and access datasets programmatically.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {user.apiKey ? (
            <>
              <div className="relative">
                <Input 
                  readOnly 
                  value={user.apiKey} 
                  className="pr-32 font-mono text-sm"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1 h-8"
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Security notice</AlertTitle>
                <AlertDescription>
                  Keep this key confidential. If compromised, regenerate it immediately. 
                  This key grants access to all datasets you've purchased.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No API key available</AlertTitle>
              <AlertDescription>
                You don't have an API key yet. Click the button below to generate one.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={() => regenerateKeyMutation.mutate()}
            disabled={regenerateKeyMutation.isPending}
          >
            {regenerateKeyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {user.apiKey ? 'Regenerate API Key' : 'Generate API Key'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use our API to access datasets programmatically.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Authentication</h3>
          <p className="text-sm text-gray-600">
            Add your API key to the <code className="bg-gray-100 px-1 py-0.5 rounded">X-API-Key</code> header in your requests:
          </p>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
              <code>{`curl -X GET https://api.dataservice.com/datasets \
  -H "X-API-Key: ${user.apiKey || 'your-api-key'}"`}</code>
            </pre>
          </div>
          
          <h3 className="text-lg font-medium mt-6">Available Endpoints</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded mr-2">
                  GET
                </span>
                /datasets
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                List all datasets you have purchased.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded mr-2">
                  GET
                </span>
                /datasets/{'{id}'}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Get detailed information about a specific dataset.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded mr-2">
                  GET
                </span>
                /download/{'{id}'}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Download a dataset file that you have purchased.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
