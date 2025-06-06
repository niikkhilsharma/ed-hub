"use client";
import Image from 'next/image'
import { useState, useMemo } from "react";
import Link from 'next/link';
import Header from "@/components/layout/Header"; // Assuming this path is correct
import Footer from "@/components/layout/Footer"; // Assuming this path is correct
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft
} from "react-icons/fi";
// Using Lucide for placeholder icons where specific SVGs are unavailable
import { Sigma, Divide, CaseSensitive, Bot, Users, Smile, FileQuestion } from 'lucide-react'; // Added FileQuestion for Quiz
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// -------------------------
// Focus Pill (Pixel-Perfect Attempt - Same as before)
// -------------------------
const FocusPill = ({ label, active = false }: { label: string, active?:boolean }) => (
	<button className={`px-[22px] py-[7px] text-[13px] font-medium rounded-full border transition-colors leading-snug
    ${active
      ? 'bg-[#FF3366] text-white border-[#FF3366]'
      : 'bg-[#F3F4F6] border-[#D1D5DB] text-[#4B5563] hover:bg-gray-200 hover:border-gray-400'
    }`}>
		{label}
	</button>
);

// -------------------------
// Skill Progress Item (Circular SVG-based - Pixel-Perfect Attempt - Same as before)
// -------------------------
interface SkillProgressItemProps {
  skillName: string;
  details: string;
  progressText: string;
  progressColorHex: string;
  textColorTailwind: string;
}

const SkillProgressItem = ({
  skillName,
  details,
  progressText,
  progressColorHex,
  textColorTailwind,
}: SkillProgressItemProps) => {
  const [numStr, denomStr] = progressText.split("/");
  const numerator = parseInt(numStr, 10);
  const denominator = parseInt(denomStr, 10);
  const fraction = denominator > 0 ? numerator / denominator : 0;

  const size = 38;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);

  return (
    <div className="flex items-center gap-[10px] py-[3px]">
      <div className="relative w-[38px] h-[38px] flex-shrink-0">
        <svg width={size} height={size} className="rotate-[-90deg]" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#EEF2F6" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke={progressColorHex} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} fill="none" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[11px] font-semibold ${textColorTailwind}`}>{progressText}</span>
        </div>
      </div>
      <div>
        <p className="text-[13px] font-medium text-gray-700 leading-[1.35]">{skillName}</p>
        <p className="text-[11px] text-gray-500 leading-[1.35]">{details}</p>
      </div>
    </div>
  );
};

// -------------------------
// Skill Category Card (Pixel-Perfect Attempt - Same as before)
// -------------------------
interface SkillCategoryCardProps {
  title: string;
  overallProgressText: string;
  progressValue: number; // 0-5
  skills: SkillProgressItemProps[];
  bgColorTailwind: string;
  progressColorTailwind: string;
  titleColorTailwind: string;
  secondaryIcons?: React.ReactNode;
}

const SkillCategoryCard = ({
  title,
  overallProgressText,
  progressValue,
  skills,
  bgColorTailwind,
  progressColorTailwind,
  titleColorTailwind,
  secondaryIcons,
}: SkillCategoryCardProps) => (
  <div className={`${bgColorTailwind} rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)] p-[18px] flex flex-col h-full`}>
    <div className="flex justify-between items-start mb-[5px]">
      <h3 className={`text-[15px] font-semibold ${titleColorTailwind}`}>{title}</h3>
      {secondaryIcons && <div className="flex items-center gap-1.5 text-gray-500 opacity-80">{secondaryIcons}</div>}
    </div>
    <p className="text-[11px] text-gray-600 mb-[2px]">Overall Progress</p>
    <div className="flex items-center gap-[6px] mb-3.5">
      <span className={`text-base font-bold ${titleColorTailwind}`}>{overallProgressText}</span>
      <div className="flex-grow bg-white/80 rounded-full h-[7px] border border-black/10 overflow-hidden">
        <div className={`${progressColorTailwind} h-full`} style={{ width: `${(progressValue / 5) * 100}%` }} />
      </div>
      <span className={`text-[11px] ${titleColorTailwind.replace('text-','text-opacity-70 text-')} font-medium`}>5</span>
    </div>
    <div className="space-y-1 overflow-y-auto custom-scrollbar flex-grow pr-1 max-h-[190px] sm:max-h-[220px]">
      {skills.map((skill, idx) => <SkillProgressItem key={idx} {...skill} /> )}
    </div>
  </div>
);

// -------------------------
// Quiz Result Table Row (Pixel-Perfect Attempt - Hydration Safe)
// -------------------------
interface QuizResult { // Renamed from TestResult
  id: number; quizName: string; startDate: string; endDateAndTime: string; // quizName instead of test
  totalMarks: number; passingMarks: number; marksScored: string; result: "Pass" | "Failed";
}

