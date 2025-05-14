/**
 * Dataset detail page for viewing a specific dataset
 */
import React from 'react';
import MarketplaceLayout from '@/components/marketplace/MarketplaceLayout';
import DatasetDetail from '@/components/marketplace/DatasetDetail';

const DatasetPage: React.FC = () => {
  return (
    <MarketplaceLayout>
      <DatasetDetail />
    </MarketplaceLayout>
  );
};

export default DatasetPage;
