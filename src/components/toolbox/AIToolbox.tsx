'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { getSupabaseClient } from '@/lib/supabase';
import {
  ToolboxTool,
  ToolboxApiResponse,
  ToolboxSearchForm,
  getTierBadgeColor,
  canAccessFeature,
  TIER_LEVELS,
  TIER_NAMES
} from '@/types/membership';

interface AIToolboxProps {
  className?: string;
}

const AIToolbox: React.FC<AIToolboxProps> = ({ className = '' }) => {
  const [tools, setTools] = useState<ToolboxTool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [userTierLevel, setUserTierLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchForm, setSearchForm] = useState<ToolboxSearchForm>({
    query: '',
    category: '',
    featured_only: false
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLockedOnly, setShowLockedOnly] = useState(false);

  const supabase = getSupabaseClient();

  useEffect(() => {
    loadToolboxData();
  }, []);

  const loadToolboxData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/toolbox');
      if (!response.ok) throw new Error('Failed to load toolbox data');
      
      const data: ToolboxApiResponse = await response.json();
      setTools(data.tools);
      setCategories(data.categories);
      setUserTierLevel(data.user_tier_level);
      
    } catch (error) {
      console.error('Error loading toolbox data:', error);
      toast.error('Failed to load AI toolbox');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolClick = async (tool: ToolboxTool) => {
    try {
      // Check if user has access
      if (!canAccessFeature(userTierLevel, tool.required_tier_level)) {
        toast.error(`This tool requires ${TIER_NAMES[tool.required_tier_level as keyof typeof TIER_NAMES]} tier or higher`);
        return;
      }

      // Track affiliate click
      if (tool.affiliate_url) {
        await fetch('/api/toolbox/track-click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tool_id: tool.id,
            clicked_url: tool.affiliate_url,
          }),
        });
        
        // Open affiliate URL
        window.open(tool.affiliate_url, '_blank', 'noopener,noreferrer');
      } else {
        // Open regular URL
        window.open(tool.url, '_blank', 'noopener,noreferrer');
      }
      
      toast.success(`Opening ${tool.name}...`);
      
    } catch (error) {
      console.error('Error tracking tool click:', error);
      // Still open the tool even if tracking fails
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // Search query filter
      if (searchForm.query) {
        const query = searchForm.query.toLowerCase();
        const matchesQuery = 
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Featured filter
      if (searchForm.featured_only && !tool.is_featured) {
        return false;
      }

      // Locked tools filter
      if (showLockedOnly) {
        return !canAccessFeature(userTierLevel, tool.required_tier_level);
      }

      return true;
    });
  }, [tools, searchForm, selectedCategory, showLockedOnly, userTierLevel]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, ToolboxTool[]> = {};
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  }, [filteredTools]);

  const getAccessBadge = (requiredLevel: number) => {
    const hasAccess = canAccessFeature(userTierLevel, requiredLevel);
    const tierName = TIER_NAMES[requiredLevel as keyof typeof TIER_NAMES];
    
    if (hasAccess) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Unlocked
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(requiredLevel)}`}>
        🔒 {tierName} Required
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">VAI Platform</h2>
            <p className="text-gray-600 mt-1">
              Coming soon: Automated web platform for building complete online sites and applications
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            Your tier: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierBadgeColor(userTierLevel)}`}>
              {TIER_NAMES[userTierLevel as keyof typeof TIER_NAMES]}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search AI tools..."
                value={searchForm.query}
                onChange={(e) => setSearchForm(prev => ({ ...prev, query: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={searchForm.featured_only}
                onChange={(e) => setSearchForm(prev => ({ ...prev, featured_only: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured only</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showLockedOnly}
                onChange={(e) => setShowLockedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show locked</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="p-6">
        {Object.keys(toolsByCategory).length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tools found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          Object.entries(toolsByCategory).map(([category, categoryTools]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                {category}
                <span className="ml-2 text-sm font-normal text-gray-500">({categoryTools.length})</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => {
                  const hasAccess = canAccessFeature(userTierLevel, tool.required_tier_level);
                  
                  return (
                    <div
                      key={tool.id}
                      className={`relative bg-white border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                        hasAccess
                          ? 'border-gray-200 hover:border-blue-300 cursor-pointer'
                          : 'border-gray-200 bg-gray-50'
                      } ${tool.is_featured ? 'ring-2 ring-blue-100' : ''}`}
                      onClick={() => hasAccess && handleToolClick(tool)}
                    >
                      {/* Featured Badge */}
                      {tool.is_featured && (
                        <div className="absolute -top-2 -right-2">
                          <span className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                            ⭐ Featured
                          </span>
                        </div>
                      )}

                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{tool.icon}</div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{tool.name}</h4>
                            {tool.affiliate_url && (
                              <span className="inline-flex items-center text-xs text-green-600 font-medium">
                                💰 Affiliate Partner
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>

                      {/* Access Badge */}
                      <div className="mb-4">
                        {getAccessBadge(tool.required_tier_level)}
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto">
                        {hasAccess ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToolClick(tool);
                            }}
                            className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            Open Tool →
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.error(`Upgrade to ${TIER_NAMES[tool.required_tier_level as keyof typeof TIER_NAMES]} to access this tool`);
                            }}
                            className="w-full py-2 px-4 bg-gray-300 text-gray-600 text-sm font-medium rounded-md cursor-not-allowed"
                          >
                            🔒 Upgrade Required
                          </button>
                        )}
                      </div>

                      {/* Locked Overlay */}
                      {!hasAccess && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl mb-2">🔒</div>
                            <div className="text-sm font-medium text-gray-700">
                              {TIER_NAMES[tool.required_tier_level as keyof typeof TIER_NAMES]} Required
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upgrade CTA */}
      {userTierLevel < TIER_LEVELS.MASTERMIND && (
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock More AI Tools
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade your membership to access professional AI tools and exclusive affiliate partnerships.
            </p>
            <button
              onClick={() => window.location.href = '/membership'}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Upgrade Membership →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIToolbox;