/**
 * IndustriesServed component - Grid of industry cards with icons and testimonials
 * Shows different industry sectors the service caters to with example use cases
 */
import React from 'react';

const IndustriesServed: React.FC = () => {
  const industries = [
    {
      icon: "🏥",
      title: "Healthcare & Pharma",
      description: "De-identified patient data for clinical research.",
      testimonial: "With their data powering our analytics, we cut compliance-related incidents by 35%."
    },
    {
      icon: "🏦",
      title: "Banking & Insurance",
      description: "Anonymized financial behavior for risk modeling.",
      testimonial: "With their data powering our analytics, we cut compliance-related incidents by 35%."
    },
    {
      icon: "⚖️",
      title: "Legal & Compliance",
      description: "Secure datasets for regulatory benchmarking.",
      testimonial: "With their data powering our analytics, we cut compliance-related incidents by 35%."
    },
    {
      icon: "📊",
      title: "Market Research",
      description: "Ethically sourced consumer insights.",
      testimonial: "With their data powering our analytics, we cut compliance-related incidents by 35%."
    }
  ];

  return (
    <section id="industries" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Trusted by leading organizations across regulated industries.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-3xl filter grayscale">
                {industry.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{industry.title}</h3>
              <p className="text-gray-600 mb-4">{industry.description}</p>
              <blockquote className="italic text-gray-500 border-l-4 border-gray-200 pl-4 text-sm">
                "{industry.testimonial}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesServed;
