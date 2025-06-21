// app/teacher-b2b/assessments/select-existing/page.tsx (Example route)
"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header'; // Assuming correct path
import Footer from '@/components/layout/Footer'; // Assuming correct path
import {
  ArrowLeft,
  FolderOpen, // Using FolderOpen for a slightly more detailed look than a simple Folder
  Settings2, // For Manage Access icon
  Info,
} from 'lucide-react';

// Simplified Button for this page (only ghost variant used for Manage Access)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost';
  children: React.ReactNode;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({ variant = 'ghost', children, className, ...props }) => {
  const base = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    ghost: "hover:bg-gray-100/80 text-gray-500 hover:text-gray-600",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};


interface AssessmentFolder {
  id: string;
  name: string;
  fileCount: number;
  category: string; // To filter by category
}

// Mock Data
const assessmentFoldersData: AssessmentFolder[] = [
  { id: 'folder1', name: 'Folder Name', fileCount: 100, category: 'Category 1' },
  { id: 'folder2', name: 'Folder Name', fileCount: 100, category: 'Category 1' },
  { id: 'folder3', name: 'Folder Name', fileCount: 100, category: 'Category 1' },
  { id: 'folder4', name: 'Math Assessments Q1', fileCount: 25, category: 'Category 2' },
  { id: 'folder5', name: 'Science Mid-Terms', fileCount: 15, category: 'Category 2' },
  { id: 'folder6', name: 'English Essays', fileCount: 30, category: 'Category 3' },
  // ... more folders for other categories
];

const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];


const FolderCard: React.FC<{ folder: AssessmentFolder; onClick: () => void }> = ({ folder, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#F9FAFB] p-4 sm:p-5 rounded-xl border border-gray-200/90 shadow-[0_3px_10px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-md hover:border-gray-300/70 transition-all duration-150 flex flex-col items-start"
  >
    <div className="flex justify-between items-start w-full mb-3">
        <div className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] bg-[#A5D8FF]/60 rounded-lg flex items-center justify-center flex-shrink-0"> {/* Light blue background */}
            <FolderOpen size={32} className="text-[#3B82F6]/80" strokeWidth={1.5} /> {/* Blue folder icon */}
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600">
            <Info size={16} />
        </button>
    </div>
    <h3 className="text-[15px] font-semibold text-gray-700 mb-0.5">{folder.name}</h3>
    <p className="text-[11px] text-gray-500 mb-3">{folder.fileCount} Files</p>
    <Button
      variant="ghost"
      className="!bg-gray-200/70 hover:!bg-gray-300/70 !text-gray-600 !font-medium text-[12px] px-3 py-1.5 rounded-md w-full mt-auto"
      onClick={(e) => { e.stopPropagation(); alert(`Manage Access for ${folder.name}`); }}
    >
      <Settings2 size={14} className="mr-1.5 text-gray-500" />
      Manage Access
    </Button>
  </div>
);


export default function SelectExistingAssessmentPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("Category 1");

  const headerUser = useMemo(() => ({ name: 'Teacher Name', role: 'Teacher', avatarSrc: '/page3/entry/pri.png' }), []);

  const filteredFolders = assessmentFoldersData.filter(folder => folder.category === activeCategory);

  const handleFolderSelect = (folderId: string) => {
    // Logic to handle selection, e.g., navigate or pass data back
    alert(`Selected folder: ${folderId}`);
    // Potentially: router.push(`/teacher-b2b/assessments/create?use_template=${folderId}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col"> {/* Page background */}
      <Header user={headerUser} />
      <main className="flex-grow container mx-auto px-4 sm:px-5 lg:px-6 py-5">
        <div className="flex items-center mb-4">
          <button onClick={() => router.back()} className="p-1.5 mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-[#FF3366]"> {/* Pink title */}
            Select Existing Assessment
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.07)] p-5 sm:p-6"> {/* Main content card */}
          {/* Category Tabs */}
          <div className="mb-5 sm:mb-6 border-b border-gray-200/90 flex flex-nowrap overflow-x-auto custom-scrollbar-thin pb-px">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-[13px] sm:text-sm font-medium py-2 px-3 sm:px-4 whitespace-nowrap transition-all duration-150 relative focus:outline-none focus-visible:ring-1 focus-visible:ring-pink-400
                  ${activeCategory === category
                    ? 'text-[#FF3366]' // Active tab color
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {category}
                {activeCategory === category && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#FF3366] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Folder Grid */}
          {filteredFolders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredFolders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} onClick={() => handleFolderSelect(folder.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
                <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm">No assessments found in this category.</p>
                <p className="text-xs text-gray-400 mt-1">Please select another category or create a new assessment.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar { height: 3px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; } /* gray-200 */
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #D1D5DB; } /* gray-300 */
      `}</style>
    </div>
  );
}