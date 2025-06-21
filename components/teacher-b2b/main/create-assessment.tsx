// app/teacher-b2b/assessments/create-new/page.tsx (Example Route)
"use client";

import React, { useState, useMemo, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // For student avatars
import Header from '@/components/layout/Header'; // Import your actual Header
import Footer from '@/components/layout/Footer'; // Import your actual Footer
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Search,
  Check,
  PackageSearch, // Placeholder for Unitary Search icon
  ChevronUp,
  ChevronDown as ChevronUpDown, // For number inputs
  Info,
  UploadCloud, // For Upload File button
  Edit3,       // For Edit buttons
  CheckCircle, // For correct option in review
  BookOpen,    // For "Choose from Existing"
  Zap,         // For "AI Generated"
} from 'lucide-react';


// --- Reusable UI Components (Pixel-Perfect Attempts) ---

interface BaseInputProps { label: string; id: string; }
const TextInput: React.FC<BaseInputProps & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-[13px] font-medium text-gray-600 mb-1.5">{label}</label>
    <input type="text" id={id} {...props}
      className="w-full text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-white"
      placeholder={props.placeholder || "Text"}
    />
  </div>
);
const TextareaInput: React.FC<BaseInputProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-[13px] font-medium text-gray-600 mb-1.5">{label}</label>
    <textarea id={id} {...props} rows={5}
      className="w-full text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none bg-white"
      placeholder={props.placeholder || "Text"}
    />
  </div>
);
interface SelectOption { value: string; label: string; }
const SelectDropdown: React.FC<BaseInputProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-[13px] font-medium text-gray-600 mb-1.5">{label}</label>
    <div className="relative">
      <select id={id} {...props}
        className="w-full appearance-none text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700">
        {options.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);
const DateInput: React.FC<BaseInputProps & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-[13px] font-medium text-gray-600 mb-1.5">{label}</label>
    <div className="relative">
      <input type="text" id={id} {...props}
        className="w-full text-[13px] px-3 py-2.5 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-9 placeholder-gray-400 bg-white"
        placeholder={props.placeholder || "Text"}
      />
      <CalendarDays size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);
const NumberSpinnerInput: React.FC<{ value: string; onChange: (val: string) => void; placeholder?: string }> = ({ value, onChange, placeholder = "00" }) => {
  const handleChange = (increment: number) => {
    let num = parseInt(value, 10); if (isNaN(num)) num = 0;
    num += increment; if (num < 0) num = 0; if (num > 99) num = 99;
    onChange(num.toString().padStart(2, '0'));
  };
  return (
    <div className="relative flex items-center justify-center bg-gray-50/80 border border-gray-200/90 rounded-md h-[38px] w-full px-1">
      <input type="text" value={value}
        onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2); onChange(val.padStart(val.length > 0 ? 2 : 0, '0')); }}
        onBlur={(e) => { if (e.target.value.length === 1) onChange("0" + e.target.value); else if (e.target.value.length === 0) onChange("00"); }}
        placeholder={placeholder} className="text-center text-[13px] font-medium text-gray-700 bg-transparent w-full focus:outline-none px-1" maxLength={2}
      />
      <div className="flex flex-col items-center justify-center h-full ml-0.5">
        <ChevronUp size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer -mb-0.5" onClick={() => handleChange(1)} />
        <ChevronUpDown size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer -mt-0.5" onClick={() => handleChange(-1)} />
      </div>
    </div>
  );
};
const Stepper: React.FC<{ currentStep: number; steps: { name: string }[] }> = ({ currentStep, steps }) => (
  <nav aria-label="Progress">
    <ol role="list" className="flex items-center justify-center space-x-1 sm:space-x-2">
      {steps.map((step, stepIdx) => (
        <React.Fragment key={step.name}>
          {stepIdx > 0 && (<div className="h-px w-5 sm:w-10 bg-gray-200"></div>)}
          <li className="flex flex-col items-center text-center">
            <div className={`flex items-center justify-center w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] rounded-full border-2 mb-1
              ${stepIdx === currentStep - 1 ? 'border-[#FF3366] bg-[#FF3366]/10 text-[#FF3366]' : stepIdx < currentStep - 1 ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-gray-100 text-gray-500'}`}>
              {stepIdx < currentStep - 1 ? <Check size={15} /> : <span className="text-[12px] sm:text-[13px] font-semibold">{stepIdx + 1}</span>}
            </div>
            <span className={`text-[11px] sm:text-xs font-medium leading-tight
              ${stepIdx === currentStep - 1 ? 'text-[#FF3366]' : stepIdx < currentStep - 1 ? 'text-green-600' : 'text-gray-500'}`}>{step.name}</span>
          </li>
        </React.Fragment>
      ))}
    </ol>
  </nav>
);
const GeneralButton: React.FC<{ variant?: 'primary'|'outline'|'yellow'|'link'; onClick?: () => void; children: React.ReactNode; className?: string; type?: "button"|"submit" }> = ({variant='primary', onClick, children, className, type='button'}) => {
    const styles = {
        primary: "bg-[#3B82F6] hover:bg-[#2563EB] text-white", // blue
        outline: "bg-white border border-gray-300/90 text-gray-600 hover:bg-gray-50",
        yellow: "bg-[#FFD43B] hover:bg-[#FFC700] text-gray-800",
        link: "text-[#3B82F6] hover:text-[#2563EB] hover:underline"
    }
    return <button type={type} onClick={onClick} className={`inline-flex items-center justify-center px-5 py-2 text-[13px] font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 ${styles[variant]} ${className}`}>{children}</button>
}

