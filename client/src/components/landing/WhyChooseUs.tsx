/**
 * WhyChooseUs component - List of differentiators with checkmark icons
 * Highlights the key benefits and advantages of the data service
 */
import React from 'react';

const WhyChooseUs: React.FC = () => {
  const differentiators = [
    {
      title: "Fully Compliant Methodology",
      description: "Our processes are designed from the ground up to meet the strictest regulatory standards."
    },
    {
      title: "Enterprise-Ready Infrastructure",
      description: "Built on secure, scalable architecture that integrates seamlessly with your systems."
    },
    {
      title: "Quality Guarantees",
      description: "Every dataset undergoes rigorous validation to ensure accuracy and completeness."
    },
    {
      title: "Expert Consultation",
      description: "Our data specialists work with you to define and refine your requirements."
    },
    {
      title: "Flexible Delivery Options",
      description: "Choose from secure cloud access, API integration, or encrypted physical delivery."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
            <p className="text-lg text-gray-600 mb-8">
              We deliver enterprise-grade data solutions that prioritize compliance without compromising on quality or flexibility.
            </p>
          </div>
          <div>
            <ul className="space-y-6">
              {differentiators.map((item, index) => (
                <li key={index} className="flex">
                  <svg className="h-6 w-6 text-gray-900 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
