/**
 * SecurityCompliance component - Security features in a dark-themed section
 * Highlights encryption, certifications, privacy, and auditing features
 */
import React from 'react';

const SecurityCompliance: React.FC = () => {
  const securityFeatures = [
    {
      icon: (
        <svg className="h-8 w-8 text-gray-300 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Encryption",
      description: "AES-256 at rest, TLS 1.3 in transit, RBAC"
    },
    {
      icon: (
        <svg className="h-8 w-8 text-gray-300 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Certifications",
      description: "GDPR, HIPAA, CCPA, ISO 27001"
    },
    {
      icon: (
        <svg className="h-8 w-8 text-gray-300 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Data Privacy",
      description: "Pseudonymization, k-anonymity, secure enclaves"
    },
    {
      icon: (
        <svg className="h-8 w-8 text-gray-300 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Auditing",
      description: "Real-time logs, SOC 2 reports, compliance dossiers"
    }
  ];

  return (
    <section id="security" className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Security & Compliance</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">Your data's security is our top priority. Our infrastructure and processes are built to exceed industry standards.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
