/**
 * SiteNavigation component - Global navigation that appears on all pages
 * Provides navigation between landing page and marketplace and user account access
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { User, LogOut, ChevronDown, ShoppingCart } from 'lucide-react';

const SiteNavigation: React.FC = () => {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const isMarketplaceRoute = location.startsWith('/marketplace') || 
                            location.startsWith('/datasets') || 
                            location.startsWith('/dataset/') ||
                            location.startsWith('/category/');

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate('/')
    });
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="text-2xl font-bold font-mont tracking-tight text-white hover:text-gray-300 cursor-pointer">
                Kuinbee
              </span>
            </Link>
            <Link href="/marketplace">
              <span className={`text-sm hover:text-gray-300 cursor-pointer ${isMarketplaceRoute ? 'font-medium' : ''}`}>
                Data Marketplace
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {location === '/' ? (
              <>
                <a href="#about" className="hover:text-gray-300">About</a>
                <a href="#contact" className="hover:text-gray-300">Contact</a>
                <a href="#faqs" className="hover:text-gray-300">FAQ</a>
              </>
            ) : (
              <>
                <a href="/#about" className="hover:text-gray-300">About</a>
                <a href="/#contact" className="hover:text-gray-300">Contact</a>
                <a href="/#faqs" className="hover:text-gray-300">FAQ</a>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Cart
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                      <User className="h-4 w-4 mr-1" />
                      {user.username}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/purchases" className="w-full">
                        My Purchases
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/api-key" className="w-full">
                        API Key
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-gray-800">
                  Log in
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              type="button" 
              className="text-gray-300 hover:text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link href="/marketplace">
              <span className="block text-white hover:text-gray-300 cursor-pointer">
                Data Marketplace
              </span>
            </Link>
            {location === '/' ? (
              <>
                <a href="#about" className="block text-white hover:text-gray-300 cursor-pointer">About</a>
                <a href="#contact" className="block text-white hover:text-gray-300 cursor-pointer">Contact</a>
                <a href="#faq" className="block text-white hover:text-gray-300 cursor-pointer">FAQ</a>
              </>
            ) : (
              <>
                <a href="/#about" className="block text-white hover:text-gray-300 cursor-pointer">About</a>
                <a href="/#contact" className="block text-white hover:text-gray-300 cursor-pointer">Contact</a>
                <a href="/#faq" className="block text-white hover:text-gray-300 cursor-pointer">FAQ</a>
              </>
            )}
            
            {user ? (
              <>
                <Link href="/cart">
                  <span className="block text-white hover:text-gray-300 cursor-pointer">
                    Cart
                  </span>
                </Link>
                <Link href="/profile">
                  <span className="block text-white hover:text-gray-300 cursor-pointer">
                    Profile
                  </span>
                </Link>
                <Link href="/purchases">
                  <span className="block text-white hover:text-gray-300 cursor-pointer">
                    My Purchases
                  </span>
                </Link>
                <Link href="/api-key">
                  <span className="block text-white hover:text-gray-300 cursor-pointer">
                    API Key
                  </span>
                </Link>
                <span 
                  className="block text-white hover:text-gray-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  Log out
                </span>
              </>
            ) : (
              <Link href="/auth">
                <span className="block text-white hover:text-gray-300 cursor-pointer">
                  Log in / Register
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteNavigation;
