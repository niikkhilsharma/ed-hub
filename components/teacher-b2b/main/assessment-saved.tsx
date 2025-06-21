"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link'; // For Create Assessment button
import Header from "@/components/layout/Header"; // Adjust path as needed
import Footer from "@/components/layout/Footer"; // Adjust path as needed
import { FiArrowLeft, FiInfo, FiChevronDown, FiChevronLeft, FiChevronRight, FiPlusCircle } from 'react-icons/fi';

// --- Style Constants (from image) ---
const ACCENT_PINK = '#FF3366';
const PRIMARY_BLUE = '#3366FF';
const PAGE_BG = '#F9FAFB'; // A very light gray, similar to Tailwind's gray-50 or slate-50
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1F2937'; // gray-800
const TEXT_SECONDARY = '#6B7280'; // gray-500
const BORDER_COLOR = '#E5E7EB'; // gray-200
const LIGHT_GRAY_BG_INPUT = '#F3F4F6'; // gray-100 for input-like backgrounds

// --- Data Interfaces ---
type TabKey = 'scheduled' | 'completed' | 'saved';

interface TabItem {
  id: TabKey;
  label: string;
}

interface SavedAssessmentItemData {
  id: string;
  title: string;
  batch: string;
  dateFullText: string;
}

interface BatchOption {
  value: string;
  label: string;
}

interface RightSidebarStats {
  currentMonthYear: string;
  completeCount: number;
  totalCount: number;
  incompleteCount: number;
  averageScoreOverall: number; // Percentage
}

// --- Sample Data (Focused on "Saved" state) ---
const sampleSavedAssessments: SavedAssessmentItemData[] = Array.from({ length: 7 }, (_, i) => ({
  id: `svt${i + 1}`,
  title: 'Assessment Title',
  batch: 'Batch 1',
  dateFullText: 'Scheduled for May 28, 2025',
}));

const sampleBatchOptions: BatchOption[] = [
  { value: 'all', label: 'All Batches' },
  { value: 'batch1', label: 'Batch 1' },
  { value: 'batch2', label: 'Batch 2' },
];

const sampleSidebarStats: RightSidebarStats = {
  currentMonthYear: 'June 2025',
  completeCount: 2,
  totalCount: 20,
  incompleteCount: 1,
  averageScoreOverall: 15,
};

