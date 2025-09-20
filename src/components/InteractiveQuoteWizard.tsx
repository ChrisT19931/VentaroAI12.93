'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface QuoteData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  description: string;
  goals: string;
}

interface Question {
  id: keyof QuoteData;
  question: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  placeholder?: string;
  subtitle?: string;
}

const questions: Question[] = [
  {
    id: 'projectType',
    question: "What type of AI solution do you need?",
    type: 'select',
    subtitle: 'Choose the option that best fits your needs',
    options: [
      { value: 'saas', label: 'SaaS Platform' },
      { value: 'chatbot', label: 'AI Chatbot' },
      { value: 'automation', label: 'Automation' },
      { value: 'ecommerce', label: 'Ecommerce Online Business' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'custom', label: 'Custom Solution' }
    ]
  },
  {
    id: 'timeline',
    question: "When do you need this completed?",
    type: 'select',
    subtitle: 'This helps us plan resources and pricing',
    options: [
      { value: 'asap', label: 'ASAP - Rush job (premium pricing)' },
      { value: '1-2weeks', label: '1-2 Weeks - Fast delivery' },
      { value: '3-4weeks', label: '3-4 Weeks - Standard timeline' },
      { value: '1-2months', label: '1-2 Months - Complex project' },
      { value: '3+months', label: '3+ Months - Enterprise solution' }
    ]
  },
  {
    id: 'budget',
    question: "What's your budget range?",
    type: 'select',
    subtitle: 'This helps us recommend the best approach',
    options: [
      { value: 'under-1k', label: 'Under $1,000 - Simple solution' },
      { value: '1k-5k', label: '$1,000 - $5,000 - Standard project' },
      { value: '5k-15k', label: '$5,000 - $15,000 - Advanced features' },
      { value: '15k-50k', label: '$15,000 - $50,000 - Enterprise grade' },
      { value: '50k+', label: '$50,000+ - Premium solution' },
      { value: 'discuss', label: 'Let\'s discuss - Not sure yet' }
    ]
  },
  {
    id: 'description',
    question: "Tell us about your project",
    type: 'textarea',
    placeholder: 'Describe what you want to build, key features, target users, etc.',
    subtitle: 'The more details you share, the better we can help you'
  },
  {
    id: 'goals',
    question: "What are your main goals?",
    type: 'textarea',
    placeholder: 'What problems are you solving? What success looks like to you?',
    subtitle: 'Understanding your goals helps us design the perfect solution'
  },
  {
    id: 'name',
    question: "What's your name?",
    type: 'text',
    placeholder: 'Enter your full name',
    subtitle: 'We like to know who we\'re talking to'
  },
  {
    id: 'email',
    question: "What's your email address?",
    type: 'email',
    placeholder: 'your@email.com',
    subtitle: 'We\'ll send your custom solution proposal here'
  },
  {
    id: 'company',
    question: "What's your company name?",
    type: 'text',
    placeholder: 'Your company or organization',
    subtitle: 'Or just say "Personal" if it\'s for yourself'
  }
];

export default function InteractiveQuoteWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    timeline: '',
    budget: '',
    description: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    const currentValue = quoteData[currentQuestion.id];
    if (!currentValue.trim()) {
      toast.error('Please answer this question before continuing');
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setQuoteData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteData.name,
          email: quoteData.email,
          subject: `Custom AI Solution Request - ${quoteData.projectType}`,
          message: `
COMPANY: ${quoteData.company}
PROJECT TYPE: ${quoteData.projectType}
TIMELINE: ${quoteData.timeline}
BUDGET: ${quoteData.budget}

PROJECT DESCRIPTION:
${quoteData.description}

GOALS & OBJECTIVES:
${quoteData.goals}

---
This quote request was submitted through the interactive qualification wizard.
`,
          recipient: 'chris.t@ventarosales.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send quote request');
      }

      toast.success('Solution request sent! We\'ll review your requirements and send a detailed proposal within 24 hours.');
      
      // Reset form
      setQuoteData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        timeline: '',
        budget: '',
        description: '',
        goals: ''
      });
      setCurrentStep(0);
      setShowReview(false);
    } catch (error) {
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProjectTypeLabel = (value: string) => {
    const option = questions.find(q => q.id === 'projectType')?.options?.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getTimelineLabel = (value: string) => {
    const option = questions.find(q => q.id === 'timeline')?.options?.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getBudgetLabel = (value: string) => {
    const option = questions.find(q => q.id === 'budget')?.options?.find(opt => opt.value === value);
    return option?.label || value;
  };

  if (showReview) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] max-w-4xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Review Your Request</h2>
          <p className="text-gray-400 text-lg">Please review your information before we send your custom quote</p>
        </motion.div>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Name:</span>
                <p className="text-white font-medium">{quoteData.name}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Email:</span>
                <p className="text-white font-medium">{quoteData.email}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-400 text-sm">Company:</span>
                <p className="text-white font-medium">{quoteData.company}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
            <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 text-sm">Project Type:</span>
                <p className="text-white font-medium">{getProjectTypeLabel(quoteData.projectType)}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Timeline:</span>
                  <p className="text-white font-medium">{getTimelineLabel(quoteData.timeline)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Budget:</span>
                  <p className="text-white font-medium">{getBudgetLabel(quoteData.budget)}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Description:</span>
                <p className="text-white font-medium">{quoteData.description}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Goals:</span>
                <p className="text-white font-medium">{quoteData.goals}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300"
          >
            ← Edit Information
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Solution Request...
              </>
            ) : (
              'Send Solution Request →'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] max-w-4xl mx-auto mb-20">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Question {currentStep + 1} of {questions.length}</span>
          <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{currentQuestion.question}</h2>
          {currentQuestion.subtitle && (
            <p className="text-gray-400 text-lg">{currentQuestion.subtitle}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`input-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {currentQuestion.type === 'select' ? (
            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange(option.value)}
                  className={`p-4 text-left rounded-xl border transition-all duration-300 hover:scale-105 ${
                    quoteData[currentQuestion.id] === option.value
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:border-blue-500/50 hover:bg-gray-700/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : currentQuestion.type === 'textarea' ? (
            <div className="max-w-2xl mx-auto">
              <textarea
                value={quoteData[currentQuestion.id]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={6}
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none text-lg"
              />
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <input
                type={currentQuestion.type}
                value={quoteData[currentQuestion.id]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg text-center"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNext();
                  }
                }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)]"
        >
          {currentStep === questions.length - 1 ? 'Review →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}