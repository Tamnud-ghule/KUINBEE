/**
 * FAQs component - Accordion-style frequently asked questions
 * Provides expandable question and answer sections with smooth transitions
 */
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQs: React.FC = () => {
  const faqs = [
    {
      question: "How do you ensure data compliance?",
      answer: "Our compliance framework is built on three pillars: legal expertise, technical safeguards, and operational excellence. We maintain a team of data privacy attorneys who review all collection methodologies, implement end-to-end encryption and access controls, and conduct regular third-party audits. Every dataset includes a compliance dossier documenting our adherence to relevant regulations."
    },
    {
      question: "What formats are available for data delivery?",
      answer: "We support all standard data formats including JSON, CSV, XML, SQL, Parquet, and Avro. Data can be delivered via secure cloud storage, direct API integration, or encrypted physical media. Our team can work with you to determine the optimal format and delivery method for your specific use case and technical environment."
    },
    {
      question: "Can you create custom datasets?",
      answer: "Yes, custom dataset creation is our specialty. We work with you to understand your specific requirements, including data points, volume, freshness parameters, and compliance needs. Our team then designs a custom collection methodology, validates the approach with you, and implements the collection. Custom datasets typically require 2-4 weeks for initial delivery, with updates available on your preferred schedule."
    },
    {
      question: "What are your pricing models?",
      answer: "We offer flexible pricing based on data volume, complexity, and delivery frequency. Options include one-time purchases, subscription models with regular updates, and enterprise agreements with unlimited access. All pricing includes compliance documentation, technical support, and data quality guarantees. Contact our sales team for a custom quote based on your specific requirements."
    }
  ];

  return (
    <section id="faqs" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Everything you need to know about our data services.</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg mb-4 bg-white overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