// --- Sub-components (Pixel-Perfect Styling Attempt) ---

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-[9px] text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[${ACCENT_PINK}]/50
      ${isActive ? `text-[${ACCENT_PINK}] border-b-[2.5px] border-[${ACCENT_PINK}]` : `text-[${TEXT_SECONDARY}] hover:text-[${TEXT_PRIMARY}] border-b-[2.5px] border-transparent`}`}
  >
    {label}
  </button>
);

const SavedAssessmentCard: React.FC<{ assessment: SavedAssessmentItemData; }> = ({ assessment }) => (
  <div className={`bg-[${CARD_BG}] border border-[${BORDER_COLOR}] rounded-xl p-[14px_18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200 relative`}>
    <button className="absolute top-[13px] right-[14px] text-gray-400 hover:text-gray-600 p-0.5" aria-label="Assessment information">
      <FiInfo className="w-[18px] h-[18px]" />
    </button>
    <h3 className="text-[13.5px] font-semibold text-[${TEXT_PRIMARY}] mb-0.5 pr-6">{assessment.title}</h3>
    <p className="text-[11.5px] text-[${TEXT_SECONDARY}]">{assessment.batch} | {assessment.dateFullText}</p>
  </div>
);

const RightSidebarPanel: React.FC<{ stats: RightSidebarStats; onMonthChange: (direction: 'prev' | 'next') => void }> = ({ stats, onMonthChange }) => (
  <div className={`bg-[${CARD_BG}] rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-[18px] space-y-[14px] sticky top-[88px]`}> {/* Adjusted sticky top */}
    <div className="flex justify-between items-center">
      <h4 className="text-[13.5px] font-semibold text-[${TEXT_PRIMARY}]">Assessment</h4>
      <div className="flex items-center text-[11.5px] border border-[${BORDER_COLOR}] rounded-md px-1.5 py-[3px]">
        <FiChevronLeft onClick={() => onMonthChange('prev')} className="w-4 h-4 text-gray-500 hover:text-[${PRIMARY_BLUE}] cursor-pointer mr-1" />
        <span className="font-medium text-gray-700 w-[60px] text-center">{stats.currentMonthYear}</span>
        <FiChevronRight onClick={() => onMonthChange('next')} className="w-4 h-4 text-gray-500 hover:text-[${PRIMARY_BLUE}] cursor-pointer ml-1" />
        <FiInfo className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
      </div>
    </div>
    <div className="flex justify-between items-baseline pt-1">
      <div>
        <p className="text-[11px] text-[${TEXT_SECONDARY}]">Complete</p>
        <p className="text-[17px] font-bold text-[${TEXT_PRIMARY}] leading-tight">{stats.completeCount} <span className="text-[13px] text-[${TEXT_SECONDARY}] font-normal">/ {stats.totalCount}</span></p>
      </div>
      <div className="text-right">
        <p className="text-[11px] text-[${TEXT_SECONDARY}]">Incomplete</p>
        <p className={`text-[17px] font-bold text-[${ACCENT_PINK}] leading-tight`}>{stats.incompleteCount}</p>
      </div>
    </div>
    <div className={`bg-[${LIGHT_GRAY_BG_INPUT}] p-[10px_12px] rounded-lg flex justify-between items-center`}>
      <p className="text-[11.5px] text-[${TEXT_SECONDARY}]">Average Score</p>
      <p className={`text-[13px] font-semibold text-[${PRIMARY_BLUE}]`}>{stats.averageScoreOverall}%</p>
    </div>
  </div>
);

// --- Main Page Component (Assessment List - Saved View) ---
export default function AssessmentSavedListPage() {
  const headerUser = useMemo(() => ({
    name: "Educator Name",
    role: "Teacher",
    avatarSrc: "/placeholder-avatar-student.jpg", // UPDATE THIS PATH
  }), []);

  const TABS: TabItem[] = [
    { id: 'scheduled', label: 'Scheduled Test' },
    { id: 'completed', label: 'Completed Tests' },
    { id: 'saved', label: 'Saved' },
  ];
  const [activeTab, setActiveTab] = useState<TabKey>('saved'); // Default to "Saved"
  const [selectedBatch, setSelectedBatch] = useState<string>(sampleBatchOptions[0].value);
  const [sidebarStats, setSidebarStats] = useState<RightSidebarStats>(sampleSidebarStats);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    // Placeholder logic to change month/year
    const [monthStr, yearStr] = sidebarStats.currentMonthYear.split(' ');
    let date = new Date(`${monthStr} 1, ${yearStr}`);
    if (direction === 'prev') date.setMonth(date.getMonth() - 1);
    else date.setMonth(date.getMonth() + 1);
    setSidebarStats(prev => ({
      ...prev,
      currentMonthYear: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
    }));
  };

  // In a real app, filter sampleSavedAssessments by selectedBatch
  const assessmentsToDisplay = sampleSavedAssessments;

  return (
    <div className={`bg-[${PAGE_BG}] min-h-screen flex flex-col`}>
      <Header user={headerUser} />

      <div className="flex items-center bg-white px-4 sm:px-6 py-[9px] shadow-sm sticky top-[79px] sm:top-[80px] z-30"> {/* Header height assumed ~80px */}
        <button
          onClick={() => typeof window !== "undefined" && window.history.back()}
          className="p-1 mr-1 text-gray-600 hover:text-gray-800 focus:outline-none rounded-md"
          aria-label="Go back"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        {/* No page title text here as per image */}
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-5 lg:px-6 py-5">
        <div className={`bg-[${CARD_BG}] rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.05)]`}>
          {/* Header: Tabs, Filters, Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-3 sm:pt-4 px-3 sm:px-5">
            <div className="flex border-b border-[${BORDER_COLOR}] w-full sm:w-auto sm:border-b-0"> {/* Tabs container */}
              {TABS.map(tab => (
                <TabButton key={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
              ))}
            </div>
            <div className="flex items-center gap-2.5 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end py-2 sm:py-0">
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className={`py-[7px] pl-3 pr-7 text-[12.5px] border border-[${BORDER_COLOR}] rounded-md bg-[${LIGHT_GRAY_BG_INPUT}]/70 focus:ring-1 focus:ring-[${PRIMARY_BLUE}] focus:border-[${PRIMARY_BLUE}] outline-none appearance-none shadow-sm`}
                >
                  {sampleBatchOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
              <Link href="/teacher-b2b/assessments/create"> {/* Assuming this is the create page */}
                <button
                  className={`px-3.5 py-[7px] text-[12.5px] font-semibold text-white bg-[${PRIMARY_BLUE}] rounded-md shadow-md hover:bg-opacity-90 transition-opacity flex items-center`}
                >
                  <FiPlusCircle className="w-4 h-4 mr-1.5" /> Create Assessment
                </button>
              </Link>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-x-5 p-3 sm:p-5"> {/* Adjusted grid for sidebar width */}
            {/* Left Column: Assessment List */}
            <div className="space-y-2.5 max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar pr-1.5"> {/* Adjusted max-h */}
              {assessmentsToDisplay.map(assessment => (
                <SavedAssessmentCard key={assessment.id} assessment={assessment} />
              ))}
              {assessmentsToDisplay.length === 0 && (
                <div className="text-center py-12 text-[${TEXT_SECONDARY}]">No saved assessments found.</div>
              )}
            </div>

            {/* Right Column: Summary Panel */}
            <div className="hidden lg:block">
              <RightSidebarPanel stats={sidebarStats} onMonthChange={handleMonthChange} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
      `}</style>
    </div>
  );
}