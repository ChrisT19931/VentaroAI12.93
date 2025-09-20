'use client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'marketing-copy',
    name: 'Marketing Copy Generator',
    category: 'Marketing',
    template: 'Create compelling marketing copy for {product} targeting {audience}. The tone should be {tone} and focus on {benefit}. Include a strong call-to-action.',
    variables: ['product', 'audience', 'tone', 'benefit']
  },
  {
    id: 'business-strategy',
    name: 'Business Strategy Advisor',
    category: 'Strategy',
    template: 'Analyze the business model for {business_type} in the {industry} industry. Provide strategic recommendations for {goal} considering {constraints}.',
    variables: ['business_type', 'industry', 'goal', 'constraints']
  },
  {
    id: 'content-creator',
    name: 'Content Creation Assistant',
    category: 'Content',
    template: 'Generate {content_type} content about {topic} for {platform}. The content should be {style} and approximately {length} in length.',
    variables: ['content_type', 'topic', 'platform', 'style', 'length']
  },
  {
    id: 'code-reviewer',
    name: 'Code Review Assistant',
    category: 'Development',
    template: 'Review this {language} code for {purpose}. Focus on {review_type} and provide suggestions for improvement. Code: {code}',
    variables: ['language', 'purpose', 'review_type', 'code']
  },
  {
    id: 'email-writer',
    name: 'Professional Email Writer',
    category: 'Communication',
    template: 'Write a professional email to {recipient} about {subject}. The tone should be {tone} and include {key_points}.',
    variables: ['recipient', 'subject', 'tone', 'key_points']
  }
];

const PromptGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setVariables({});
    setGeneratedPrompt('');
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: value }));
  };

  const generatePrompt = () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      let prompt = selectedTemplate.template;
      
      selectedTemplate.variables.forEach(variable => {
        const value = variables[variable] || `[${variable}]`;
        prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), value);
      });
      
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      toast.success('Prompt generated successfully!');
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success('Prompt copied to clipboard!');
  };

  const categories = [...new Set(promptTemplates.map(t => t.category))];

  return (
    <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Prompt Generator
          </span>
        </h3>
        <p className="text-gray-300 text-lg">
          Generate professional AI prompts for any business need - completely free!
        </p>
      </div>

      {/* Template Selection */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-white mb-4">Choose a Template</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promptTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-400 hover:bg-blue-400/5'
              }`}
            >
              <div className="text-sm text-blue-400 font-medium mb-1">{template.category}</div>
              <div className="font-semibold">{template.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Variable Inputs */}
      {selectedTemplate && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-white mb-4">Fill in the Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.variables.map((variable) => (
              <div key={variable}>
                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                  {variable.replace('_', ' ')}
                </label>
                <input
                  type="text"
                  value={variables[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder={`Enter ${variable.replace('_', ' ')}`}
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={generatePrompt}
            disabled={isGenerating || selectedTemplate.variables.some(v => !variables[v])}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Prompt'
            )}
          </button>
        </div>
      )}

      {/* Generated Prompt */}
      {generatedPrompt && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-white mb-4">Your Generated Prompt</h4>
          <div className="relative">
            <textarea
              value={generatedPrompt}
              readOnly
              className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors duration-300"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pt-6 border-t border-gray-700/50">
        <p className="text-gray-300 mb-4">
          Want custom AI solutions for your business?
        </p>
        <button
          onClick={() => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
              contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Get Custom Solution
        </button>
      </div>
    </div>
  );
};

export default PromptGenerator;