// --- Mock Data & Types ---
const sampleClassesOptions: SelectOption[] = [{ value: 'c1', label: 'Option 1' }];
const sampleGroupOptions: SelectOption[] = [{ value: 'g1', label: 'Option 1' }];
const unitaryOptsData = [{ title: "Option Title", subtitle: "Option Subtitle" }, { title: "Option Title", subtitle: "Option Subtitle" }, { title: "Option Title", subtitle: "Option Subtitle" }];
const mockStudentsList = [{ id: 's1', avatar: '/page3/entry/stu.png', name: 'Student Name', course: 'Course Name', levelGrade: 'Level / Grade', group: 'Group' }];
interface QuestionOption { id: string; text: string; }
interface Question { id: string; questionText: string; options: QuestionOption[]; correctOptionId: string | null; points: number; numOptionsToShow: number; } // numOptionsToShow for UI
const initialQuestionsData: Question[] = [
  { id: `q-001`, questionText: 'Which part of the plant makes food ?', options: [{id:'opt-0', text:''},{id:'opt-1', text:'Leaves'},{id:'opt-2', text:''},{id:'opt-3', text:''}], correctOptionId: 'opt-1', points: 4, numOptionsToShow: 4 },
  { id: `q-002`, questionText: '', options: Array.from({ length: 4 }, (_, i) => ({ id: `opt-${i}`, text: '' })), correctOptionId: null, points: 0, numOptionsToShow: 4 },
];


