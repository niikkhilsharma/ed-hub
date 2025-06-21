// app/teacher-b2b/assessments/page.tsx (When 'Saved' tab is active)
// Or, if you want a dedicated route: app/teacher-b2b/quizzes/saved/page.tsx

"use client";
import React, { useState, useMemo } from 'react'; // Added useMemo for headerUser
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Info,
  ChevronDown,
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  ChevronLeft as ChevronLeftIcon, // Renamed to avoid conflict
  ChevronRight as ChevronRightIcon // Renamed to avoid conflict
} from 'lucide-react';

// Assuming Header and Footer are in @/components/layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Button component (Simplified for this example, or import your actual Button)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({ variant = 'primary', size='md', children, className, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    primary: "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-700",
  };
   const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
    icon: "h-8 w-8",
  };
  return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};


type QuizStatus = 'Scheduled Quiz' | 'Completed Quiz' | 'Saved';

interface SavedQuiz {
  id: string;
  title: string;
  batch: string;
  scheduledDate: string;
}

const savedQuizzesData: SavedQuiz[] = Array.from({ length: 8 }, (_, i) => ({
  id: `quiz_saved_${i + 1}`,
  title: 'Quiz Title',
  batch: 'Batch 1',
  scheduledDate: 'Scheduled for May 28, 2025',
}));


const SavedQuizCard: React.FC<{ quiz: SavedQuiz }> = ({ quiz }) => {
  return (
    <div className="bg-white p-[18px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-200/80 flex justify-between items-center">
      <div>
        <h3 className="text-[15px] font-semibold text-gray-700 hover:text-blue-600">
          <Link href={`/teacher-b2b/quizzes/edit/${quiz.id}`}>{quiz.title}</Link>
        </h3>
        <p className="text-[12px] text-gray-500 mt-0.5">
          {quiz.batch} <span className="mx-1 text-gray-300">•</span> {quiz.scheduledDate}
        </p>
      </div>
      <div className="flex items-center gap-px">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" title="Edit Quiz">
          <Edit size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" title="Duplicate Quiz">
          <Copy size={15} />
        </Button>
         <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" title="Delete Quiz">
          <Trash2 size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" title="More Info">
          <Info size={16} />
        </Button>
      </div>
    </div>
  );
};

const QuizStatsSidebar: React.FC = () => {
    const [currentMonthYear, setCurrentMonthYear] = useState("June 2025");
    const completeCount = 2;
    const totalCount = 20;
    const incompleteCount = 1;
    const averageScore = "15%";

    const navigateDate = (direction: 'prev' | 'next') => {
        const [month, yearStr] = currentMonthYear.split(" ");
        let year = parseInt(yearStr);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let monthIndex = months.indexOf(month);

        if (direction === 'prev') {
            monthIndex--;
            if (monthIndex < 0) { monthIndex = 11; year--; }
        } else {
            monthIndex++;
            if (monthIndex > 11) { monthIndex = 0; year++; }
        }
        setCurrentMonthYear(`${months[monthIndex]} ${year}`);
    };

  return (
    <div className="bg-white p-[18px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-200/80 space-y-3.5">
        <div className="flex justify-between items-center">
            <h4 className="text-[13px] font-semibold text-gray-600">Quiz</h4>
            <div className="flex items-center text-[11px] text-gray-500 border border-gray-300/90 rounded-full px-2 py-0.5">
                <ChevronLeftIcon size={13} className="cursor-pointer hover:text-gray-700 mr-0.5" onClick={() => navigateDate('prev')}/>
                <span className="font-medium text-gray-600">{currentMonthYear}</span>
                <ChevronRightIcon size={13} className="cursor-pointer hover:text-gray-700 ml-0.5" onClick={() => navigateDate('next')}/>
                <Info size={12} className="ml-1 text-gray-400 cursor-pointer" />
            </div>
        </div>
        <div className="flex justify-between items-baseline">
            <div>
                <p className="text-[11px] text-gray-500">Complete</p>
                <p className="text-lg font-bold text-gray-700">
                    {completeCount}
                    <span className="text-[13px] font-normal text-gray-400 ml-0.5"> / {totalCount}</span>
                </p>
            </div>
            <div className="text-right">
                <p className="text-[11px] text-gray-500">Incomplete</p>
                <p className="text-lg font-bold text-[#EF4444]">{incompleteCount}</p>
            </div>
        </div>
        <div className="bg-gray-50/80 p-2.5 rounded-md flex justify-between items-center">
             <p className="text-[12px] text-gray-600 font-medium">Average Score</p>
             <p className="text-[13px] font-bold text-[#3B82F6]">{averageScore}</p>
        </div>
    </div>
  );
};


export default function SavedQuizzesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<QuizStatus>('Saved');

  // Mock user for Header - replace with actual user data logic
  const headerUser = useMemo(() => ({
    name: 'Teacher Name', // Replace with actual or dynamic data
    role: 'Teacher',
    avatarSrc: '/page3/entry/pri.png', // Default or dynamic avatar
  }), []);


  const tabs: { label: string; status: QuizStatus }[] = [
    { label: 'Scheduled Quiz', status: 'Scheduled Quiz' },
    { label: 'Completed Quiz', status: 'Completed Quiz' },
    { label: 'Saved', status: 'Saved' },
  ];

  const currentQuizzes = activeTab === 'Saved' ? savedQuizzesData : [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
      <Header user={headerUser} />
      <main className="flex-grow container mx-auto px-4 sm:px-5 lg:px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-grow space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-3 sm:gap-0">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="p-1.5 mr-1 text-gray-500 hover:bg-gray-100 rounded-full">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex border-b border-gray-200/90">
                        {tabs.map(tab => (
                            <button
                            key={tab.status}
                            onClick={() => setActiveTab(tab.status)}
                            className={`px-3 py-2 text-[13px] font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-pink-400
                                ${activeTab === tab.status
                                ? 'border-b-2 border-[#FF3366] text-[#FF3366]'
                                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                            {tab.label}
                            </button>
                        ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-300/90 text-gray-600 text-[12px] font-medium rounded-md py-[5px] pl-3 pr-7 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                <option>All Batches</option>
                                <option>Batch A</option>
                                <option>Batch B</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <Link href="/teacher-b2b/quizzes/create">
                            <Button variant="primary" size="md" className="!bg-[#3B82F6] hover:!bg-[#2563EB] !rounded-[7px] !h-[34px] !px-3.5 !text-[13px]">
                                <PlusCircle size={15} className="mr-1.5" /> Create Quiz
                            </Button>
                        </Link>
                    </div>
                </div>

                {currentQuizzes.length > 0 ? (
                    <div className="space-y-3.5 pr-1 custom-scrollbar max-h-[calc(100vh-230px)] overflow-y-auto">
                    {currentQuizzes.map(quiz => (
                        <SavedQuizCard key={quiz.id} quiz={quiz} />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200/70 mt-4">
                        {/* Placeholder if no saved quizzes */}
                        <Info size={40} className="mx-auto text-gray-300 mb-3" /> {/* Changed icon for empty state */}
                        <p className="text-gray-500 text-[14px]">No saved quizzes found.</p>
                        <p className="text-gray-400 text-[12px] mt-0.5">Create a new quiz or check other tabs.</p>
                    </div>
                )}
            </div>

            <aside className="lg:w-[300px] xl:w-[320px] flex-shrink-0 mt-1 lg:mt-[44px]">
                <QuizStatsSidebar/>
            </aside>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
       `}</style>
    </div>
  );
}