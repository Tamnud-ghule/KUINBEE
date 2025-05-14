/**
 * HeroSection component - Full-viewport landing section with main headline and CTAs
 * Features a grayscale gradient background with primary and secondary action buttons
 */
import React from 'react';
import { Link } from 'wouter';
import { Database, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header id="hero" className="relative min-h-screen flex items-center bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/20 pointer-events-none"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
          Enterprise-Grade Data, <br className="hidden sm:block"/>Zero Risk.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-6">
          On-demand, fully compliant datasets—collected, validated, encrypted, and delivered by security-first experts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link href={user ? "/marketplace" : "/auth"}>
            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow transition-all group">
              <Database className="h-5 w-5 mr-2" />
              Explore Data Marketplace
              <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href="#contact">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              Contact Our Data Team
            </button>
          </a>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-semibold mb-4">1</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Datasets</h3>
            <p className="text-gray-600 text-center">Explore our curated collection of industry-specific data</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-semibold mb-4">2</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Purchase Securely</h3>
            <p className="text-gray-600 text-center">Pay once with enterprise-grade security and encryption</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-semibold mb-4">3</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Instant Access</h3>
            <p className="text-gray-600 text-center">Download or API access to your purchased datasets</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