// --- Main Page Component ---
export default function CreateMultiStepAssessmentPage() {
  const router = useRouter();
  const pageUniqueId = useId();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State
  const [formData, setFormData] = useState({
    assessmentName: '', description: '', selectSubject: 'Option 1', selectClasses: 'Option 1', selectGroup: 'Option 1',
    testDate: '', expiryDate: '', durationHours: '00', durationMinutes: '00', totalPoints: '00', passPoints: '00',
    unitarySearch: '', studentSearch: ''
  });
  const [studentSelectionType, setStudentSelectionType] = useState<'all' | 'selective'>('selective');
  const [selectedStudentsList, setSelectedStudentsList] = useState<string[]>(['s1']); // Example

  // Step 2 State
  const [questions, setQuestions] = useState<Question[]>(initialQuestionsData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormInputChange = (field: keyof typeof formData, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleNumInputChange = (field: 'durationHours' | 'durationMinutes' | 'totalPoints' | 'passPoints', value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleStudent = (id: string) => setSelectedStudentsList(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // Step 2 Question Handlers
  const handleQTextChange = (qIdx: number, val: string) => setQuestions(qs => qs.map((q, i) => i === qIdx ? {...q, questionText: val} : q));
  const handleOptTextChange = (qIdx: number, oIdx: number, val: string) => setQuestions(qs => qs.map((q, i) => i === qIdx ? {...q, options: q.options.map((o,k) => k === oIdx ? {...o, text: val} : o)} : q));
  const handleCorrectOptChange = (qIdx: number, optId: string) => setQuestions(qs => qs.map((q, i) => i === qIdx ? {...q, correctOptionId: optId} : q));
  const handlePointsChange = (qIdx: number, val: string) => {
    let num = parseInt(val, 10); if(isNaN(num)) num = 0; if(num < 0) num = 0; if(num > 99) num = 99;
    setQuestions(qs => qs.map((q, i) => i === qIdx ? {...q, points: num} : q));
  };
  const handleNumOptionsUiChange = (qIdx: number, increment: boolean) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i === qIdx) {
        let newNum = q.numOptionsToShow + (increment ? 1 : -1);
        if (newNum < 1) newNum = 1; if (newNum > 6) newNum = 6; // Max 6 options for UI
        // Adjust actual options array if newNum is larger
        const currentActualOptions = q.options.length;
        let newOptionsArray = [...q.options];
        if (newNum > currentActualOptions) {
          for (let k = currentActualOptions; k < newNum; k++) {
            newOptionsArray.push({ id: `opt-${pageUniqueId}-${qIdx}-${k}`, text: '' });
          }
        }
        return { ...q, numOptionsToShow: newNum, options: newOptionsArray };
      }
      return q;
    }));
  };


  const stepsConfig = [{ name: 'Assessment Details' }, { name: 'Assessment Questionnaire' }, { name: 'Review' }];
  const headerUser = useMemo(() => ({ name: 'Teacher Name', role: 'Teacher', avatarSrc: '/page3/entry/pri.png' }), []);

  const totalPointsFromQuestions = useMemo(() => questions.reduce((sum, q) => sum + q.points, 0), [questions]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
      <Header user={headerUser} />
      <main className="flex-grow container mx-auto px-4 sm:px-5 lg:px-6 py-5">
        {/* Top Bar: Back Arrow, Title, Action Buttons for Step 1 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center">
                <button onClick={() => currentStep === 1 ? router.back() : setCurrentStep(s => s - 1)} className="p-1.5 mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-[#FF3366]">
                    {currentStep === 1 && 'Create Assessment'}
                    {currentStep === 2 && 'Create Assessment - Questionnaire'}
                    {currentStep === 3 && 'Create Assessment - Review'}
                </h1>
            </div>
            {currentStep === 1 && (
                <div className="flex items-center gap-2 self-start sm:self-center w-full sm:w-auto">
                    <GeneralButton variant="outline" onClick={() => alert("Choose from Existing Clicked")} className="flex-1 sm:flex-none !py-[7px] !px-3 !text-[12px] !border-blue-500 !text-blue-600 hover:!bg-blue-50">
                        <BookOpen size={15} className="mr-1.5"/> Choose From Existing Assessment
                    </GeneralButton>
                    <GeneralButton variant="primary" onClick={() => alert("AI Generated Clicked")} className="flex-1 sm:flex-none !py-[7px] !px-3 !text-[12px] !bg-gradient-to-r !from-[#6D28D9] !to-[#4F46E5] hover:!opacity-90"> {/* Purple gradient */}
                        <Zap size={15} className="mr-1.5"/> AI Generated Assessment
                    </GeneralButton>
                </div>
            )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.07)] p-5 sm:p-7">
          <div className="mb-7">
            <Stepper currentStep={currentStep} steps={stepsConfig} />
          </div>

          {/* STEP 1: Assessment Details */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-5">
              <div className="space-y-[18px]"> {/* Left Column */}
                <TextInput label="Assessment Name" id="assessmentName-s1" value={formData.assessmentName} onChange={e => handleFormInputChange('assessmentName', e.target.value)} />
                <TextareaInput label="Description" id="description-s1" value={formData.description} onChange={e => handleFormInputChange('description', e.target.value)} />
                <SelectDropdown label="Select Classes" id="selectClasses-s1" options={sampleClassesOptions} value={formData.selectClasses} onChange={e => handleFormInputChange('selectClasses', e.target.value)} />
                <SelectDropdown label="Select Group" id="selectGroup-s1" options={sampleGroupOptions} value={formData.selectGroup} onChange={e => handleFormInputChange('selectGroup', e.target.value)} />
                <div className="grid grid-cols-2 gap-x-4">
                  <DateInput label="Test Date" id="testDate-s1" value={formData.testDate} onChange={e => handleFormInputChange('testDate', e.target.value)} />
                  <DateInput label="Expiry Date" id="expiryDate-s1" value={formData.expiryDate} onChange={e => handleFormInputChange('expiryDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Duration & Point</label>
                  <div className="grid grid-cols-4 gap-x-2.5">
                    <NumberSpinnerInput value={formData.durationHours} onChange={(val) => handleNumInputChange('durationHours', val)} />
                    <NumberSpinnerInput value={formData.durationMinutes} onChange={(val) => handleNumInputChange('durationMinutes', val)} />
                    <NumberSpinnerInput value={formData.totalPoints} onChange={(val) => handleNumInputChange('totalPoints', val)} />
                    <NumberSpinnerInput value={formData.passPoints} onChange={(val) => handleNumInputChange('passPoints', val)} />
                  </div>
                  <div className="grid grid-cols-4 gap-x-2.5 text-[10px] text-gray-400 mt-1">
                    <span className="text-center">Hours</span><span className="text-center">Minutes</span>
                    <span className="text-center">Total Points</span><span className="text-center">Pass Points</span>
                  </div>
                </div>
              </div>
              <div className="space-y-[18px]"> {/* Right Column */}
                <div className="bg-gray-50/70 p-3.5 rounded-lg border border-gray-200/80">
                  <div className="relative mb-2.5">
                    <PackageSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Unitary" value={formData.unitarySearch} onChange={e => handleFormInputChange('unitarySearch', e.target.value)}
                      className="w-full text-[13px] px-3 py-[7px] pl-9 border border-gray-300/80 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-white"/>
                  </div>
                  <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-1 custom-orange-scrollbar">
                    {unitaryOptsData.map((opt, idx) => (<div key={idx} className="bg-white p-2.5 rounded-md border border-gray-200/70 shadow-sm cursor-pointer hover:border-blue-400"><p className="text-[13px] font-medium text-gray-700">{opt.title}</p><p className="text-[11px] text-gray-500">{opt.subtitle}</p></div>))}
                  </div>
                </div>
                <div className="bg-gray-50/70 p-3.5 rounded-lg border border-gray-200/80">
                    <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center text-[13px] cursor-pointer"><input type="radio" name="studentSelectionType" value="all" checked={studentSelectionType === 'all'} onChange={() => setStudentSelectionType('all')} className="form-radio h-3.5 w-3.5 text-[#FF3366] border-gray-300 focus:ring-[#FF3366]/50"/><span className="ml-1.5 text-gray-700">For all</span></label>
                        <label className="flex items-center text-[13px] cursor-pointer"><input type="radio" name="studentSelectionType" value="selective" checked={studentSelectionType === 'selective'} onChange={() => setStudentSelectionType('selective')} className="form-radio h-3.5 w-3.5 text-[#FF3366] border-gray-300 focus:ring-[#FF3366]/50"/><span className="ml-1.5 text-gray-700">For selective Students</span></label>
                    </div>
                    {studentSelectionType === 'selective' && (<>
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="relative flex-grow"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search Student" value={formData.studentSearch} onChange={e => handleFormInputChange('studentSearch', e.target.value)} className="w-full text-[13px] px-3 py-[7px] pl-9 border border-gray-300/80 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-white"/></div>
                            <div className="text-[11px] text-gray-500 border border-gray-300/80 rounded-md px-2 py-[7px] bg-white whitespace-nowrap">June 2025</div>
                            <div className="relative"><select className="appearance-none text-[11px] text-gray-500 border border-gray-300/80 rounded-md px-2 py-[7px] pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"><option>1st STD</option></select><ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                        </div>
                        <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 custom-orange-scrollbar">
                            {mockStudentsList.map(student => (<div key={student.id} onClick={() => toggleStudent(student.id)} className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all duration-150 ${selectedStudentsList.includes(student.id) ? 'bg-white border-pink-400 shadow-sm ring-1 ring-pink-300' : 'bg-white border-gray-200/70 hover:border-gray-300'}`}>
                                <div className="flex items-center"><Image src={student.avatar} alt={student.name} width={36} height={36} className="rounded-full mr-2.5 border border-gray-200"/><div className="mr-1"><p className="text-[13px] font-medium text-gray-700 leading-tight">{student.name}</p><p className="text-[10px] text-gray-500 leading-tight">{student.course} • {student.levelGrade} • {student.group}</p></div></div>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedStudentsList.includes(student.id) ? 'bg-[#FF3366] border-[#FF3366]' : 'border-gray-400 bg-white'}`}>{selectedStudentsList.includes(student.id) && <Check size={10} className="text-white"/>}</div>
                            </div>))}
                        </div></>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Assessment Questionnaire */}
          {currentStep === 2 && (
            <div className="space-y-6">
                {questions.map((q, qIdx) => (
                    <div key={q.id} className="pb-6 mb-6 border-b border-gray-200/80 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex items-center mb-2">
                            <label htmlFor={`${pageUniqueId}-qText-${qIdx}`} className="block text-[13px] font-medium text-gray-600 mr-1.5 whitespace-nowrap">Question {qIdx + 1}.</label>
                            <div className="flex-grow"><input type="text" id={`${pageUniqueId}-qText-${qIdx}`} value={q.questionText} onChange={e => handleQTextChange(qIdx, e.target.value)} placeholder="Question" className="w-full text-[13px] px-3 py-2 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-white"/></div>
                        </div>
                        <div className="flex items-center my-3 gap-2">
                            <label className="block text-[13px] font-medium text-gray-600">Options</label>
                            <div className="flex items-center bg-gray-100/80 rounded-md p-px border border-gray-200/90 w-[60px] h-7">
                                <span className="text-[13px] font-medium text-gray-700 mx-auto w-5 text-center">{q.numOptionsToShow}</span>
                                <div className="flex flex-col items-center justify-center h-full ml-0.5"><ChevronUp size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer -mb-1" onClick={() => handleNumOptionsUiChange(qIdx, true)} /><ChevronUpDown size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer -mt-1" onClick={() => handleNumOptionsUiChange(qIdx, false)} /></div>
                            </div>
                        </div>
                        <div className="space-y-2.5 pl-4 mb-3">
                            {Array.from({length: q.numOptionsToShow}).map((_, oIdx) => (
                                <div key={q.options[oIdx]?.id || oIdx} className="flex items-center">
                                    <label htmlFor={`${pageUniqueId}-q${qIdx}-optText-${oIdx}`} className="text-[13px] text-gray-500 mr-1.5 w-[50px] whitespace-nowrap">Option {oIdx + 1}:</label>
                                    <div className="flex-grow"><input type="text" id={`${pageUniqueId}-q${qIdx}-optText-${oIdx}`} value={q.options[oIdx]?.text || ''} onChange={e => handleOptTextChange(qIdx, oIdx, e.target.value)} placeholder={`Option ${oIdx+1} Text`} className="w-full text-[13px] px-3 py-2 border border-gray-300/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-white"/></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                            {Array.from({length: q.numOptionsToShow}).map((_, oIdx) => (q.options[oIdx] &&
                                <label key={q.options[oIdx].id} className="flex items-center text-[13px] cursor-pointer"><input type="radio" name={`${pageUniqueId}-q${qIdx}-correct`} value={q.options[oIdx].id} checked={q.correctOptionId === q.options[oIdx].id} onChange={() => handleCorrectOptChange(qIdx, q.options[oIdx].id)} className="form-radio h-3.5 w-3.5 text-[#FF3366] border-gray-300 focus:ring-[#FF3366]/50"/><span className="ml-1.5 text-gray-600">Option {oIdx + 1}</span></label>
                            ))}
                            <div className="flex items-center ml-auto gap-2">
                                <label className="text-[13px] font-medium text-gray-600">Points</label>
                                <div className="flex items-center bg-gray-100/80 rounded-md p-px border border-gray-200/90 w-[60px] h-7">
                                  <input type="text" value={String(q.points).padStart(2,'0')} onChange={e => handlePointsChange(qIdx, e.target.value)} className="text-center text-[13px] font-medium text-gray-700 bg-transparent w-[30px] focus:outline-none px-1" maxLength={2}/>
                                  <div className="flex flex-col items-center justify-center h-full ml-0.5"><ChevronUp size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer -mb-1" /><ChevronUpDown size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer -mt-1" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {/* STEP 3: Review Assessment */}
          {currentStep === 3 && (
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">{formData.assessmentName || "Assessment Title"}</h2>
                    <p className="text-[13px] text-gray-500 mb-3 leading-relaxed">{formData.description || "No description provided."}</p>
                    <div className="bg-gray-50/70 p-3.5 rounded-lg text-[12px] text-gray-500 space-y-0.5 border border-gray-200/80">
                        <p>Scheduled for: <span className="text-[#FF3366] font-medium">{formData.testDate || "N/A"}, 06:00 AM</span> <span className="text-[#FF3366] font-medium ml-2">{sampleGroupOptions.find(g=>g.value === formData.selectGroup)?.label || "N/A"}</span></p>
                        <p>Time: {formData.durationHours} Hours : {formData.durationMinutes} Minutes</p>
                        <p>Total Point: {formData.totalPoints || totalPointsFromQuestions}</p> {/* Use calculated if manual is 00 */}
                        <p>Passing: {formData.passPoints}</p>
                        <p>Expiry Date: {formData.expiryDate || "N/A"}</p>
                    </div>
                    <GeneralButton variant="outline" onClick={() => setCurrentStep(1)} className="!mt-3 !px-3 !py-1.5 !text-[12px]"><Edit3 size={14} className="mr-1"/> Edit</GeneralButton>
                </div>
                <div className="space-y-5">
                    {questions.map((q, qIdx) => (
                        <div key={q.id} className="bg-gray-50/70 p-3.5 rounded-lg border border-gray-200/80">
                            <div className="flex justify-between items-start mb-1.5">
                                <div><p className="text-[11px] text-gray-400">Question {qIdx + 1}</p><h3 className="text-[14px] font-medium text-gray-700">{q.questionText}</h3></div>
                                <p className="text-[13px] font-medium text-gray-600 whitespace-nowrap">{q.points} Points</p>
                            </div>
                            <div className="space-y-1.5 mb-2.5">
                                {q.options.slice(0, q.numOptionsToShow).map(opt => (<div key={opt.id} className={`p-2.5 rounded-md text-[13px] ${opt.id === q.correctOptionId ? 'bg-green-100/70 text-green-700 flex items-center border border-green-200/80' : 'bg-white text-gray-700 border border-gray-200/80'}`}> {opt.id === q.correctOptionId && <CheckCircle size={15} className="mr-1.5 text-green-500"/>}{opt.text || `Option ${opt.id}`}</div>))}
                            </div>
                             <GeneralButton variant="outline" onClick={() => setCurrentStep(2)} className="!px-3 !py-1.5 !text-[12px]"><Edit3 size={14} className="mr-1"/> Edit</GeneralButton>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`mt-8 flex ${currentStep === 1 ? 'justify-end' : 'justify-end'} space-x-3 pt-5 border-t border-gray-200/90`}>
            {currentStep > 1 && (<GeneralButton variant="outline" onClick={() => setCurrentStep(s => s-1)}>Cancel</GeneralButton>)}
            {currentStep === 1 && (<GeneralButton variant="outline" onClick={() => router.back()}>Cancel</GeneralButton>)}

            {currentStep === 1 && (<GeneralButton variant="primary" onClick={() => setCurrentStep(2)}>Continue</GeneralButton>)}
            {currentStep === 2 && (<>
                <GeneralButton variant="primary" onClick={() => alert("Save Clicked")}>Save</GeneralButton>
                <GeneralButton variant="primary" onClick={() => setCurrentStep(3)}>Preview</GeneralButton>
                <GeneralButton variant="yellow" onClick={() => fileInputRef.current?.click()} className="!px-4"><UploadCloud size={16} className="mr-1.5"/>Upload File</GeneralButton>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => console.log("File:", e.target.files?.[0])} />
            </>)}
            {currentStep === 3 && (<>
                <GeneralButton variant="primary" onClick={() => alert("Save Clicked")}>Save</GeneralButton>
                <GeneralButton variant="primary" onClick={() => alert("Publish Clicked")}>Publish</GeneralButton>
            </>)}
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        .custom-orange-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-orange-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-orange-scrollbar::-webkit-scrollbar-thumb { background: #FDBA74; border-radius: 10px; }
        .custom-orange-scrollbar::-webkit-scrollbar-thumb:hover { background: #FB923C; }
        .form-radio { appearance: none; -webkit-appearance: none; -moz-appearance: none; display: inline-block; position: relative; }
        .form-radio:checked::before { content: ''; display: block; width: 6px; height: 6px; background-color: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
      `}</style>
    </div>
  );
}