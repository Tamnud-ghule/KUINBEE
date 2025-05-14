/**
 * SampleDatasetPreview component - Two-column layout with features and CTAs
 * Showcases dataset features with a schema preview lock icon
 */
import React from 'react';

const SampleDatasetPreview: React.FC = () => {
  const features = [
    "Consistent schema design across all deliveries",
    "Clean, normalized data ready for analysis",
    "Multiple export formats (JSON, CSV, SQL, etc.)",
    "Detailed documentation and schema references"
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sample Dataset Preview</h2>
            <p className="text-lg text-gray-600 mb-6">
              Our datasets are structured for easy integration, featuring:
            </p>
            <ul className="space-y-3 text-gray-600 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-6 w-6 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-10 lg:mt-0 bg-gray-50 rounded-lg p-8 border border-gray-100">
            <div className="mb-6 flex justify-center">
              <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-center text-gray-600 mb-8">
              Request a free sample of our industry-standard datasets or submit requirements for a custom collection.
            </p>
            <div className="flex flex-col space-y-4">
              <button className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm transition-colors">
                Request Preview
              </button>
              <button className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm transition-colors">
                Submit Custom Brief
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SampleDatasetPreview;
