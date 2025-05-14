import React, { useState } from 'react';
import { Calendar, Clock, Loader2, Mail, User, Building, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { InsertContactRequest } from '@yourscope/shared';

export type ContactFormState = Omit<InsertContactRequest, 'id'>;
export type ValidationErrors = Record<string, string>;

const ContactCTA: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    company: '',
    message: '',
    scheduleCall: false,
    preferredDate: undefined
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormState) => {
      const res = await apiRequest('POST', '/api/contact', data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      return await res.json();
    },
    onSuccess: () => {
      // Set success message and clear form
      setSuccessMessage("Message sent successfully!");
      
      // Show success message for 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Reset form and errors
      setFormData({ 
        name: '',
        email: '',
        company: '',
        message: '',
        scheduleCall: false,
        preferredDate: undefined
      });
      setErrors({});
      setShowForm(false);
      
      // Show toast for accessibility
      toast({
        title: "Message sent successfully",
        description: formData.scheduleCall 
          ? "We'll contact you shortly to confirm your call." 
          : "Thank you for your message. Our team will get back to you soon.",
      });
    },
    onError: (error: any) => {
      // Set error message and keep form visible
      const errorMsg = error.message || "Failed to send message";
      setErrorMessage(errorMsg);
      
      // Show error message for 10 seconds
      setTimeout(() => setErrorMessage(null), 10000);
      
      // Show error toast for accessibility
      toast({
        title: "Error sending message",
        description: errorMsg,
        variant: "destructive",
      });
      
      // Handle field-specific errors
      if (error.details) {
        setErrors(error.details);
      } else if (error.field) {
        setErrors({ [error.field]: error.error });
      }
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear all errors on new submission
    
    // Make a copy of form data to transform the date properly
    const submissionData = {...formData};
    
    // Convert preferredDate string to a Date object if it exists
    if (submissionData.preferredDate && typeof submissionData.preferredDate === 'string') {
      submissionData.preferredDate = new Date(submissionData.preferredDate);
    }
    
    contactMutation.mutate(submissionData);
  };
  
  const handleScheduleCall = () => {
    setShowCallOptions(true);
    setShowForm(true);
    setFormData(prev => ({ ...prev, scheduleCall: true }));
    
    // Clear any existing messages when starting new form
    setSuccessMessage(null);
    setErrorMessage(null);
  };
  
  const handleContactTeam = () => {
    setShowCallOptions(false);
    setShowForm(true);
    setFormData(prev => ({ ...prev, scheduleCall: false }));
    
    // Clear any existing messages when starting new form
    setSuccessMessage(null);
    setErrorMessage(null);
  };
  
  return (
    <section id="contact" className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Data Strategy?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Take the first step toward more secure, compliant, and valuable data resources for your organization.
        </p>
        
        {!showForm ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button 
              onClick={handleScheduleCall}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm transition-colors"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a 15-Minute Call
            </button>
            <button 
              onClick={handleContactTeam}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Team
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-10">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {showCallOptions ? 'Schedule a Call' : 'Contact Us'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors`}
                    placeholder="Full Name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors`}
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="block text-left text-sm font-medium text-gray-700">Company</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.company ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors`}
                    placeholder="Your Organization"
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>
              
              {showCallOptions && (
                <div className="space-y-2">
                  <label htmlFor="preferredDate" className="block text-left text-sm font-medium text-gray-700">Preferred Date & Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate?.toString() || ''}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.preferredDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors`}
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-left text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className={`block w-full px-3 py-2 border ${errors.message ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors`}
                  placeholder={showCallOptions ? "Please tell us about your data needs and any specific topics you'd like to discuss." : "How can we help you?"}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Success Message Card */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 animate-in slide-in-from-bottom-full">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-4 focus:outline-none"
              aria-label="Dismiss success message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Error Message Card */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 animate-in slide-in-from-bottom-full">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium">Error sending message</p>
              <p className="mt-1 text-sm">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-4 focus:outline-none"
              aria-label="Dismiss error message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactCTA;