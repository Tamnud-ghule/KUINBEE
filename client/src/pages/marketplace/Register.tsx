/**
 * Registration page for new user signup
 */
import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import MarketplaceLayout from '@/components/marketplace/MarketplaceLayout';

const Register: React.FC = () => {
  const [_, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would register the user
    console.log('Registration form submitted');
    navigate('/login');
  };

  return (
    <MarketplaceLayout>
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your organization" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{' '}
                      <span className="text-gray-900 hover:underline cursor-pointer">Terms of Service</span>{' '}
                      and{' '}
                      <span className="text-gray-900 hover:underline cursor-pointer">Privacy Policy</span>
                    </Label>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gray-900 text-white">
                  Create account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Already have an account?</span>{' '}
              <span 
                className="text-gray-900 hover:underline cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Sign in
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketplaceLayout>
  );
};

export default Register;