const QuizResultRow = ({ data }: { data: QuizResult }) => ( // Renamed component
  <tr className={`${data.result === "Pass" ? "bg-[#F0FDF4]/70" : "bg-[#FEF2F2]/70"} hover:bg-gray-100/60 transition-colors`}>{/*NO WHITESPACE*/}
    <td className="px-4 py-[10px] text-[13px] text-gray-700 whitespace-nowrap">{data.quizName}</td>{/*NO WHITESPACE*/}
    <td className="px-4 py-[10px] text-[13px] text-gray-500 whitespace-nowrap text-center">{data.startDate}</td>{/*NO WHITESPACE*/}
    <td className="px-4 py-[10px] text-[13px] text-gray-500 whitespace-nowrap text-center">{data.endDateAndTime}</td>{/*NO WHITESPACE*/}
    <td className="px-4 py-[10px] text-[13px] text-gray-500 text-center whitespace-nowrap">{data.totalMarks}</td>{/*NO WHITESPACE*/}
    <td className="px-4 py-[10px] text-[13px] text-gray-500 text-center whitespace-nowrap">{data.passingMarks}</td>{/*NO WHITESPACE*/}
    <td className="px-4 py-[10px] text-[13px] text-gray-700 font-semibold text-center whitespace-nowrap">{data.marksScored}</td>{/*NO WHITESPACE*/}
    <td className={`px-4 py-[10px] text-[13px] font-semibold text-center whitespace-nowrap ${data.result === "Pass" ? "text-green-600" : "text-red-600"}`}>{data.result}</td>{/*NO WHITESPACE*/}
  </tr>
);

// -------------------------
// Student Data (Same as before)
// -------------------------
const studentInfo = {
	name: 'Shlok Agheda', class: 'Class 8A', group: 'Group A',
	avatar: '/placeholder-avatar-student.jpg', gender: 'Male', dob: '15 Jun 2015',
	email: 'example@gm.com', contact: '+91 1234567890', state: 'Maharashtra',
	focusAreas: ['Academics', 'Personality Development', 'Brain Development'], // These might still be relevant overall
};

// -------------------------
// Chart & Skill Data (Adapted for Quiz Context)
// -------------------------
const quizLineChartData = [ // Renamed data, values can be adjusted for quiz trends
  { name: "Jan", conceptual: 12, application: 10, speed: 8 }, { name: "Feb", conceptual: 15, application: 14, speed: 10 },
  { name: "Mar", conceptual: 22, application: 18, speed: 15 }, { name: "Apr", conceptual: 28, application: 22, speed: 17 },
  { name: "May", conceptual: 32, application: 28, speed: 23 }, { name: "Jun", conceptual: 30, application: 25, speed: 28 },
  { name: "Jul", conceptual: 42, application: 35, speed: 30 }, { name: "Aug", conceptual: 45, application: 38, speed: 33 },
  { name: "Sep", conceptual: 48, application: 40, speed: 35 }, { name: "Oct", conceptual: 40, application: 36, speed: 38 }, // Dip
  { name: "Nov", conceptual: 50, application: 45, speed: 42 }, { name: "Dec", conceptual: 55, application: 48, speed: 45 },
];

// Hex Colors remain the same as they define the visual theme of the cards
const quizRelatedBasicSkillsData: SkillProgressItemProps[] = Array.from({ length: 6 }, (_, i) => ({
    skillName: `Quiz Topic ${String.fromCharCode(65 + i)}`, details: "Conceptual Understanding", progressText: "4/5",
    progressColorHex: "#14B8A6", textColorTailwind: "text-teal-600",
}));
const quizRelatedCriticalSkillsData: SkillProgressItemProps[] = [ "Problem Solving", "Analytical Thinking", "Logical Reasoning", "Data Interpretation", "Pattern Recognition", "Strategic Thinking"
].map(skill => ({ skillName: skill, details: "Quiz Performance", progressText: "3/5", progressColorHex: "#A855F7", textColorTailwind: "text-purple-600" }));

// Personal Development and Life Skills might be less directly tied to quizzes,
// but we keep the structure to match the image. Data can be generic.
const personalDevelopmentSkillsData: SkillProgressItemProps[] = [ "Time Management", "Focus", "Attention to Detail", "Calmness Under Pressure", "Integrity", "Self-Correction"
].map(skill => ({ skillName: skill, details: "Observed During Quizzes", progressText: "3/4", progressColorHex: "#EC4899", textColorTailwind: "text-pink-600" }));
const lifeSkillEnhancementsData: SkillProgressItemProps[] = [ "Quick Recall", "Accuracy", "Decision Speed", "Following Instructions", "Pattern Spotting", "Error Analysis"
].map(skill => ({ skillName: skill, details: "Quiz-related Aspects", progressText: "3/4", progressColorHex: "#F43F5E", textColorTailwind: "text-rose-600" }));

