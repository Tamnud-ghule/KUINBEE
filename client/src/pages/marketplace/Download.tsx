// /client/src/pages/marketplace/Download.tsx
import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download as DownloadIcon, Key, Copy, Check, FileText, AlertTriangle, ExternalLink, CheckCircle, X } from 'lucide-react';

interface Purchase {
  id: number;
  userId: number;
  datasetId: number;
  amount: number;
  encryptionKey: string;
  purchaseDate: string;
}

interface Dataset {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  recordCount: number;
  dataFormat: string;
  lastUpdated: string;
}

export default function Download() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute<{ id: string }>('/download/:id');
  const datasetId = parseInt(params?.id || '0', 10);
  const [downloading, setDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch purchase details
  const {
    data,
    isLoading,
    error: queryError
  } = useQuery<{ purchase: Purchase, dataset: Dataset }>({
    queryKey: [`/api/purchases/${datasetId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && datasetId > 0,
  });

  const handleDownload = async () => {
    if (!data) return;
    
    setDownloading(true);
    setDownloadError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`/api/download/${datasetId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to download dataset';
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          try {
            const textError = await response.text();
            if (textError) errorMessage = textError;
          } catch {}
        }
        
        throw new Error(errorMessage);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${data.dataset.slug}.encrypted`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
      
      setSuccessMessage("Your encrypted dataset is being downloaded.");
      
      toast({
        title: "Download Started",
        description: "Your encrypted dataset is being downloaded.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setDownloadError(errorMessage);
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const copyEncryptionKey = () => {
    if (!data) return;
    
    navigator.clipboard.writeText(data.purchase.encryptionKey)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        
        toast({
          title: "Copied to clipboard",
          description: "Encryption key has been copied to your clipboard.",
        });
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Please select and copy the key manually.",
          variant: "destructive",
        });
      });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (queryError || !data) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Access Error</p>
              <p className="mt-1">You don't have access to this dataset. Please purchase it first.</p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/datasets">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse Datasets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/purchases" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to purchases
        </Link>
      </div>
      
      {/* Error Card */}
      {downloadError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Download Error</p>
              <p className="mt-1">{downloadError}</p>
            </div>
            <button 
              onClick={() => setDownloadError(null)}
              className="ml-auto focus:outline-none"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Success Card */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
            <div>
              <p className="font-medium">Download Started</p>
              <p className="mt-1">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto focus:outline-none"
              aria-label="Dismiss success"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Download Dataset: {data.dataset.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Dataset Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-gray-500">Format:</span>
                <span className="font-medium ml-2">{data.dataset.dataFormat}</span>
              </div>
              <div>
                <span className="text-gray-500">Records:</span>
                <span className="font-medium ml-2">{data.dataset.recordCount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="font-medium ml-2">{new Date(data.dataset.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Purchase Date:</span>
                <span className="font-medium ml-2">{new Date(data.purchase.purchaseDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <Key className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="text-lg font-medium">Your Encryption Key</h3>
            </div>
            
            <div className="relative">
              <div className="p-3 bg-white border border-gray-300 rounded font-mono text-sm break-all">
                {data.purchase.encryptionKey}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={copyEncryptionKey}
                aria-label={copySuccess ? "Copied" : "Copy key"}
              >
                {copySuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 inline-block mr-1 text-amber-500" />
              This key is required to decrypt your data. Store it securely.
            </div>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">How to Open Your Dataset</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Download the ZIP file using the button below.</li>
              <li>Copy your encryption key from above (this is your ZIP password).</li>
              <li>
                Open the ZIP file using <a href="https://www.7-zip.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">7-Zip</a> (recommended, free, open source) or any tool that supports AES-256 encrypted ZIPs.
              </li>
              <li>When prompted, paste your encryption key as the password to extract the dataset file.</li>
              <li>Open the extracted file in your preferred application (Excel, etc.).</li>
            </ol>
            <div className="mt-3 text-xs text-blue-600">
              <b>Note:</b> Windows built-in ZIP may not support AES-256. Use 7-Zip for best results.
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" asChild>
            <Link href="/purchases">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Purchases
            </Link>
          </Button>
          
          <Button 
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-t-transparent"></div>
                Downloading...
              </div>
            ) : (
              <div className="flex items-center">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Encrypted Dataset
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}