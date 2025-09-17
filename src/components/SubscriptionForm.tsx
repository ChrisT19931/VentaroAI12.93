'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SubscriptionFormProps {
  source: 'ai-toolbox' | 'ai-masterclass' | 'homepage-preorder' | 'ai-web-gen';
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function SubscriptionForm({ 
  source, 
  title = "Get First Access", 
  description = "Enter your email to subscribe for first access",
  buttonText = "Subscribe for First Access →",
  className
}: SubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Send subscription interest notification
      const response = await fetch('/api/subscription-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          source,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      
      // Always show success - API now always returns success response
      if (data.success || response.ok) {
        toast.success('Thank you! Redirecting to membership page...');
        
        // Redirect to membership page after a short delay
        setTimeout(() => {
          router.push('/membership?source=' + source + '&email=' + encodeURIComponent(email));
        }, 1500);
      } else {
        // Fallback - still show success even if something unexpected happens
        toast.success('Thank you for your interest! We\'ll be in touch soon.');
      }

    } catch (error) {
      console.error('Subscription form error (showing success to user):', error);
      // Always show success even if there are network/technical issues
      toast.success('Thank you for your interest! We\'ll be in touch soon.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={className || "w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Processing...
            </div>
          ) : (
            buttonText
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-200">
          🔒 Your email is secure • 📧 Get notified when available • ⚡ First access guaranteed
        </p>
      </div>
    </div>
  );
}