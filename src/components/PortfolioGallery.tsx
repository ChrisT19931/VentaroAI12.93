'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  results: string[];
  timeline: string;
  client: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 'ecommerce-ai',
    title: 'AI-Powered E-commerce Platform',
    category: 'SaaS Platform',
    description: 'Complete e-commerce solution with AI-driven product recommendations, inventory management, and customer service automation.',
    technologies: ['Next.js', 'OpenAI API', 'Stripe', 'Supabase', 'TailwindCSS'],
    image: '/images/portfolio/ecommerce-platform.svg',
    results: ['300% increase in conversion rates', '50% reduction in customer service costs', '24/7 automated support'],
    timeline: '6 weeks',
    client: 'Fashion Retailer'
  },
  {
    id: 'healthcare-chatbot',
    title: 'Medical Appointment Chatbot',
    category: 'AI Chatbot',
    description: 'Intelligent chatbot for healthcare providers to automate appointment scheduling, patient inquiries, and follow-up communications.',
    technologies: ['React', 'Node.js', 'OpenAI', 'Twilio', 'MongoDB'],
    image: '/images/portfolio/healthcare-chatbot.svg',
    results: ['80% reduction in phone calls', '95% appointment accuracy', '60% faster booking process'],
    timeline: '4 weeks',
    client: 'Medical Clinic'
  },
  {
    id: 'real-estate-crm',
    title: 'Real Estate Lead Management',
    category: 'Automation Tool',
    description: 'Automated lead qualification and nurturing system with AI-powered property matching and client communication.',
    technologies: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Zapier'],
    image: '/images/portfolio/real-estate-crm.svg',
    results: ['200% increase in qualified leads', '40% faster deal closure', '90% automation rate'],
    timeline: '8 weeks',
    client: 'Real Estate Agency'
  },
  {
    id: 'finance-dashboard',
    title: 'Financial Analytics Dashboard',
    category: 'Data Analytics',
    description: 'Real-time financial dashboard with predictive analytics, risk assessment, and automated reporting for investment firms.',
    technologies: ['React', 'D3.js', 'Python', 'TensorFlow', 'AWS'],
    image: '/images/portfolio/finance-dashboard.svg',
    results: ['50% faster decision making', '30% improved accuracy', 'Real-time insights'],
    timeline: '10 weeks',
    client: 'Investment Firm'
  },
  {
    id: 'education-platform',
    title: 'AI Learning Management System',
    category: 'Custom Solution',
    description: 'Personalized learning platform with AI tutoring, progress tracking, and adaptive content delivery for educational institutions.',
    technologies: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL', 'Vercel'],
    image: '/images/portfolio/education-platform.svg',
    results: ['40% improvement in student outcomes', '60% engagement increase', 'Personalized learning paths'],
    timeline: '12 weeks',
    client: 'Online University'
  },
  {
    id: 'manufacturing-qc',
    title: 'Quality Control Automation',
    category: 'API Integration',
    description: 'Computer vision system for automated quality control in manufacturing with real-time defect detection and reporting.',
    technologies: ['Python', 'OpenCV', 'TensorFlow', 'REST API', 'Docker'],
    image: '/images/portfolio/manufacturing-qc.svg',
    results: ['99.5% defect detection accuracy', '70% cost reduction', '24/7 monitoring'],
    timeline: '14 weeks',
    client: 'Manufacturing Company'
  }
];

const PortfolioGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const categories = ['All', ...new Set(portfolioItems.map(item => item.category))];
  
  const filteredItems = selectedCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Success Stories
          </span>
        </h3>
        <p className="text-gray-300 text-lg">
          Real projects, real results. See how we've transformed businesses with AI.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-blue-600/20 hover:text-blue-300 border border-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
              <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                {item.category === 'SaaS Platform' && '🚀'}
                {item.category === 'AI Chatbot' && '🤖'}
                {item.category === 'Automation Tool' && '⚡'}
                {item.category === 'Data Analytics' && '📊'}
                {item.category === 'Custom Solution' && '🎯'}
                {item.category === 'API Integration' && '🔗'}
              </div>
              <div className="absolute top-3 right-3 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full">
                {item.timeline}
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-blue-400 text-sm font-medium mb-2">{item.category}</div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {item.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 3 && (
                  <span className="text-xs text-gray-400">+{item.technologies.length - 3} more</span>
                )}
              </div>
              
              <div className="text-emerald-400 text-sm font-medium">
                {item.results[0]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-blue-400 text-sm font-medium mb-2">{selectedItem.category}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h3>
                  <div className="text-gray-400">Client: {selectedItem.client} • Timeline: {selectedItem.timeline}</div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedItem.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedItem.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Key Results</h4>
                  <ul className="space-y-2">
                    {selectedItem.results.map((result, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-gray-300 mb-4">Ready to achieve similar results for your business?</p>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      const contactForm = document.getElementById('contact-form');
                      if (contactForm) {
                        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Start Your Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="text-center pt-6 border-t border-gray-700/50">
        <p className="text-gray-300 mb-4">
          Want to see your business featured in our next success story?
        </p>
        <button
          onClick={() => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
              contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default PortfolioGallery;