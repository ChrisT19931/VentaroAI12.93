'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CustomSolutions() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Custom AI Solution Request - ${formData.projectType}`,
          message: `Project Type: ${formData.projectType}\nBudget Range: ${formData.budget}\nTimeline: ${formData.timeline}\nDescription: ${formData.description}\nGoals: ${formData.goals}`
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          projectType: '',
          budget: '',
          timeline: '',
          description: '',
          goals: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/5 rotate-45 opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/5 rotate-12 opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-full text-sm font-bold text-gray-300 mb-8 border border-white/20 shadow-xl">
              ENTERPRISE AI SOLUTIONS
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
              Transform Your Business <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">10x Faster</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <span className="text-white font-semibold">We take the guesswork out of AI implementation.</span> Tell us your needs and we'll create the perfect solution for your business. Save time, reduce complexity, and get results - we handle the technical details so you can focus on growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black/20 via-gray-950/50 to-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-xl">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Accelerate</span> Your Success
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              <span className="text-white font-semibold">Efficient. Reliable. Results-driven.</span> We deliver AI solutions that streamline your operations and accelerate your business goals. From simple automation tools to comprehensive enterprise systems - we get it done.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI SaaS Platforms",
                description: "Complete SaaS applications with AI features - from MVP to enterprise scale",
                icon: "SAAS",
                price: "$200-1000+",
                features: ["User Management", "Payment Integration", "AI-Powered Features", "Custom Dashboards"]
              },
              {
                title: "AI-Enhanced Websites",
                description: "Modern websites with integrated AI chatbots, personalization, and automation",
                icon: "WEB",
                price: "$50-500",
                features: ["Responsive Design", "AI Chatbots", "SEO Optimization", "Analytics Integration"]
              },
              {
                title: "Business Automation",
                description: "Automate repetitive tasks, workflows, and processes with intelligent AI systems",
                icon: "AUTO",
                price: "$100-800",
                features: ["Workflow Automation", "Document Processing", "Email Automation", "Data Entry"]
              },
              {
                title: "AI Chatbots & Assistants",
                description: "Custom conversational AI for customer support, sales, and lead generation",
                icon: "BOT",
                price: "$75-400",
                features: ["24/7 Support", "Lead Qualification", "Multi-Platform", "Custom Training"]
              },
              {
                title: "Data Analytics Tools",
                description: "Transform your data into insights with custom dashboards and AI analytics",
                icon: "DATA",
                price: "$150-600",
                features: ["Custom Dashboards", "Predictive Analytics", "Report Generation", "Data Visualization"]
              },
              {
                title: "E-commerce AI Solutions",
                description: "AI-powered online stores with recommendations, inventory management, and more",
                icon: "SHOP",
                price: "$300-1000+",
                features: ["Product Recommendations", "Inventory AI", "Customer Insights", "Sales Automation"]
              },
              {
                title: "Custom AI Models",
                description: "Tailored machine learning models for your specific business needs and data",
                icon: "ML",
                price: "$400-1000+",
                features: ["Computer Vision", "NLP Processing", "Predictive Models", "Custom Training"]
              },
              {
                title: "Mobile App Development",
                description: "AI-powered mobile applications for iOS and Android with smart features",
                icon: "MOBILE",
                price: "$500-1000+",
                features: ["Cross-Platform", "AI Integration", "Push Notifications", "Offline Capabilities"]
              },
              {
                title: "API & Integration Services",
                description: "Connect your systems with AI APIs, third-party integrations, and custom endpoints",
                icon: "API",
                price: "$100-500",
                features: ["REST APIs", "Third-party Integration", "Webhook Setup", "Database Connections"]
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-900/30 to-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 group hover:transform hover:scale-105 shadow-2xl hover:shadow-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Starting at</div>
                    <div className="text-lg font-bold text-white">{service.price}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gray-200 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center group-hover:text-gray-400 transition-colors duration-300">
                      <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 group-hover:bg-white/80 transition-colors duration-300"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Examples Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-full text-sm font-bold text-gray-300 mb-8 border border-white/20 shadow-xl">
              REAL BUSINESS SOLUTIONS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
              Perfect for <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Your Business</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what we can build for different business types and budgets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                businessType: "Small Restaurant",
                budget: "$150-400",
                solution: "AI Ordering System",
                description: "WhatsApp/SMS ordering bot, inventory tracking, customer management",
                features: ["Automated Orders", "Menu Management", "Customer Database", "Sales Reports"]
              },
              {
                businessType: "Online Store",
                budget: "$300-800",
                solution: "E-commerce AI Platform",
                description: "Smart product recommendations, inventory AI, customer insights dashboard",
                features: ["Product Recommendations", "Inventory Alerts", "Customer Analytics", "Sales Automation"]
              },
              {
                businessType: "Service Business",
                budget: "$100-500",
                solution: "Booking & CRM System",
                description: "Automated booking, client management, follow-up sequences, payment processing",
                features: ["Online Booking", "Client Portal", "Automated Follow-ups", "Payment Integration"]
              },
              {
                businessType: "Content Creator",
                budget: "$75-300",
                solution: "AI Content Tools",
                description: "Content generation, social media automation, audience analytics",
                features: ["Content Generation", "Social Scheduling", "Analytics Dashboard", "Engagement Tracking"]
              },
              {
                businessType: "Real Estate Agent",
                budget: "$200-600",
                solution: "Lead Generation System",
                description: "Property matching AI, lead qualification, automated follow-ups",
                features: ["Property Matching", "Lead Scoring", "Automated Emails", "Market Analytics"]
              },
              {
                businessType: "Consulting Firm",
                budget: "$400-1000+",
                solution: "Knowledge Management",
                description: "AI-powered knowledge base, client portal, project management system",
                features: ["Knowledge AI", "Client Portal", "Project Tracking", "Report Generation"]
              }
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-900/40 to-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 group hover:transform hover:scale-105 shadow-2xl hover:shadow-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm font-semibold text-gray-300">{example.businessType}</div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Budget Range</div>
                    <div className="text-sm font-bold text-white">{example.budget}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-gray-200 transition-colors duration-300">
                  {example.solution}
                </h3>
                <p className="text-gray-400 mb-4 text-sm group-hover:text-gray-300 transition-colors duration-300">{example.description}</p>
                <ul className="space-y-1">
                  {example.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex items-center group-hover:text-gray-400 transition-colors duration-300">
                      <span className="w-1 h-1 bg-white/60 rounded-full mr-2 group-hover:bg-white/80 transition-colors duration-300"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-2xl rotate-12 opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-xl rotate-45 opacity-30"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-full text-sm font-bold text-gray-300 mb-8 border border-white/20 shadow-xl">
              START YOUR AI PROJECT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
              Ready to Build Your <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">AI Solution?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tell us your needs and we'll create the perfect AI solution for your business. We take the guesswork out of implementation and deliver results that matter.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-900/30 to-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-6 shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Select project type</option>
                  <option value="AI SaaS Platform">AI SaaS Platform</option>
                  <option value="AI Website">AI-Enhanced Website</option>
                  <option value="Business Automation">Business Automation</option>
                  <option value="AI Chatbot">AI Chatbot & Assistant</option>
                  <option value="Data Analytics">Data Analytics Tools</option>
                  <option value="E-commerce AI">E-commerce AI Solutions</option>
                  <option value="Custom AI Model">Custom AI Model</option>
                  <option value="Mobile App">Mobile App Development</option>
                  <option value="API Integration">API & Integration Services</option>
                  <option value="Other">Other AI Solution</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Select budget range</option>
                  <option value="$50 - $200">$50 - $200 (Simple Solutions)</option>
                  <option value="$200 - $500">$200 - $500 (Standard Projects)</option>
                  <option value="$500 - $1000">$500 - $1000 (Advanced Solutions)</option>
                  <option value="$1000 - $5000">$1000 - $5000 (Enterprise Level)</option>
                  <option value="$5000+">$5000+ (Complex Systems)</option>
                  <option value="Discuss">Let's Discuss My Needs</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                Desired Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <option value="">Select timeline</option>
                <option value="ASAP">ASAP (Rush Project)</option>
                <option value="1-2 months">1-2 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6+ months">6+ months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm resize-none"
                placeholder="Describe your project, current challenges, and what you're looking to achieve..."
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-300 mb-2">
                Success Goals & KPIs
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={3}
                value={formData.goals}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm resize-none"
                placeholder="What does success look like? Any specific metrics or outcomes you want to achieve?"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-green-300">
                ✅ Perfect! We've received your AI project request. We'll analyze your needs and send you a custom proposal with pricing and timeline within 24 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300">
                ❌ Something went wrong. Please try again or contact us directly.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-white/10 border border-white/10"
            >
              {isSubmitting ? 'Sending Request...' : 'Start My AI Project'}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black/20 via-gray-950/50 to-black/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-full opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-full text-sm font-bold text-gray-300 mb-8 border border-white/20 shadow-xl">
              OUR METHODOLOGY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
              Our <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Process</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From concept to deployment, we ensure your AI solution delivers maximum value with proven methodologies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We analyze your needs, challenges, and goals to design the perfect solution"
              },
              {
                step: "02",
                title: "Proposal",
                description: "Detailed project plan with timeline, milestones, and transparent pricing"
              },
              {
                step: "03",
                title: "Development",
                description: "Agile development with regular updates and your feedback incorporated"
              },
              {
                step: "04",
                title: "Deployment",
                description: "Seamless launch with training, documentation, and ongoing support"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-2xl group-hover:shadow-white/20 transition-all duration-500 group-hover:scale-110 border border-white/10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gray-200 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}