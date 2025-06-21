// app/teacher-b2b/material/[subjectId]/[folderId]/page.tsx (Example route)
// This component was previously created, now updating for pixel-perfection based on new image

"use client";
import React, { useState, useMemo } from 'react';
import { useRouter, useParams } // useParams to get folderId if needed for dynamic title
from 'next/navigation';
import Header from '@/components/layout/Header'; // Assuming correct path
import Footer from '@/components/layout/Footer'; // Assuming correct path
import {
  ArrowLeft,
  Search,
  Filter as FilterIcon, // Renamed to avoid conflict
  ChevronDown,
  FileText, // Generic file icon
  FileImage, // Image file icon
  FileUp, // For Upload button
} from 'lucide-react';
import Image from 'next/image'; // For potential PDF/Image specific icons if not using Lucide


// Simplified Button for filter buttons
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
const FilterButton: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center bg-white border border-gray-300/90 text-gray-500 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300 text-[12px] font-medium px-3 py-[7px] rounded-lg transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'generic'; // Added generic for placeholder
  size: string; // e.g., "300 KB"
}

// Mock Data to match the image
const filesData: FileItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: `file_${i + 1}`,
  name: 'File Name',
  type: i % 2 === 0 ? 'pdf' : 'image', // Alternating for visual variety like the image
  size: '300 KB',
}));


const FileTypeIconDisplay: React.FC<{ type: FileItem['type'] }> = ({ type }) => {
  if (type === 'pdf') {
    // return <Image src="/icons/pdf-icon.svg" alt="PDF" width={18} height={18} />; // If you have a specific icon
    return <FileText size={18} className="text-red-500 flex-shrink-0" />; // Lucide PDF-like
  }
  if (type === 'image') {
    // return <Image src="/icons/image-icon.svg" alt="Image" width={18} height={18} />; // If you have a specific icon
    return <FileImage size={18} className="text-blue-500 flex-shrink-0" />; // Lucide Image
  }
  return <FileText size={18} className="text-gray-400 flex-shrink-0" />; // Default
};


const FileListItem: React.FC<{ file: FileItem }> = ({ file }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100/90 last:border-b-0 hover:bg-gray-50/50 px-1">
    <div className="flex items-center gap-2.5">
      <FileTypeIconDisplay type={file.type} />
      <span className="text-[13.5px] font-medium text-gray-700">{file.name}</span>
    </div>
    <span className="text-[12px] text-gray-400 font-medium">{file.size}</span>
  </div>
);


export default function FolderViewPage() {
  const router = useRouter();
  const params = useParams();
  // You can get folderName from params if your route is dynamic like /folder/[folderName]
  // const folderName = params.folderId || "Folder Name"; // Example
  const folderNameFromProps = "Folder Name"; // Or pass as prop, or fetch dynamically

  const [searchTerm, setSearchTerm] = useState('');

  const headerUser = useMemo(() => ({ name: 'Teacher Name', role: 'Teacher', avatarSrc: '/page3/entry/pri.png' }), []);

  // Filter files based on searchTerm (simple implementation)
  const filteredFiles = filesData.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col"> {/* Page background */}
      <Header user={headerUser} />
      <main className="flex-grow container mx-auto px-4 sm:px-5 lg:px-6 py-5">
        <div className="flex items-center mb-4">
          <button onClick={() => router.back()} className="p-1.5 mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-[#FF3366]"> {/* Pink title */}
            {folderNameFromProps}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.07)] p-5 sm:p-6 relative"> {/* Main content card */}
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3.5">
                <div className="relative w-full sm:flex-grow max-w-lg">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-[13px] pl-10 pr-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button className="p-1.5 text-pink-500 hover:bg-pink-50 rounded-md">
                        <FilterIcon size={18} strokeWidth={2.5}/>
                    </button>
                    {["Filter 1", "Filter 2", "Filter 3"].map((filterName, idx) => (
                        <FilterButton key={idx}>
                            {filterName}
                            <ChevronDown size={14} className="ml-1 text-gray-400" />
                        </FilterButton>
                    ))}
                </div>
            </div>

            {/* File List */}
            {filteredFiles.length > 0 ? (
                <div className="divide-y divide-gray-100/80 max-h-[calc(100vh-350px)] sm:max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar-thin pr-1"> {/* Scrollable area */}
                    {filteredFiles.map((file) => (
                        <FileListItem key={file.id} file={file} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <Search size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No files found matching your search.</p>
                </div>
            )}

             {/* Floating Upload Button - position fixed relative to the card might be tricky,
                 so positioning it fixed to viewport for now, common pattern.
                 For card-relative, the card needs `position: relative` and button `position: absolute`.
             */}
        </div>
         <button
            className="fixed bottom-10 right-10 sm:bottom-12 sm:right-12 lg:bottom-16 lg:right-16 bg-[#FFD43B] hover:bg-[#FFC700] text-gray-800 font-semibold text-sm px-5 py-3 rounded-full shadow-lg z-50 flex items-center transition-transform hover:scale-105"
            onClick={() => alert("Upload action triggered")}
            >
            <FileUp size={18} className="mr-2" />
            Upload
        </button>
      </main>
      <Footer />
      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  );
}