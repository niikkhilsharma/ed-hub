// app/teacher-b2b/assessments/ai-create/page.tsx (Example route)
"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header'; // Assuming correct path
import Footer from '@/components/layout/Footer'; // Assuming correct path
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Search,
  Check,
  PackageSearch, // Placeholder for Unitary Search icon
  ChevronUp, ChevronDown as ChevronUpDown // For number inputs
} from 'lucide-react';

// Simplified Button for this page
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const base = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-[#3B82F6] text-white shadow-sm hover:bg-[#3B82F6]/90", // blue-500
    outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// Stepper Component (Pixel-Perfect Attempt)
const Stepper: React.FC<{ currentStep: number; steps: { name: string }[] }> = ({ currentStep, steps }) => (
  <nav aria-label="Progress">
    <ol role="list" className="flex items-center justify-center space-x-3 sm:space-x-4">
      {steps.map((step, stepIdx) => (
        <React.Fragment key={step.name}>
          {stepIdx > 0 && (
            <div className="h-px w-6 sm:w-8 bg-gray-200"></div> // Simple line separator
          )}
          <li className="flex flex-col items-center text-center">
            <div
              className={`flex items-center justify-center w-7 h-7 sm:w-[30px] sm:h-[30px] rounded-full border-2 mb-1
                ${stepIdx === currentStep - 1
                  ? 'border-[#FF3366] bg-[#FF3366]/10 text-[#FF3366]' // Active: Pink border, light pink bg, pink text
                  : stepIdx < currentStep - 1
                  ? 'border-green-500 bg-green-500 text-white' // Completed: Green
                  : 'border-gray-300 bg-gray-100 text-gray-500' // Upcoming: Gray
                }`}
            >
              {stepIdx < currentStep - 1 ? <Check size={16} /> : <span className="text-xs sm:text-[13px] font-semibold">{stepIdx + 1}</span>}
            </div>
            <span className={`text-xs sm:text-[13px] font-medium
              ${stepIdx === currentStep - 1 ? 'text-[#FF3366]' : stepIdx < currentStep - 1 ? 'text-green-600' : 'text-gray-500'}`}
            >
              {step.name}
            </span>
          </li>
        </React.Fragment>
      ))}
    </ol>
  </nav>
);


// Mock Data
const unitaryOptionsData = [
  { title: "Option Title", subtitle: "Option Subtitle" },
  { title: "Option Title", subtitle: "Option Subtitle" },
  { title: "Option Title", subtitle: "Option Subtitle" },
];

const mockStudentsData = [
    { id: 'std1', name: 'Student Name', avatar: '/page3/entry/stu.png', course: 'Course Name', levelGrade: 'Level / Grade', group: 'Group' },
    { id: 'std2', name: 'Student Name', avatar: '/page3/entry/stu.png', course: 'Course Name', levelGrade: 'Level / Grade', group: 'Group' },
    { id: 'std3', name: 'Student Name', avatar: '/page3/entry/stu.png', course: 'Course Name', levelGrade: 'Level / Grade', group: 'Group' },
];

// Number Input with Up/Down Arrows (Pixel-Perfect Attempt)
const NumberInput: React.FC<{ value: string; onChange: (val: string) => void; placeholder?: string }> = ({ value, onChange, placeholder = "00" }) => {
  const handleChange = (increment: number) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    num += increment;
    if (num < 0) num = 0;
    if (num > 99) num = 99; // Assuming max 99
    onChange(num.toString().padStart(2, '0'));
  };

  return (
    <div className="relative flex items-center justify-center bg-gray-50 border border-gray-200/90 rounded-md h-[38px] w-full px-1">
      <input
        type="text" // Using text to allow "00" format and easier control
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
          onChange(val.padStart(val.length > 0 ? 2 : 0, '0'));
        }}
        onBlur={(e) => { // Ensure "00" if empty on blur
          if (e.target.value.length === 1) onChange("0" + e.target.value);
          else if (e.target.value.length === 0) onChange("00");
        }}
        placeholder={placeholder}
        className="text-center text-[13px] font-medium text-gray-700 bg-transparent w-full focus:outline-none px-1"
        maxLength={2}
      />
      <div className="flex flex-col items-center justify-center h-full ml-0.5">
        <ChevronUp size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer -mb-0.5" onClick={() => handleChange(1)} />
        <ChevronUpDown size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer -mt-0.5" onClick={() => handleChange(-1)} />
      </div>
    </div>
  );
};


