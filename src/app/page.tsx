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
       
       {/* Custom Solutions Section - Cloned from /custom-solutions */}
       <section className="relative py-20 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-transparent to-blue-950/10"></div>
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
         
         {/* Enhanced 3D Background Elements */}
         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/30 rounded-full px-8 py-4 mb-8 shadow-2xl shadow-black/40 transform hover:scale-105 transition-all duration-500">
               <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
               <span className="text-gray-300 font-bold text-sm uppercase tracking-wider drop-shadow-lg">ENTERPRISE AI SOLUTIONS</span>
               <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
             </div>
             
             <div className="relative">
               <div className="absolute -inset-1 bg-blue-500/10 rounded-lg blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
                 Transform Your Business <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">10x Faster</span>
               </h1>
             </div>
             
             <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
               <span className="text-white font-semibold">We take the guesswork out of AI implementation.</span> Tell us your needs and we'll create the perfect solution for your business. Save time, reduce complexity, and get results - we handle the technical details so you can focus on growth.
             </p>
           </div>

           {/* Services Grid */}
           <div className="mb-20">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">
                 <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">Accelerate Your Success</span>
               </h2>
               <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                 Speed is everything. We compress months of development into weeks, delivering everything from rapid prototypes to enterprise transformations.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                 <div key={index} className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(59,130,246,0.3)] transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 overflow-hidden border border-gray-700/30 hover:border-blue-500/50">
                   <div className="absolute inset-0 rounded-3xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">{service.title}</h3>
                     <p className="text-gray-400 mb-4 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{service.description}</p>
                     <ul className="space-y-2">
                       {service.features.map((feature, featureIndex) => (
                         <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                           <div className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-300"></div>
                           <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Business Examples */}
           <div className="mb-20">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Perfect for Every Business</h2>
               <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                 Tell us your needs and we'll create the perfect AI solution for your business. We take the guesswork out of implementation and deliver results that matter.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                 <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                   <div className="text-blue-400 font-semibold text-sm mb-2 group-hover:text-blue-300 transition-colors duration-300">{example.type}</div>
                   <div className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">{example.solution}</div>
                 </div>
               ))}
             </div>
           </div>

           {/* Interactive Quote Wizard Section */}
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
               Get Your Custom Quote
             </h2>
             <p className="text-xl text-gray-300 max-w-3xl mx-auto">
               Let's understand your needs with a few quick questions. We'll provide a detailed proposal within 24 hours.
             </p>
           </div>
           
           <InteractiveQuoteWizard />

           {/* Process Section */}
           <div className="text-center mb-20">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Process</h2>
             <p className="text-gray-400 text-lg mb-12 max-w-3xl mx-auto">
               From concept to deployment, we handle everything with precision and speed.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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
                   <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                     <div className="text-4xl font-bold text-blue-400 mb-4 group-hover:text-blue-300 transition-colors duration-300">{process.step}</div>
                     <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">{process.title}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{process.description}</p>
                   </div>
                   {index < 3 && (
                     <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                       <svg className="w-8 h-8 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

       {/* NEW: AI Coaching Hero Section - Mobile First */}
       <section className="relative py-20 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/10 via-transparent to-emerald-950/10"></div>
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
         
         {/* Enhanced 3D Background Elements */}
         <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/3 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/30 rounded-full px-8 py-4 mb-8 shadow-2xl shadow-black/40 transform hover:scale-105 transition-all duration-500">
               <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
               <span className="text-gray-300 font-bold text-sm uppercase tracking-wider drop-shadow-lg">EXECUTIVE AI COACHING</span>
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
             </div>
             
             <div className="relative">
               <div className="absolute -inset-1 bg-emerald-500/10 rounded-lg blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <AnimatedHeading 
                 className="text-4xl md:text-6xl mb-8 leading-tight" 
                 animation="slide-up" 
                 theme="silver" 
                 is3D={true}
               >
                 <span className="drop-shadow-2xl">VAI </span>
                 <span className="text-white drop-shadow-2xl border-l-4 border-blue-500/40 pl-4">Coaching</span>
               </AnimatedHeading>
             </div>
             
             <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-4xl mx-auto drop-shadow-xl transform hover:scale-102 transition-all duration-500 font-light premium-heading-animation" style={{animationDelay: '0.2s'}}>
               <span className="text-white font-semibold">No restrictions. No limitations.</span> From solo entrepreneurs to Fortune 500 enterprises - we deliver professional AI solutions that transform businesses at every scale. Whether you're starting your first venture or optimizing complex operations, our expertise adapts to your needs.
             </p>
           </div>
           
           {/* Mobile-First Coaching Cards with Enhanced 3D Effects */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 perspective-1000">
             {/* VAI Beginners Mastery */}
             <div className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(16,185,129,0.3)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-emerald-500/40 hover:border-emerald-400/80">
               <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-1 bg-emerald-500/20 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
               
               <div className="absolute top-4 left-4 z-20">
                 <div className="bg-gray-800/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.8)] transform hover:scale-110 transition-all duration-500 border border-emerald-500/40">
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
                   className="text-2xl mb-3 border-l-2 border-emerald-500/40 pl-3" 
                   theme="emerald" 
                   size="md" 
                   withGlow={true} 
                 />
                 <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">Perfect for sales professionals and entrepreneurs to get up to speed with AI tools, their uses, and how to best leverage them for your specific goals.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                     <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-emerald-200 transition-colors duration-300">60-min Google Meet coaching call</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                     <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-emerald-200 transition-colors duration-300">Unlimited 1-month email support</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                     <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-emerald-200 transition-colors duration-300">Complete AI beginner cheat sheet</span>
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
                   className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-700 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm transform group-hover:scale-110 group-hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.6)] hover:shadow-[0_20px_45px_-5px_rgba(16,185,129,0.8)] border border-emerald-500/30 hover:border-emerald-400/60"
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
                 <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">Learn how to use AI tools to create online platforms, SaaS applications, and web-based tools with modern development techniques.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">60-min Google Meet coaching call</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Unlimited 1-month email support</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                     <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Web development deployment cheat sheet</span>
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
                 <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">Designed for employers and business leaders to understand AI capabilities and how to effectively integrate them into your organization.</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">60-min Google Meet coaching call</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">Unlimited 1-month email support</span>
                   </div>
                   
                   <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                     <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                     <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">Business AI strategy cheat sheet</span>
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
           
           {/* Call to Action */}
           <div className="text-center">
             <p className="text-lg text-slate-400 mb-6 font-light">Serving <span className="text-white font-semibold">startups, SMBs, and enterprise clients</span> with equal dedication and expertise. Professional consulting sessions include strategic guidance, ongoing support, and implementation resources.</p>
             <Link href="/vai-coaching" className="inline-block bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-600 hover:to-gray-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-slate-500/30 border border-slate-600/50">
               View Consulting Programs
             </Link>
           </div>
         </div>
       </section>
       
       {/* Company Information Section */}
       <section className="py-8 bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
         <div className="container mx-auto px-6 max-w-5xl relative z-10">
           <div className="text-center">
             <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-600/40 rounded-2xl px-8 py-4 mb-6 shadow-2xl">
               <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
               <span className="text-gray-200 font-bold text-base uppercase tracking-wider">Founded in Melbourne, Australia</span>
               <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
             </div>
             
             <div className="bg-gradient-to-r from-gray-900/60 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
               <p className="text-xl text-gray-200 leading-relaxed font-medium">
                 <span className="text-white font-semibold">From individual entrepreneurs to multinational corporations</span> - we deliver the same level of professional excellence to every client. Our mission is simple: democratize AI expertise and make cutting-edge technology accessible to businesses of all sizes, without compromising on quality or results.
               </p>
             </div>
           </div>
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
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-emerald-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-emerald-500/40 hover:border-emerald-500/60">
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  STARTER
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:text-emerald-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl group-hover:bg-emerald-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg border-l-2 border-emerald-500/40 pl-3">AI Prompts Arsenal</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">30 professionally crafted AI prompts for strategic business development.</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Strategic platform development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Self-directed implementation</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-green-400 transition-all duration-500">A$10</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={{
                    id: 'ai-prompts-arsenal-2025',
                    name: 'AI Prompts',
                    price: 10,
                    productType: 'digital'
                  }}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/30"
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
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ventaro</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience excellence in digital innovation with our professional AI-powered solutions and strategic methodologies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Row 1 - DIY and Custom Solutions First */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-blue-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Self-Directed Business Development</h3>
              <p className="text-gray-300 leading-relaxed">
                Our comprehensive resources provide everything you need to build your own AI-powered business with professional guidance and strategic frameworks.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-purple-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Bespoke Platform Development</h3>
              <p className="text-gray-300 leading-relaxed">
                Partner with our expert development team to create professional custom platforms, from sophisticated landing pages to comprehensive e-commerce solutions.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-green-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Enterprise-Grade Content</h3>
              <p className="text-gray-300 leading-relaxed">
                All our solutions feature premium, professionally crafted content developed using cutting-edge AI technologies and industry best practices.
              </p>
            </div>

            {/* Row 2 - Digital Delivery Benefits */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-orange-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Immediate Digital Access</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive instant access to your purchased solutions through our streamlined, professional delivery platform.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-cyan-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Perpetual Access Rights</h3>
              <p className="text-gray-300 leading-relaxed">
                No subscriptions or recurring fees. Single payment provides permanent ownership of your digital assets with unlimited access.
              </p>
            </div>



            {/* Row 3 - Strategic Advantages */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-rose-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Strategic Market Positioning</h3>
              <p className="text-gray-300 leading-relaxed">
                Organizations establishing their presence and data assets now will maintain competitive advantages. Early positioning enables organic growth rather than paid acquisition.
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
                <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-emerald-400/20 after:to-transparent">
                  Master AI for
                </span>
                <span className="block text-white mt-4 border-l-4 border-gray-400 border-b-emerald-400/30 pl-6 ml-4">
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
                    
                    <Link 
                      href="/vai-coaching" 
                      className="group/btn relative inline-flex items-center px-16 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xl rounded-2xl transition-all duration-700 transform hover:scale-110 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.6)] border border-blue-500/30 hover:border-blue-400/60 shadow-[0_15px_35px_-5px_rgba(59,130,246,0.3)]">
                      <span className="relative z-10 tracking-wide drop-shadow-lg">Book Your Coaching Call Now</span>
                      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                      <div className="ml-4 text-2xl group-hover/btn:translate-x-2 transition-transform duration-300 drop-shadow-lg">→</div>
                      <div className="absolute -inset-1 bg-blue-500/30 rounded-2xl blur opacity-0 group-hover/btn:opacity-50 transition-opacity duration-700"></div>
                    </Link>
                    
                    <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm mt-8 group-hover:text-gray-300 transition-colors duration-500">
                      <div className="flex items-center transform group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Immediate booking available</span>
                      </div>
                      <div className="flex items-center transform group-hover:scale-105 transition-transform duration-300" style={{transitionDelay: '0.1s'}}>
                        <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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