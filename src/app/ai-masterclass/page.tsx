'use client'
import Link from 'next/link'

import SubscriptionForm from '@/components/SubscriptionForm'
import AnimatedHeading from '@/components/AnimatedHeading'

export default function AIMasterclass() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Simple Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/vai-coaching" className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent hover:from-white hover:to-gray-300 transition-all duration-300">
              VAI Coaching
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-gray-600 to-gray-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
              AI Business Launch Blueprint
            </div>
            <AnimatedHeading
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              animation="slide-up"
              theme="silver"
              is3D={true}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                VAI
              </span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Masterclass</span>
            </AnimatedHeading>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Step-by-step video lessons and full report on building an online platform with AI. Complete walkthrough from start to finish.
                </span>
              </p>
          </div>
          

        </div>
      </section>



      {/* Simple CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/10"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center">
            <AnimatedHeading
              className="text-4xl md:text-5xl font-black text-white mb-6"
              animation="slide-up"
              theme="silver"
              is3D={true}
              delay={0.2}
            >
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Build Your Online Platform?</span>
            </AnimatedHeading>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Get exclusive access to our 60-minute video tutorial, step-by-step report, and unlimited email support for a month to build your online platform with AI from scratch.
            </p>
            
            {/* What You Get */}
            <div className="space-y-4 mb-8">
              <AnimatedHeading
                className="text-2xl font-bold text-gray-400 mb-4 text-center"
                animation="fade"
                theme="silver"
                delay={0.3}
              >
                What You Get:
              </AnimatedHeading>
              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300"><strong className="text-white">60-Minute Video Tutorial:</strong> Complete walkthrough of building an online platform with AI from start to finish</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300"><strong className="text-white">Step-by-Step Report:</strong> Detailed written guide with all the steps needed to create your platform</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300"><strong className="text-white">Unlimited Email Support:</strong> Get expert help for a full month as you build your platform</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-black/95 via-gray-900/40 to-black/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-500/40 p-8 max-w-md mx-auto">
              <div className="text-center mb-8">
                <AnimatedHeading
                  className="text-5xl font-black mb-2"
                  animation="glow"
                  theme="silver"
                  delay={0.4}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Coming Soon
                  </span>
                </AnimatedHeading>
                <div className="text-gray-400">Subscribe for first access</div>
              </div>
              
              <SubscriptionForm 
                source="ai-masterclass"
                title="Subscribe for First Access"
                description="Join the waitlist for exclusive early access to VAI Masterclass"
                buttonText="Get First Access →"
              />
            </div>
          </div>
        </div>
      </section>


    </main>
  )
}