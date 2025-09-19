'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ScrollReveal from '../../components/ScrollReveal';
import AnimatedHeading from '../../components/AnimatedHeading';

export default function VAIAgentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [prospectNames, setProspectNames] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<'prospect' | 'content' | 'sales' | null>('prospect');

  const handleProspectAnalysis = async () => {
    if (!prospectNames.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      const names = prospectNames.split('\n').filter(name => name.trim()).slice(0, 10);
      const mockResults = names.map(name => ({
        name: name.trim(),
        company: `${name.trim().split(' ')[0]} Corp`,
        role: 'CEO',
        industry: 'Technology',
        linkedinProfile: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`,
        email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
        interests: ['AI', 'Business Growth', 'Innovation'],
        recentActivity: 'Posted about AI transformation',
        contactScore: Math.floor(Math.random() * 40) + 60
      }));
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-600/5 to-blue-600/5 rounded-full blur-3xl"></div>
      
      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <span className="text-white font-bold text-xl">VAI Agents</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2">
            <span>← Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 mb-8">
              <span className="text-blue-300 text-sm font-bold tracking-wide">🚀 ELITE AI AGENTS SUITE</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.3}>
            <AnimatedHeading 
              className="text-5xl md:text-7xl mb-8" 
              animation="slide-up" 
              theme="blue" 
              is3D={true}
            >
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                VAI Agents
              </span>
            </AnimatedHeading>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.5}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              🎯 <strong className="text-white">Elite AI-Powered Business Intelligence</strong> • Automate prospect research, content creation, and sales outreach with military-grade precision
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.7}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
                <span className="text-emerald-400">✅</span>
                <span className="text-gray-200 font-medium">Bulk Analysis (10x Names)</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
                <span className="text-blue-400">⚡</span>
                <span className="text-gray-200 font-medium">Real-time Intelligence</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
                <span className="text-purple-400">🎯</span>
                <span className="text-gray-200 font-medium">Elite Precision</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Agent Selection Tabs */}
      <section className="relative z-10 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 flex space-x-2">
              {[
                { id: 'prospect', name: '🔍 Prospect Research', emoji: '🔍' },
                { id: 'content', name: '📝 Content Creator', emoji: '📝', comingSoon: true },
                { id: 'sales', name: '💼 Sales Outreach', emoji: '💼', comingSoon: true }
              ].map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => !agent.comingSoon && setSelectedAgent(agent.id as any)}
                  className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedAgent === agent.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : agent.comingSoon
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  disabled={agent.comingSoon}
                >
                  <span className="flex items-center space-x-2">
                    <span>{agent.emoji}</span>
                    <span>{agent.name}</span>
                    {agent.comingSoon && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">SOON</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prospect Research Agent */}
      {selectedAgent === 'prospect' && (
        <section className="relative z-10 pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Input Section */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Prospect Research Agent</h3>
                    <p className="text-gray-400">Elite intelligence gathering • Up to 10 prospects</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      📋 Enter Prospect Names (One per line, max 10)
                    </label>
                    <textarea
                      value={prospectNames}
                      onChange={(e) => setProspectNames(e.target.value)}
                      placeholder={`John Smith\nSarah Johnson\nMichael Chen\nEmily Davis\nRobert Wilson`}
                      className="w-full h-48 p-4 bg-black/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {prospectNames.split('\n').filter(name => name.trim()).length}/10 prospects
                      </span>
                      <span className="text-xs text-gray-500">
                        {prospectNames.length}/500 characters
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProspectAnalysis}
                    disabled={!prospectNames.trim() || isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>🧠 Analyzing Prospects...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Start Elite Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Results Section */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Intelligence Report</h3>
                    <p className="text-gray-400">Comprehensive prospect breakdown</p>
                  </div>
                </div>
                
                {!analysisResults ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-3">Ready for Elite Analysis</h4>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Enter prospect names and click "Start Elite Analysis" to get comprehensive intelligence reports with contact details, social profiles, and engagement strategies.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {analysisResults.map((prospect: any, index: number) => (
                      <div key={index} className="bg-black/40 border border-gray-600/30 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="text-lg font-bold text-white">{prospect.name}</h5>
                            <p className="text-blue-400 text-sm">{prospect.role} at {prospect.company}</p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              prospect.contactScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                              prospect.contactScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              🎯 {prospect.contactScore}% Match
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">📧 Email:</span>
                            <p className="text-white font-mono text-xs">{prospect.email}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">🏢 Industry:</span>
                            <p className="text-white">{prospect.industry}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-400">💡 Interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prospect.interests.map((interest: string, i: number) => (
                                <span key={i} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-400">📱 Recent Activity:</span>
                            <p className="text-gray-300 text-xs">{prospect.recentActivity}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <a 
                            href={prospect.linkedinProfile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-300"
                          >
                            🔗 LinkedIn
                          </a>
                          <button className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-300">
                            📧 Email Template
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Agents */}
      {(selectedAgent === 'content' || selectedAgent === 'sales') && (
        <section className="relative z-10 pb-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-16 shadow-2xl">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">
                  {selectedAgent === 'content' ? '📝' : '💼'}
                </span>
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-6">
                {selectedAgent === 'content' ? '📝 Content Creator Agent' : '💼 Sales Outreach Agent'}
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {selectedAgent === 'content' 
                  ? '🚀 Elite AI-powered content creation • Blog posts, social media, email campaigns • Coming very soon with advanced personalization'
                  : '🎯 Automated sales outreach sequences • Personalized emails, follow-ups, CRM integration • Coming very soon with elite precision'
                }
              </p>
              
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30">
                <span className="text-purple-300 font-bold tracking-wide">🔥 COMING VERY SOON</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="relative z-10 pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-6">🚀 Ready to Dominate Your Market?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join elite businesses using VAI Agents for competitive intelligence and automated outreach. Get started with our Prospect Research Agent today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <span>💬</span>
                <span>Get Elite Access</span>
              </Link>
              
              <Link 
                href="/" 
                className="bg-white/5 hover:bg-white/10 border border-gray-600/50 hover:border-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🏠</span>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}