const quizResultsData: QuizResult[] = Array.from({ length: 6 }, (_, i) => ({ // Using QuizResult interface
  id: i + 1, quizName: `Chapter ${i + 1} Quiz`, startDate: "05/02/2025", endDateAndTime: `05/09/2025 ${i % 2 === 0 ? '10:00 am' : '03:00 pm'}`,
  totalMarks: 50, passingMarks: 30, marksScored: `${35 + i * 2}/50`, result: (35 + i * 2) >= 30 ? "Pass" : "Failed",
}));

// -------------------------
// Main Quiz Report Page Component
// -------------------------
export default function StudentQuizDetailedReportPage() { // Renamed component
  const [activeFocusArea, setActiveFocusArea] = useState("Academics");
  const [monthFilter, setMonthFilter] = useState("Month");
  const [yearFilter, setYearFilter] = useState("2025");

  const headerUser = useMemo(() => ({ name: studentInfo.name, role: "Student", avatarSrc: studentInfo.avatar }),[]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
      <Header user={headerUser} />
      <main className="flex-grow container mx-auto px-4 sm:px-5 lg:px-6 py-5 space-y-5">
        <div className="flex items-center mb-1">
          <Link href="/student-b2b/student-dashboard/dashboard" passHref> {/* Adjust if needed */}
            <button className="p-1.5 mr-1.5 text-gray-500 hover:bg-gray-200/70 rounded-full transition-colors">
              <FiArrowLeft size={18} />
            </button>
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-700">Quiz Report</h1> {/* Changed Title */}
        </div>

        {/* Student Profile Card - Remains the same visually */}
        <section className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)] p-5 sm:p-[22px]">
          <div className="flex flex-col sm:flex-row items-start gap-x-5 gap-y-4">
            <Image src={studentInfo.avatar} alt={studentInfo.name} width={90} height={90} className="rounded-full object-cover flex-shrink-0 border-2 border-gray-100" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div>
                    <h2 className="text-xl sm:text-[22px] font-bold text-gray-800 leading-tight">{studentInfo.name}</h2>
                    <div className="flex items-center space-x-px mt-1 mb-2.5">
                        <span className="px-3 py-[3px] bg-[#FF3366] text-white text-[11px] sm:text-xs font-semibold rounded-l-md leading-normal">{studentInfo.class}</span>
                        <span className="px-3 py-[3px] bg-[#FF3366] text-white text-[11px] sm:text-xs font-semibold rounded-r-md leading-normal">{studentInfo.group}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 space-y-px sm:text-right mt-1 sm:mt-0 leading-relaxed">
                      <p><span className="font-medium text-gray-600">Gender:</span> {studentInfo.gender}</p>
                      <p><span className="font-medium text-gray-600">DOB:</span> {studentInfo.dob}</p>
                      <p><span className="font-medium text-gray-600">Email:</span> {studentInfo.email}</p>
                      <p><span className="font-medium text-gray-600">Contact:</span> {studentInfo.contact}</p>
                      <p><span className="font-medium text-gray-600">State:</span> {studentInfo.state}</p>
                  </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200/80">
                <h3 className="text-[13px] font-semibold text-gray-600 mb-1.5">Key Focus Area</h3>
                <div className="flex flex-wrap gap-1.5">
                  {studentInfo.focusAreas.map(area => ( <FocusPill key={area} label={area} active={activeFocusArea === area} /> ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overall Quiz Performance Chart & Personal Development */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)] p-5 sm:p-[22px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2.5">
              <h2 className="text-base font-semibold text-[#FF3366]">Overall Quiz Performance</h2> {/* Changed Title */}
              <div className="flex items-center gap-2">
                {/* Filters remain visually the same */}
                <div className="relative">
                  <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
                    className="appearance-none text-[12px] font-medium text-gray-600 bg-gray-100/80 px-3 py-1 rounded-md pr-6 focus:outline-none focus:ring-1 focus:ring-[#FF3366]/50">
                    <option value="Month">Month</option>
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex items-center gap-1 text-[12px] text-gray-600 bg-gray-100/80 px-1.5 py-1 rounded-md">
                  <FiChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-[#FF3366]" onClick={() => setYearFilter(prev => String(Number(prev)-1))} />
                  <input type="number" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-10 text-center bg-transparent focus:outline-none appearance-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none" />
                  <FiChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-[#FF3366]" onClick={() => setYearFilter(prev => String(Number(prev)+1))} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap mb-3.5">
                {/* Legend adapted for quiz chart data */}
                {[{ label: "Conceptual Understanding", color: "#38BDF8" }, { label: "Application Skills", color: "#A855F7" }, { label: "Speed & Accuracy", color: "#EC4899" }]
                .map(l => (<div key={l.label} className="flex items-center gap-1"><span style={{backgroundColor: l.color}} className="w-2 h-2 rounded-sm"></span><span className="text-[11px] text-gray-500">{l.label}</span></div>))}
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={quizLineChartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={{ stroke: "#F3F4F6" }} tickLine={false} dy={5}/>
                  <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dx={-5} />
                  <Tooltip wrapperClassName="text-[10px] p-1 shadow-lg rounded-md bg-white border border-gray-200" labelClassName="font-bold" contentStyle={{padding: '2px 4px'}} itemStyle={{padding: '1px 0'}}/>
                  <Line type="monotone" dataKey="conceptual" stroke="#38BDF8" strokeWidth={2} dot={{ r: 2.5, fill: "#38BDF8", strokeWidth:0 }} activeDot={{ r: 4, strokeWidth:0 }} name="Conceptual" />
                  <Line type="monotone" dataKey="application" stroke="#A855F7" strokeWidth={2} dot={{ r: 2.5, fill: "#A855F7", strokeWidth:0 }} activeDot={{ r: 4, strokeWidth:0 }} name="Application" />
                  <Line type="monotone" dataKey="speed" stroke="#EC4899" strokeWidth={2} dot={{ r: 2.5, fill: "#EC4899", strokeWidth:0 }} activeDot={{ r: 4, strokeWidth:0 }} name="Speed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Personal Development Card - Remains visually same, data contextually generic */}
          <section className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)] p-5 sm:p-[18px] flex flex-col">
            <h3 className="text-[15px] font-semibold text-[#FF3366] mb-2.5">Personal Development</h3>
            <div className="space-y-1 overflow-y-auto custom-scrollbar flex-grow pr-1 max-h-[325px]">
              {personalDevelopmentSkillsData.map((skill, idx) => <SkillProgressItem key={idx} {...skill} />)}
            </div>
          </section>
        </div>

        {/* Skill Category Cards - Adapted for Quiz context */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkillCategoryCard title="Basic Quiz Concepts" overallProgressText="4/5" progressValue={4} skills={quizRelatedBasicSkillsData}
            bgColorTailwind="bg-teal-50/70" progressColorTailwind="bg-teal-500" titleColorTailwind="text-teal-700"
            secondaryIcons={<><FileQuestion size={13}/><Divide size={13} className="-rotate-45"/></>}
          />
          <SkillCategoryCard title="Critical Quiz Skills" overallProgressText="3/5" progressValue={3} skills={quizRelatedCriticalSkillsData}
            bgColorTailwind="bg-purple-50/70" progressColorTailwind="bg-purple-500" titleColorTailwind="text-purple-700"
            secondaryIcons={<><CaseSensitive size={14}/><Bot size={14} strokeWidth={1.5}/></>}
          />
          <SkillCategoryCard title="Quiz Performance Attributes" overallProgressText="3/4" progressValue={3.75} skills={lifeSkillEnhancementsData} // Example progressValue for 3/4
            bgColorTailwind="bg-rose-50/70" progressColorTailwind="bg-rose-500" titleColorTailwind="text-rose-700"
            secondaryIcons={<><Users size={15} strokeWidth={1.5}/><Smile size={15} strokeWidth={1.5}/></>}
          />
        </div>

        {/* Quiz Results Table */}
        <section className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.07)] p-5 sm:p-[22px] overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-gray-100/80">{/*NO WHITESPACE*/}
              <tr>{/*NO WHITESPACE*/}
                {["Quiz Name", "Start Date", "End Date & Time", "Total Marks", "Passing Marks", "Marks Scored", "Result"] // Adapted headers
                .map(h => (<th key={h} className="px-4 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center first:text-left last:text-center">{h}</th>))}{/*NO WHITESPACE*/}
              </tr>{/*NO WHITESPACE*/}
            </thead>{/*NO WHITESPACE*/}
            <tbody className="divide-y divide-gray-200/80">{/*NO WHITESPACE*/}
              {quizResultsData.map(r => <QuizResultRow key={r.id} data={r} />)}{/*NO WHITESPACE*/}
            </tbody>{/*NO WHITESPACE*/}
          </table>
        </section>
      </main>

      <Footer />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}