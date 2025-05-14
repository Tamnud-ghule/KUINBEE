/**
 * HowItWorks component - Four-step process explanation with numbered icons
 * Shows the data service workflow in a responsive grid layout
 */
import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Define Requirements",
      description: "Tell us what data you need and your compliance requirements through our secure portal."
    },
    {
      number: 2,
      title: "Secure Collection",
      description: "Our experts collect data using our proprietary compliance-first methodology."
    },
    {
      number: 3,
      title: "Validate & Process",
      description: "Data is validated, anonymized, and processed according to your specifications."
    },
    {
      number: 4,
      title: "Secure Delivery",
      description: "Access your encrypted data through our secure platform or via API integration."
    }
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our streamlined process delivers compliant enterprise data in four simple steps.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(step => (
            <div key={step.number} className="bg-gray-50 p-6 rounded-lg border border-gray-100 relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
