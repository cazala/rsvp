"use client";

import { useState, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export default function CustomTabs({ tabs, defaultTab }: CustomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-2 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 text-lg font-bold border-b-2 transition-all cursor-pointer
                ${
                  activeTab === tab.id
                    ? "text-black border-primary"
                    : "text-soft-gray border-transparent hover:text-gray-700"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{activeTabContent}</div>
    </div>
  );
}
