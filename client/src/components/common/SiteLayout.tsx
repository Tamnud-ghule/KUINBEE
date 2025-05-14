/**
 * SiteLayout component - Global layout wrapper for all pages
 * Provides consistent site-wide navigation and structure
 */
import React from 'react';
import SiteNavigation from './SiteNavigation';

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavigation />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default SiteLayout;