export default function CreateAIAssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // Default to step 1: Assessment Details
  const [studentSelectionType, setStudentSelectionType] = useState<'all' | 'selective'>('selective'); // Default to selective as per image
  const [selectedStudents, setSelectedStudents] = useState<string[]>(['std2']); // Example: one student selected

  // Form state (simplified)
  const [formData, setFormData] = useState({
    assessmentName: '', description: '', selectSubject: 'Option 1',
    selectClasses: 'Option 1', selectGroup: 'Option 1',
    testDate: '', expiryDate: '',
    durationHours: '00', durationMinutes: '00', totalPoints: '00', passPoints: '00',
    unitarySearch: '', studentSearch: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleNumberInputChange = (field: 'durationHours' | 'durationMinutes' | 'totalPoints' | 'passPoints', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [{ name: 'Assessment Details' }, { name: 'Review' }];

  const headerUser = useMemo(() => ({ name: 'Teacher Name', role: 'Teacher', avatarSrc: '/page3/entry/pri.png' }), []);

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
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
            Create AI Generated Assessment
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.07)] p-5 sm:p-7"> {/* Main content card */}
          <div className="mb-7">
            <Stepper currentStep={currentStep} steps={steps} />
          </div>

          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-5">
              {/* Left Column: Form Inputs */}
              <div className="space-y-[18px]">
                <div>
                  <label htmlFor="assessmentName" className="block text-[13px] font-medium text-gray-600 mb-1.5">Assessment Name</label>
                  <input type="text" id="assessmentName" value={formData.assessmentName} onChange={(e) => handleInputChange('assessmentName', e.target.value)} placeholder="Text"
                    className="w-full text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-[13px] font-medium text-gray-600 mb-1.5">Description</label>
                  <textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Text" rows={5}
                    className="w-full text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"></textarea>
                </div>

                {[
                  { label: "Select Subject", id: "selectSubject", field: "selectSubject" },
                  { label: "Select Classes", id: "selectClasses", field: "selectClasses" },
                  { label: "Select Group", id: "selectGroup", field: "selectGroup" },
                ].map(item => (
                  <div key={item.id}>
                    <label htmlFor={item.id} className="block text-[13px] font-medium text-gray-600 mb-1.5">{item.label}</label>
                    <div className="relative">
                      <select id={item.id} value={formData[item.field as keyof typeof formData]} onChange={(e) => handleInputChange(item.field as keyof typeof formData, e.target.value)}
                        className="w-full appearance-none text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
                        <option>Option 1</option><option>Option 2</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-x-4">
                  {[ { label: "Test Date", id: "testDate", field: "testDate" }, { label: "Expiry Date", id: "expiryDate", field: "expiryDate" } ]
                  .map(item => (
                    <div key={item.id}>
                      <label htmlFor={item.id} className="block text-[13px] font-medium text-gray-600 mb-1.5">{item.label}</label>
                      <div className="relative">
                        <input type="text" id={item.id} value={formData[item.field as keyof typeof formData]} onChange={(e) => handleInputChange(item.field as keyof typeof formData, e.target.value)} placeholder="Text"
                          className="w-full text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-9 placeholder-gray-400" />
                        <CalendarDays size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Duration & Point</label>
                  <div className="grid grid-cols-4 gap-x-2.5">
                    <NumberInput value={formData.durationHours} onChange={(val) => handleNumberInputChange('durationHours', val)} />
                    <NumberInput value={formData.durationMinutes} onChange={(val) => handleNumberInputChange('durationMinutes', val)} />
                    <NumberInput value={formData.totalPoints} onChange={(val) => handleNumberInputChange('totalPoints', val)} />
                    <NumberInput value={formData.passPoints} onChange={(val) => handleNumberInputChange('passPoints', val)} />
                  </div>
                  <div className="grid grid-cols-4 gap-x-2.5 text-[10px] text-gray-400 mt-1">
                    <span className="text-center">Hours</span><span className="text-center">Minutes</span>
                    <span className="text-center">Total Points</span><span className="text-center">Pass Points</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Unitary / Student Selection */}
              <div className="space-y-[18px]">
                {/* Unitary Section */}
                <div className="bg-gray-50/70 p-3.5 rounded-lg border border-gray-200/80">
                  <div className="relative mb-2.5">
                    <PackageSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Unitary search icon */}
                    <input type="text" placeholder="Unitary" value={formData.unitarySearch} onChange={e => handleInputChange('unitarySearch', e.target.value)}
                      className="w-full text-[13px] px-3 py-[7px] pl-9 border border-gray-300/80 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                  </div>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar-orange">
                    {unitaryOptionsData.map((opt, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-md border border-gray-200/70 shadow-sm cursor-pointer hover:border-blue-400">
                        <p className="text-[13px] font-medium text-gray-700">{opt.title}</p>
                        <p className="text-[11px] text-gray-500">{opt.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Selection Section */}
                <div className="bg-gray-50/70 p-3.5 rounded-lg border border-gray-200/80">
                    <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center text-[13px] cursor-pointer">
                            <input type="radio" name="studentSelectionType" value="all" checked={studentSelectionType === 'all'} onChange={() => setStudentSelectionType('all')} className="form-radio h-3.5 w-3.5 text-[#FF3366] border-gray-300 focus:ring-[#FF3366]/50"/>
                            <span className="ml-1.5 text-gray-700">For all</span>
                        </label>
                        <label className="flex items-center text-[13px] cursor-pointer">
                            <input type="radio" name="studentSelectionType" value="selective" checked={studentSelectionType === 'selective'} onChange={() => setStudentSelectionType('selective')} className="form-radio h-3.5 w-3.5 text-[#FF3366] border-gray-300 focus:ring-[#FF3366]/50"/>
                            <span className="ml-1.5 text-gray-700">For selective Students</span>
                        </label>
                    </div>
                    {studentSelectionType === 'selective' && (
                        <>
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="relative flex-grow">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search Student" value={formData.studentSearch} onChange={e => handleInputChange('studentSearch', e.target.value)}
                                    className="w-full text-[13px] px-3 py-[7px] pl-9 border border-gray-300/80 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                                </div>
                                <div className="text-[11px] text-gray-500 border border-gray-300/80 rounded-md px-2 py-[7px] bg-white whitespace-nowrap">June 2025</div>
                                <div className="relative">
                                    <select className="appearance-none text-[11px] text-gray-500 border border-gray-300/80 rounded-md px-2 py-[7px] pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option>1st STD</option><option>2nd STD</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar-orange">
                                {mockStudentsData.map(student => (
                                    <div key={student.id} onClick={() => toggleStudentSelection(student.id)}
                                        className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all duration-150
                                        ${selectedStudents.includes(student.id) ? 'bg-white border-pink-400 shadow-sm ring-1 ring-pink-300' : 'bg-white border-gray-200/70 hover:border-gray-300'}`}>
                                        <div className="flex items-center">
                                            <Image src={student.avatar} alt={student.name} width={36} height={36} className="rounded-full mr-2.5 border border-gray-200"/>
                                            <div>
                                                <p className="text-[13px] font-medium text-gray-700">{student.name}</p>
                                                <p className="text-[10px] text-gray-500">{student.course} • {student.levelGrade} • {student.group}</p>
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                            ${selectedStudents.includes(student.id) ? 'bg-[#FF3366] border-[#FF3366]' : 'border-gray-400 bg-white'}`}>
                                            {selectedStudents.includes(student.id) && <Check size={10} className="text-white"/>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg shadow-inner">
                Step 2: Review Content (Not Implemented for this request)
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => currentStep === 1 ? router.back() : setCurrentStep(currentStep - 1)}
              className="px-7 py-2.5 text-[13px] rounded-lg !border-gray-300/90 !text-gray-600 hover:!bg-gray-100">
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button variant="primary" onClick={() => currentStep === 1 ? setCurrentStep(2) : alert("Creating AI Assessment!")}
              className="px-8 py-2.5 text-[13px] rounded-lg !bg-[#3B82F6] hover:!bg-[#2563EB]">
              {currentStep === 1 ? 'Create' : 'Submit'} {/* Text changes from Create to Submit/Publish on last step */}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        .custom-scrollbar-orange::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-orange::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-orange::-webkit-scrollbar-thumb { background: #FDBA74; border-radius: 10px; } /* orange-300 */
        .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover { background: #FB923C; } /* orange-400 */
        .form-radio { appearance: none; -webkit-appearance: none; -moz-appearance: none; display: inline-block; position: relative; }
        .form-radio:checked::before { content: ''; display: block; width: 6px; height: 6px; background-color: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
      `}</style>
    </div>
  );
}