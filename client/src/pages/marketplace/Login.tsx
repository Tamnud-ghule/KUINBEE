/**
 * Login page for user authentication
 */
import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import MarketplaceLayout from '@/components/marketplace/MarketplaceLayout';

const Login: React.FC = () => {
  const [_, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate the user
    console.log('Login form submitted');
    navigate('/marketplace');
  };

  return (
    <MarketplaceLayout>
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
                </div>
                <Button type="submit" className="w-full bg-gray-900 text-white">
                  Sign in
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Don't have an account?</span>{' '}
              <span 
                className="text-gray-900 hover:underline cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Sign up
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.44 20.177c-.663.354-1.375.599-2.137.736-.8.142-1.613.221-2.437.221-1.522 0-2.903-.304-4.156-.893-1.252-.589-2.34-1.387-3.267-2.393-.925-1.008-1.643-2.188-2.143-3.568-.502-1.379-.752-2.861-.752-4.445 0-1.583.25-3.043.752-4.42.499-1.373 1.218-2.56 2.143-3.556.927-1.008 2.015-1.806 3.267-2.395C11.9.275 13.282 0 14.804 0c.948 0 1.858.114 2.725.331.87.22 1.68.55 2.42.999l-1.19 2.61c-.518-.32-1.08-.568-1.669-.761-.59-.19-1.249-.288-1.951-.288-1.754 0-3.154.624-4.188 1.855-1.039 1.23-1.557 2.91-1.557 4.99 0 2.09.525 3.757 1.572 4.976 1.051 1.225 2.47 1.839 4.236 1.839 1.343 0 2.454-.308 3.308-.907v-3.395h-3.23v-2.745h6.693v8.088l-.975 1.094-1.05 1.491z" />
                </svg>
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MarketplaceLayout>
  );
};

export default Login;
