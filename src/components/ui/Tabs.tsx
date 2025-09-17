'use client';

import React, { useState, useEffect } from 'react';

type Tab = {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  orientation?: 'horizontal' | 'vertical';
};

export default function Tabs({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
  orientation = 'horizontal',
}: TabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );

  useEffect(() => {
    if (defaultTabId) {
      setActiveTabId(defaultTabId);
    }
  }, [defaultTabId]);

  const handleTabClick = (tabId: string) => {
    // Immediate state update for instant feedback
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const getTabStyles = (tab: Tab) => {
    const isActive = tab.id === activeTabId;
    const isDisabled = tab.disabled;

    const baseClasses = 'tab-elegant flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 select-none';
    
    if (isDisabled) {
      return `${baseClasses} text-gray-500 cursor-not-allowed opacity-50`;
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} ${isActive ? 'active bg-white/15 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`;
      case 'underline':
        return `${baseClasses} border-b-2 ${isActive
          ? 'border-white text-white active'
          : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
        }`;
      default: // 'default'
        return `${baseClasses} ${isActive
          ? 'active bg-white/10 text-white border border-white/20'
          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
        }`;
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className={`${orientation === 'vertical' ? 'flex' : ''} ${className}`}>
      <div
        className={`${orientation === 'vertical' ? 'flex-shrink-0' : ''} ${tabListClassName}`}
        role="tablist"
        aria-orientation={orientation}
      >
        <div className={`${orientation === 'vertical' ? 'flex-col' : 'flex'} ${variant === 'default' ? 'border-b border-gray-200' : ''}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={getTabStyles(tab)}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              tabIndex={activeTabId === tab.id ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        className={`${orientation === 'vertical' ? 'flex-grow ml-4' : 'mt-4'} ${tabPanelClassName}`}
      >
        {activeTab.content}
      </div>
    </div>
  );
}