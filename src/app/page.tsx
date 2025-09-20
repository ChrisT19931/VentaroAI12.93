'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
// import CinematicHero from '../components/3d/CinematicHero' // Temporarily disabled due to webpack module resolution error
import TypewriterText from '../components/TypewriterText'
import UnifiedCheckoutButton from '../components/UnifiedCheckoutButton'
// ConsultationCalendar removed - using contact form instead
import { SocialProof, ScarcityIndicator, TestimonialCarousel } from '../components/ConversionOptimizations'
import SubscriptionForm from '../components/SubscriptionForm'
import { analytics } from '../lib/analytics'
import AnimatedHeading from '../components/AnimatedHeading'
import PremiumHeading from '../components/PremiumHeading'
import MetallicText from '../components/MetallicText'
import ScrollReveal from '../components/ScrollReveal'
import InteractiveQuoteWizard from '../components/InteractiveQuoteWizard'

// import FloatingQuoteButton from '../components/FloatingQuoteButton' // Temporarily disabled
// AIChatWidget functionality moved to GlobalWidgets

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    services: [] as string[],
    timeline: '',
    budget: '',
    businessStage: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomSubmitting, setIsCustomSubmitting] = useState(false);
  // Chat functionality moved to GlobalWidgets
  const maxSpots = 300;

  // Track page load
  useEffect(() => {
    analytics.track('homepage_loaded');
  }, []);

  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };



  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setContactForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one service is selected
    if (contactForm.services.length === 0) {
      toast.error('Please select at least one service for your quote.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Track form submission start
      analytics.trackFormSubmit('website_quote_request', {
        project_type: contactForm.projectType,
        services: contactForm.services,
        timeline: contactForm.timeline,
        has_phone: !!contactForm.phone,
        has_company: !!contactForm.company
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          subject: `New Project Quote Request - ${contactForm.projectType}`,
          message: `Phone: ${contactForm.phone}\nCompany: ${contactForm.company}\nProject Type: ${contactForm.projectType}\nServices Needed: ${contactForm.services.join(', ')}\nTimeline: ${contactForm.timeline}\n\nProject Details: ${contactForm.message}`,
          recipient: 'chris.t@ventarosales.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Track successful lead generation for Google Ads
      analytics.track('lead_generated', {
        lead_type: 'website_quote_request',
        project_type: contactForm.projectType,
        services_count: contactForm.services.length,
        timeline: contactForm.timeline,
        form_location: 'homepage_quote_builder'
      });

      // Google Ads conversion tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual Google Ads conversion ID
          'value': 1.0,
          'currency': 'USD',
          'transaction_id': Date.now().toString()
        });
        
        // Track as lead generation event
        window.gtag('event', 'generate_lead', {
          'currency': 'USD',
          'value': 1.0
        });
      }

      toast.success('Email sent! We\'ll get back to you soon.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        services: [],
        timeline: '',
        budget: '',
        businessStage: '',
        message: ''
      });
    } catch (error) {
      // Track form submission error
      analytics.track('form_submission_error', {
        form_name: 'website_quote_request',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Always show success even if there are technical issues
      toast.success('Thank you for your message! We\'ll get back to you soon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCustomSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        projectType: formData.get('projectType'),
        timeline: formData.get('timeline'),
        description: formData.get('description')
      };

      // Track form submission
      analytics.track('custom_quote_submitted', data);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          type: 'custom_quote'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Reset form
      (e.target as HTMLFormElement).reset();
      
      toast.success('Thank you for your quote request! We\'ll get back to you within 24 hours.');
    } catch (error) {
      console.error('Error submitting custom quote:', error);
      toast.error('There was an error submitting your request. Please try again.');
    } finally {
      setIsCustomSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen">
        {/* Cinematic Hero Section */}
       {/* <CinematicHero /> */} {/* Temporarily disabled due to webpack module resolution error */}
       
       {/* Elite Hero Section - Mobile Optimized */}
       <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-transparent to-blue-950/10"></div>
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
         
         {/* Enhanced 3D Background Elements - Mobile Optimized */}
         <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-blue-500/3 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
           <div className="text-center mb-12 sm:mb-16">
             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
               <span className="text-gray-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">ELITE AI TRANSFORMATION</span>
               <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
             </div>
             
             <div className="relative">
               <div className="absolute -inset-1 bg-blue-500/10 rounded-lg blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <AnimatedHeading 
                 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 leading-tight px-2 sm:px-0" 
                 animation="slide-up" 
                 theme="silver" 
                 is3D={true}
               >
                 <span className="text-white drop-shadow-2xl border-l-2 sm:border-l-4 border-gray-500/40 pl-2 sm:pl-4 block sm:inline">
                   Transform Your Business <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">with AI</span>
                 </span>
               </AnimatedHeading>
             </div>
             
             <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto px-4 sm:px-0">
               We take care of the knowledge & implementation gap between AI & your business goals.
             </p>

           </div>

           {/* Elite Custom Solution Section - Mobile Optimized */}
           <div className="text-center mb-12 sm:mb-16">
             <div className="relative">
               <div className="absolute -inset-1 bg-blue-500/10 rounded-lg blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <AnimatedHeading 
                 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 leading-tight px-2 sm:px-0" 
                 animation="slide-right" 
                 theme="blue" 
                 is3D={true}
                 delay={200}
               >
                 <span className="text-white drop-shadow-2xl border-l-2 sm:border-l-4 border-blue-500/40 pl-2 sm:pl-4">
                   Get Your Custom Solution
                 </span>
               </AnimatedHeading>
             </div>
             <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
               Let's understand your needs with a few quick questions. We'll provide a detailed solution proposal <span className="text-blue-400 font-bold">right asap</span>.
             </p>
           </div>
           
           <InteractiveQuoteWizard />

           {/* Call Now Button - Mobile Optimized */}
           <div className="text-center mt-8 sm:mt-12 mb-16 sm:mb-20">
             <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto mx-4 sm:mx-auto">
               <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                 Prefer to Talk Directly?
               </h3>
               <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
                 As we're new to this but the best in the game, we're happy to ease your concerns about our services. 
                 Call Chris T - Founder directly to discuss your project and understand how we can help accelerate your success.
               </p>
               <a 
                 href="tel:0435413110"
                 className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] text-base sm:text-lg min-h-[48px] tap-target"
               >
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 <span className="hidden sm:inline">Call Chris T - Founder: </span>0435 413 110
               </a>
               <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4 px-2 sm:px-0">
                 📞 Direct line to Chris T - Founder • We understand the skepticism to a new startup
               </p>
             </div>
           </div>

           {/* Services Grid - Mobile Optimized */}
           <div className="mb-16 sm:mb-20">
             <div className="text-center mb-8 sm:mb-12">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 sm:px-0">
                 <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">Accelerate Your Success</span>
               </h2>
               <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4 sm:px-0">
                 Speed is everything. We compress months of development into weeks, delivering everything from rapid prototypes to enterprise transformations.
               </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
               {[
                 {
                   title: "SaaS Platforms",
                   description: "Complete web applications with user management, payments, and AI features",
                   features: ["User Authentication", "Payment Integration", "AI-Powered Features", "Responsive Design"]
                 },
                 {
                   title: "AI Chatbots",
                   description: "Intelligent conversational agents for customer service and lead generation",
                   features: ["Natural Language Processing", "Multi-Platform Integration", "Custom Training", "Analytics Dashboard"]
                 },
                 {
                   title: "Automation Tools",
                   description: "Custom workflows that eliminate repetitive tasks and boost productivity",
                   features: ["Process Automation", "Data Integration", "Custom Workflows", "Real-time Monitoring"]
                 },
                 {
                   title: "Data Analytics",
                   description: "Transform raw data into actionable insights with AI-powered analysis",
                   features: ["Predictive Analytics", "Custom Dashboards", "Real-time Reporting", "Data Visualization"]
                 },
                 {
                   title: "API Integration",
                   description: "Connect your existing systems with modern AI capabilities",
                   features: ["System Integration", "API Development", "Legacy Modernization", "Cloud Migration"]
                 },
                 {
                   title: "Custom Solutions",
                   description: "Bespoke AI applications tailored to your specific business needs",
                   features: ["Requirements Analysis", "Custom Development", "Testing & QA", "Ongoing Support"]
                 }
               ].map((service, index) => (
                 <div key={index} className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(59,130,246,0.3)] transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 overflow-hidden border border-gray-700/30 hover:border-blue-500/50 min-h-[280px] sm:min-h-[320px] tap-target">
                   <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <div className="relative z-10 h-full flex flex-col">
                     <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors duration-300">{service.title}</h3>
                     <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-grow">{service.description}</p>
                     <ul className="space-y-1.5 sm:space-y-2">
                       {service.features.map((feature, featureIndex) => (
                         <li key={featureIndex} className="flex items-center space-x-2 text-xs sm:text-sm">
                           <div className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-300 flex-shrink-0"></div>
                           <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Business Examples - Mobile Optimized */}
           <div className="mb-16 sm:mb-20">
             <div className="text-center mb-8 sm:mb-12">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-0">Perfect for Every Business</h2>
               <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4 sm:px-0">
                 Tell us your needs and we'll create the perfect AI solution for your business. We take the guesswork out of implementation and deliver results that matter.
               </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
               {[
                 { type: "E-commerce", solution: "Inventory management AI" },
                 { type: "Healthcare", solution: "Patient scheduling system" },
                 { type: "Real Estate", solution: "Lead qualification bot" },
                 { type: "Education", solution: "Student progress tracker" },
                 { type: "Finance", solution: "Risk assessment tool" },
                 { type: "Marketing", solution: "Campaign optimization AI" },
                 { type: "Manufacturing", solution: "Quality control system" },
                 { type: "Retail", solution: "Customer service chatbot" }
               ].map((example, index) => (
                 <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 min-h-[80px] sm:min-h-[90px] flex flex-col justify-center tap-target">
                   <div className="text-blue-400 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors duration-300">{example.type}</div>
                   <div className="text-gray-300 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 leading-relaxed">{example.solution}</div>
                 </div>
               ))}
             </div>
           </div>

           {/* Interactive Elements Section */}
           <div className="mb-20">
             {/* Portfolio Gallery section removed */}
           </div>

           {/* Process Section - Mobile Optimized */}
           <div className="text-center mb-16 sm:mb-20">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-0">Our Process</h2>
             <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto px-4 sm:px-0">
               From concept to deployment, we handle everything with precision and speed.
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
               {[
                 {
                   step: "01",
                   title: "Discovery",
                   description: "We analyze your requirements and create a detailed project roadmap."
                 },
                 {
                   step: "02",
                   title: "Proposal",
                   description: "Receive a comprehensive proposal with timeline and deliverables."
                 },
                 {
                   step: "03",
                   title: "Development",
                   description: "Our team builds your solution with regular progress updates."
                 },
                 {
                   step: "04",
                   title: "Deployment",
                   description: "Launch your solution with full support and documentation."
                 }
               ].map((process, index) => (
                 <div key={index} className="group relative">
                   <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 min-h-[160px] sm:min-h-[180px] flex flex-col tap-target">
                     <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-2 sm:mb-4 group-hover:text-blue-300 transition-colors duration-300">{process.step}</div>
                     <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors duration-300">{process.title}</h3>
                     <p className="text-xs sm:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-grow">{process.description}</p>
                   </div>
                   {index < 3 && (
                     <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                       <svg className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                       </svg>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         </div>
       </section>

       {/* NEW: AI Coaching Hero Section - Mobile Optimized */}
       <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-transparent to-blue-950/10"></div>
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
         
         {/* Enhanced 3D Background Elements - Mobile Responsive */}
         <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-blue-500/3 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
           <div className="text-center mb-8 sm:mb-12">
             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/30 rounded-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mb-6 sm:mb-8 shadow-2xl shadow-black/40 transform hover:scale-105 transition-all duration-500">
               <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
               <span className="text-gray-300 font-bold text-xs sm:text-sm uppercase tracking-wider drop-shadow-lg">EXECUTIVE AI COACHING</span>
               <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
             </div>
             
             <div className="relative">
               <div className="absolute -inset-1 bg-blue-500/10 rounded-lg blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <AnimatedHeading 
                 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 leading-tight px-4 sm:px-0" 
                 animation="slide-up" 
                 theme="silver" 
                 is3D={true}
               >
                 <span className="drop-shadow-2xl">VAI </span>
                 <span className="text-white drop-shadow-2xl border-l-2 sm:border-l-4 border-blue-500/40 pl-2 sm:pl-4">Coaching</span>
               </AnimatedHeading>
             </div>
             
             <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto drop-shadow-xl transform hover:scale-102 transition-all duration-500 font-light premium-heading-animation px-4 sm:px-0" style={{animationDelay: '0.2s'}}>
               <span className="text-white font-semibold">No restrictions. No limitations.</span> From solo entrepreneurs to Fortune 500 enterprises - we deliver professional AI solutions that transform businesses at every scale. Whether you're starting your first venture or optimizing complex operations, our expertise adapts to your needs.
             </p>
           </div>
           
           {/* Mobile-First Coaching Cards with Enhanced 3D Effects */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 perspective-1000">
             {/* VAI Beginners Mastery */}
             <div className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(59,130,246,0.3)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-blue-500/40 hover:border-blue-400/80">
               <div className="absolute inset-0 rounded-3xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
               
               <div className="absolute top-4 left-4 z-20">
                 <div className="bg-gray-800/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.8)] transform hover:scale-110 transition-all duration-500 border border-blue-500/40">
                   BEGINNER FRIENDLY
                 </div>
               </div>
               
               <div className="h-40 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-gray-900 transition-all duration-700 shadow-inner">
                 <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700 hover:rotate-y-180">
                   <svg className="w-20 h-20 text-gray-400 opacity-80 group-hover:opacity-100 group-hover:text-gray-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                   </svg>
                   <div className="absolute inset-0 bg-gray-400/30 rounded-full blur-3xl group-hover:bg-gray-300/50 transition-all duration-700 animate-pulse"></div>
                   <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/15 to-gray-400/15 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-700"></div>
               </div>
               
               <div className="p-6">
                 <MetallicText 
                   text="AI for Beginners" 
                   className="text-2xl mb-3 border-l-2 border-blue-500/40 pl-3" 
                   theme="blue" 
                   size="md" 
                   withGlow={true} 
                 />
                 <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">60-minute foundational coaching call to educate on AI fundamentals. Get the ability to comprehend exactly what all bots/tools are, how to use them, and a strong overview to help you decide what to do with AI.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">15 min consultation call/Google Meet</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">60 min Google Meet presentation</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Full report start-finish action plan</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Unlimited ongoing email support</span>
                   </div>
                 </div>
                 
                 <div className="text-center mb-6">
                   <div className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-white transition-all duration-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]"><span className="line-through text-gray-500 text-3xl">A$300</span> <span>A$250</span></div>
                   <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-500">September 2025 special offer</div>
                 </div>
                 
                 <UnifiedCheckoutButton 
                   product={{
                     id: 'ai-for-beginners-support',
                     name: 'VAI Beginners Mastery',
                     price: 250
                   }}
                   className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-700 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm transform group-hover:scale-110 group-hover:shadow-[0_15px_35px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_20px_45px_-5px_rgba(59,130,246,0.8)] border border-blue-500/30 hover:border-blue-400/60"
                   variant="direct"
                 >
                   Schedule Consultation
                 </UnifiedCheckoutButton>
               </div>
             </div>
             
             {/* VAI Web Development Elite */}
             <div className="group relative bg-gradient-to-br from-black/80 via-gray-900/60 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] hover:shadow-[0_35px_60px_-12px_rgba(59,130,246,0.4)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-blue-500/30 hover:border-blue-400/60">
               <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 via-indigo-600/50 to-blue-600/50 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
               
               <div className="absolute top-4 left-4 z-20">
                 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(59,130,246,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(59,130,246,0.8)] transform hover:scale-110 transition-all duration-500 border border-blue-400/30">
                   PROFESSIONAL
                 </div>
               </div>
               
               <div className="h-40 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-black transition-all duration-700 shadow-inner">
                 <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700 hover:rotate-y-180">
                   <svg className="w-20 h-20 text-blue-400 opacity-80 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                   </svg>
                   <div className="absolute inset-0 bg-blue-400/40 rounded-full blur-3xl group-hover:bg-blue-400/70 transition-all duration-700 animate-pulse"></div>
                   <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
               </div>
               
               <div className="p-6">
                 <MetallicText 
                   text="AI for Web Developers" 
                   className="text-2xl mb-3 border-l-2 border-blue-500/40 pl-3" 
                   theme="blue" 
                   size="md" 
                   withGlow={true} 
                 />
                 <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">60-minute foundational coaching call teaching start-to-finish how to build an online platform with AI/coding. No experience required - complete guidance from concept to deployment.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">15 min consultation call/Google Meet</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">60 min Google Meet presentation</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Full report start-finish action plan</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Unlimited ongoing email support</span>
                   </div>
                 </div>
                 
                 <div className="text-center mb-6">
                   <div className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-500"><span className="line-through text-gray-500 text-3xl">A$300</span> <span>A$250</span></div>
                   <div className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors duration-300">September 2025 special offer</div>
                 </div>
                 
                 <UnifiedCheckoutButton 
                   product={{
                     id: 'ai-web-development-support',
                     name: 'VAI Web Development Elite',
                     price: 250
                   }}
                   className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/40"
                   variant="direct"
                 >
                   Book Technical Review
                 </UnifiedCheckoutButton>
               </div>
             </div>
             
             {/* AI Business Strategy Session */}
             <div className="group relative bg-gradient-to-br from-black/80 via-gray-900/60 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] hover:shadow-[0_35px_60px_-12px_rgba(147,51,234,0.4)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-purple-500/30 hover:border-purple-400/60">
               <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-violet-600/50 to-purple-600/50 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
               
               <div className="absolute top-4 left-4 z-20">
                 <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(147,51,234,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(147,51,234,0.8)] transform hover:scale-110 transition-all duration-500 border border-purple-400/30">
                   ENTERPRISE
                 </div>
               </div>
               
               <div className="h-40 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-black transition-all duration-700 shadow-inner">
                 <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700 hover:rotate-y-180">
                   <svg className="w-20 h-20 text-purple-400 opacity-80 group-hover:opacity-100 group-hover:text-purple-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(147,51,234,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                   <div className="absolute inset-0 bg-purple-400/40 rounded-full blur-3xl group-hover:bg-purple-400/70 transition-all duration-700 animate-pulse"></div>
                   <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-700"></div>
               </div>
               
               <div className="p-6">
                 <MetallicText 
                   text="AI for Business" 
                   className="text-2xl mb-3" 
                   theme="purple" 
                   size="md" 
                   withGlow={true} 
                 />
                 <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">60-minute foundational coaching call providing strategic assistance with using AI to optimize your business online specifically. Learn how to leverage AI for maximum business impact.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">15 min consultation call/Google Meet</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">60 min Google Meet presentation</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">Full report start-finish action plan</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">Unlimited ongoing email support</span>
                   </div>
                 </div>
                 
                 <div className="text-center mb-6">
                   <div className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-400 transition-all duration-500"><span className="line-through text-gray-500 text-3xl">A$300</span> <span>A$250</span></div>
                   <div className="text-xs text-gray-400 group-hover:text-purple-300 transition-colors duration-300">September 2025 special offer</div>
                 </div>
                 
                 <UnifiedCheckoutButton 
                   product={{
                     id: 'ai-business-support',
                     name: 'AI Business Strategy Session',
                     price: 250
                   }}
                   className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/40"
                   variant="direct"
                 >
                   Book Strategy Session
                 </UnifiedCheckoutButton>
               </div>
             </div>
           </div>
           

         </div>
       </section>
       
       {/* Company Information Section */}
       <section className="py-8 bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
         <div className="container mx-auto px-6 max-w-5xl relative z-10">

         </div>
       </section>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

      {/* Pricing Tiers Section */}
      <section className="py-24 relative overflow-hidden z-10">
        {/* Professional Dark Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-slate-700/10 to-slate-900/10 rounded-2xl rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-slate-600/10 to-slate-800/10 rounded-xl rotate-45"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-slate-500/5 to-slate-700/5 rounded-full"></div>
        </div>
      </section>
        


      {/* Additional Services Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            {/* Additional Services Header */}
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl">
                Premium <span className="text-white border-l-4 border-blue-500/40 pl-4">Services & Resources</span>
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Professional support and premium resources to accelerate your success.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
            <style jsx>{`
              .glass-panel {
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
              }
              
              .premium-button-glow {
                position: relative;
              }
              
              .premium-button-glow:hover {
                box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
              }
            `}</style>
            


            {/* Support Packages - Removed per user request */}

            {/* $10 Prompts - Credibility Offer */}
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-blue-500/40 hover:border-blue-500/60">
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  STARTER
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg border-l-2 border-blue-500/40 pl-3">AI Prompts Arsenal</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">30 professionally crafted AI prompts for strategic business development.</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Strategic platform development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Self-directed implementation</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-500">A$10</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={{
                    id: 'ai-prompts-arsenal-2025',
                    name: 'AI Prompts',
                    price: 10,
                    productType: 'digital'
                  }}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                  variant="direct"
                >
                  Get Prompts
                </UnifiedCheckoutButton>
              </div>
            </div>

            {/* $25 Ebook - Credibility Offer */}
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-blue-500/40 hover:border-blue-500/60">
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  STARTER
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg border-l-2 border-blue-500/40 pl-3">AI Mastery Guide</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">Comprehensive AI tools mastery guide for professional business development.</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Strategic business development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Independent AI implementation</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">A$25</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={{
                    id: 'ai-tools-mastery-guide-2025',
                    name: 'AI Ebook',
                    price: 25,
                    productType: 'digital'
                  }}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                  variant="direct"
                >
                  Get Ebook
                </UnifiedCheckoutButton>
              </div>
            </div>


          </div>
          
          <div className="text-center mt-16">
            <p className="text-lg text-gray-200 mb-8 font-medium">
              Not sure which plan is right for you? <Link href="/contact" className="text-blue-400 hover:text-blue-300 font-semibold underline glow-text">Get in touch</Link> and we'll help you choose.
            </p>
            <Link href="/products" className="group relative inline-flex items-center px-12 py-5 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-slate-600/40 hover:shadow-slate-500/20">
              <span className="relative z-10">View All Products</span>
              <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>



      {/* Duplicate form section removed - now using single form at top */}



      {/* Elite Benefits Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 glow-text">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ventaro AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've been implementing AI into businesses for 2+ years before most people even knew ChatGPT existed. This platform itself was built from scratch with AI - every element crafted through cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Row 1 - DIY and Custom Solutions First */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-blue-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Ahead of the AI Curve</h3>
              <p className="text-gray-300 leading-relaxed">
                From zero experience to industry leaders in just 6 months, thanks to 2+ years of AI implementation before most were even aware of ChatGPT. We're at the forefront as AI evolves.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-purple-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Full Code Ownership</h3>
              <p className="text-gray-300 leading-relaxed">
                Own your entire codebase with maximum flexibility. Unlike platform-dependent solutions, if they go out of business, your business doesn't. Protect yourself with true ownership.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-blue-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Unbeatable Value</h3>
              <p className="text-gray-300 leading-relaxed">
                More cost-effective than other coaching offerings. It seems too good to be true, but AI makes it possible. We're the real deal with real offerings - this is a no-brainer.
              </p>
            </div>

            {/* Row 2 - Digital Delivery Benefits */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-orange-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">AI Adapts, We Adapt</h3>
              <p className="text-gray-300 leading-relaxed">
                As AI technology evolves, so do we. Our continuous innovation ensures you're always equipped with the latest AI strategies and implementations for sustained competitive advantage.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-cyan-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Proven Track Record</h3>
              <p className="text-gray-300 leading-relaxed">
                This very platform showcases our expertise - built entirely from scratch using AI. From concept to execution, we demonstrate what's possible when you combine vision with cutting-edge technology.
              </p>
            </div>



            {/* Row 3 - Strategic Advantages */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-rose-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">First-Mover Advantage</h3>
              <p className="text-gray-300 leading-relaxed">
                While others are just discovering AI's potential, we've been perfecting implementation strategies for years. Partner with pioneers who've already solved the problems you're facing.
              </p>
            </div>

            {/* Beat Content Saturation section removed */}

            {/* Brand Over Tech Advantage section removed */}

            {/* Row 4 - Intentionally left empty */}


            {/* Row 5 */}
            {/* Rare Value Proposition section removed */}

            {/* Row 6 - Intentionally left empty */}

          </div>
        </div>
      </section>

      {/* Premium AI Business Coaching */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-gray-950 to-black overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(229,231,235,0.15),transparent_50%)] opacity-80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(209,213,219,0.15),transparent_50%)] opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] animate-pulse"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-500/40 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-gray-600/30 rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          {/* Premium Glass Container */}
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-12 md:p-16">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-gray-400/10 to-gray-300/10 rounded-3xl blur-xl"></div>
            
            <div className="relative text-center">
              <h2 className="text-6xl md:text-7xl font-black mb-8 text-white leading-tight">
                <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-blue-400/20 after:to-transparent">
                  Master AI for
                </span>
                <span className="block text-white mt-4 border-l-4 border-gray-400 border-b-blue-400/30 pl-6 ml-4">
                  Business Success
                </span>
              </h2>
              
              <p className="text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Transform your business with AI. Get strategic insights, practical tools, and expert guidance to implement AI solutions that drive measurable results.
              </p>
              
              {/* Elite Special Offer Section */}
              <div className="relative mb-12 perspective-1000">
                {/* Enhanced 3D Background Elements */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <div className="group relative bg-gradient-to-br from-black/90 via-gray-900/80 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_35px_70px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_45px_80px_-12px_rgba(59,130,246,0.4)] transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 overflow-hidden border-2 border-blue-500/40 hover:border-blue-400/80">
                  <div className="absolute inset-0 rounded-3xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                  
                  {/* Premium Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_8px_25px_-8px_rgba(59,130,246,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(59,130,246,0.8)] transform hover:scale-110 transition-all duration-500 border border-blue-400/30">
                      LIMITED TIME OFFER
                    </div>
                  </div>
                  
                  <div className="relative p-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/30 rounded-full px-6 py-3 mb-8 shadow-2xl shadow-black/40 transform group-hover:scale-105 transition-all duration-500">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                      <span className="text-gray-300 font-bold text-sm uppercase tracking-wider drop-shadow-lg">September 2025 Special</span>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    </div>
                    
                    <div className="relative mb-8">
                      <MetallicText 
                        text="Only $250" 
                        className="text-5xl md:text-7xl mb-4 font-black" 
                        theme="blue" 
                        size="xl" 
                        withGlow={true} 
                      />
                      <div className="text-slate-300 text-xl md:text-2xl font-light mb-2 group-hover:text-white transition-colors duration-500">Premium AI Business Coaching Calls</div>
                      <div className="text-gray-400 text-lg line-through opacity-75">Regular Price: $300</div>
                    </div>
                    
                    {/* Enhanced Features List */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
                      <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300">
                        <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                        <span className="text-gray-300 group-hover:text-blue-200 transition-colors duration-300 font-medium">60-min Google Meet call</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                        <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                        <span className="text-gray-300 group-hover:text-blue-200 transition-colors duration-300 font-medium">Unlimited email support</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                        <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                        <span className="text-gray-300 group-hover:text-blue-200 transition-colors duration-300 font-medium">AI strategy cheat sheet</span>
                      </div>
                    </div>
                    
                    <UnifiedCheckoutButton 
                      product={{
                        id: 'ai-business-support',
                        name: 'Premium AI Business Coaching',
                        price: 250
                      }}
                      className="group/btn relative inline-flex items-center px-6 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-700 transform hover:scale-110 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.6)] border border-blue-500/30 hover:border-blue-400/60 shadow-[0_15px_35px_-5px_rgba(59,130,246,0.3)] tap-target w-full sm:w-auto"
                      variant="direct"
                    >
                      <span className="relative z-10 tracking-wide drop-shadow-lg text-center flex-grow sm:flex-grow-0">Book Your Coaching Call Now - A$250</span>
                      <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                      <div className="ml-2 sm:ml-4 text-lg sm:text-xl lg:text-2xl group-hover/btn:translate-x-2 transition-transform duration-300 drop-shadow-lg">→</div>
                      <div className="absolute -inset-1 bg-blue-500/30 rounded-xl sm:rounded-2xl blur opacity-0 group-hover/btn:opacity-50 transition-opacity duration-700"></div>
                    </UnifiedCheckoutButton>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8 group-hover:text-gray-300 transition-colors duration-500">
                      <div className="flex items-center transform group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Immediate booking available</span>
                      </div>
                      <div className="flex items-center transform group-hover:scale-105 transition-transform duration-300" style={{transitionDelay: '0.1s'}}>
                        <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="font-medium">100% satisfaction guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
      

      
      {/* Floating Quote Button */}
      {/* <FloatingQuoteButton onClick={scrollToContactForm} /> */}
      
      {/* AI Chat functionality is now handled by GlobalWidgets component */}
    </>
  )
}