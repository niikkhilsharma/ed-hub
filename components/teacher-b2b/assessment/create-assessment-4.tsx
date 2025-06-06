"use client";

import React, { useState, useId, useRef } from 'react';
import { FiArrowLeft, FiCloud, FiSearch, FiCalendar, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiUpload, FiCheckCircle, FiEdit3 } from 'react-icons/fi';

// --- Reusable Components (from previous step, with potential additions/modifications) ---

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
  id: string;
}
const TextInput: React.FC<TextInputProps> = ({ label, id, ...props }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type="text"
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
      placeholder={props.placeholder || "Text"}
    />
  </div>
);

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}
const TextareaInput: React.FC<TextareaInputProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      {...props}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
      placeholder={props.placeholder || "Text"}
    />
  </div>
);

interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
}
const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 appearance-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}
const DateInput: React.FC<DateInputProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        id={id}
        {...props}
        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
        placeholder={props.placeholder || "Text"}
      />
      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

interface NumberSpinnerInputProps {
  label: string;
  value: number;
  onValueChange: (newValue: number) => void;
  min?: number;
  max?: number;
}
const NumberSpinnerInput: React.FC<NumberSpinnerInputProps> = ({ label, value, onValueChange, min = 0, max = 99 }) => {
  const increment = () => onValueChange(Math.min(max, value + 1));
  const decrement = () => onValueChange(Math.max(min, value - 1));

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      <div className="flex items-center justify-between bg-gray-100 rounded-md p-1 w-[70px] h-10 border border-gray-200">
        <span className="text-sm font-medium text-gray-700 mx-1.5">{String(value).padStart(2, '0')}</span>
        <div className="flex flex-col items-center justify-center">
          <button onClick={increment} className="text-gray-500 hover:text-gray-700 focus:outline-none h-1/2 flex items-center">
            <FiChevronUp size={14} />
          </button>
          <button onClick={decrement} className="text-gray-500 hover:text-gray-700 focus:outline-none h-1/2 flex items-center">
            <FiChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProgressStepProps {
  number: number;
  label: string;
  isActive: boolean;
}
const ProgressStep: React.FC<ProgressStepProps> = ({ number, label, isActive }) => (
  <div className="flex items-center">
    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 font-medium
      ${isActive ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-300 text-gray-500'}`}>
      {number}
    </div>
    <span className={`ml-2 text-sm font-medium ${isActive ? 'text-pink-500' : 'text-gray-600'}`}>{label}</span>
  </div>
);

interface CustomRadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  size?: 'medium' | 'large';
}
const CustomRadio: React.FC<CustomRadioProps> = ({ id, name, value, checked, onChange, label, size = 'medium' }) => {
  const SIZES = { medium: { outer: 'w-4 h-4', inner: 'w-1.5 h-1.5' }, large: { outer: 'w-5 h-5', inner: 'w-2 h-2' } };
  const currentSize = SIZES[size] || SIZES.medium;
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer group">
      <div className={`flex items-center justify-center rounded-full border-2 transition-all ${currentSize.outer} ${checked ? 'border-blue-500' : 'border-gray-400 group-hover:border-gray-500'}`}>
        {checked && <div className={`rounded-full bg-blue-500 ${currentSize.inner}`}></div>}
      </div>
      {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
};

interface Student { id: string; avatarUrl: string; name: string; courseName: string; levelGrade: string; group: string; }
interface StudentListItemProps { student: Student; isSelected: boolean; onSelect: (studentId: string) => void; }
const StudentListItem: React.FC<StudentListItemProps> = ({ student, isSelected, onSelect }) => (
  <div className={`flex items-center justify-between p-3 border-b border-gray-100 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
    <div className="flex items-center">
      <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
      <div><p className="text-sm font-medium text-gray-800">{student.name}</p><p className="text-xs text-gray-500">{student.courseName} | {student.levelGrade} | {student.group}</p></div>
    </div><CustomRadio id={`student-${student.id}`} name="selectedStudent" value={student.id} checked={isSelected} onChange={() => onSelect(student.id)} size="large" />
  </div>
);

interface CompactSpinnerProps { value: number; onIncrement: () => void; onDecrement: () => void; min?: number; max?: number; formatValue?: (value: number) => string; }
const CompactSpinner: React.FC<CompactSpinnerProps> = ({ value, onIncrement, onDecrement, min = 1, max = 10, formatValue }) => {
  const displayValue = formatValue ? formatValue(value) : String(value);
  return (
    <div className="flex items-center bg-gray-100 rounded-md p-1 w-[60px] h-8 border border-gray-200">
      <span className="text-sm font-medium text-gray-700 mx-1.5 w-5 text-center">{displayValue}</span>
      <div className="flex flex-col items-center justify-center">
        <button onClick={onIncrement} disabled={value >= max} className="text-gray-500 hover:text-gray-700 focus:outline-none h-1/2 flex items-center disabled:opacity-50"><FiChevronUp size={14} /></button>
        <button onClick={onDecrement} disabled={value <= min} className="text-gray-500 hover:text-gray-700 focus:outline-none h-1/2 flex items-center disabled:opacity-50"><FiChevronDown size={14} /></button>
      </div>
    </div>
  );
};

interface QuestionOption { id: string; text: string; }
interface Question { id: string; questionText: string; options: QuestionOption[]; correctOptionId: string | null; points: number; numOptions: number; }

const sampleClasses: SelectOption[] = [{ value: 'option1', label: 'Option 1' }, { value: 'batch1', label: 'Batch 1' }];
const sampleGroups: SelectOption[] = [{ value: 'option1', label: 'Option 1' }, { value: 'batch1', label: 'Batch 1' }];
const sampleUnitaryOptions = [{ title: "Option Title 1", subtitle: "Option Subtitle for 1" }];
const sampleStudents: Student[] = [{ id: 's1', avatarUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=80&w=80', name: 'Student Name A', courseName: 'Mathematics', levelGrade: '1st STD', group: 'Section A' }];
const sampleStandards: SelectOption[] = [{ value: 'std_1', label: '1st STD' }];

const initialQuestions: Question[] = [
  { id: `q-${Math.random().toString(36).substr(2, 9)}`, questionText: 'Which part of the plant makes food ?', options: [{id:'opt-0', text:'Roots'},{id:'opt-1', text:'Leaves (Correct Answer)'},{id:'opt-2', text:'Stem'},{id:'opt-3', text:'Flower'}], correctOptionId: 'opt-1', points: 4, numOptions: 4 },
  { id: `q-${Math.random().toString(36).substr(2, 9)}`, questionText: 'What is the capital of France?', options: Array.from({ length: 4 }, (_, i) => ({ id: `opt-${i}`, text: `Option ${i+1}` })), correctOptionId: null, points: 0, numOptions: 4 },
];

const MockHeader: React.FC = () => ( <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50"> <div className="container mx-auto flex justify-between items-center"> <div className="text-xl font-bold">EDUNIQUE</div> <nav className="flex space-x-4 items-center"> {['Dashboard', 'Students', 'Material', 'Recordings', 'Chat'].map(item => ( <a key={item} href="#" className="hover:text-blue-200 text-sm">{item}</a> ))} <button className="bg-yellow-400 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center"> <FiSearch className="mr-1.5" /> Ask me! </button> <FiCloud className="w-5 h-5" /> <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=40&w=40" alt="User" className="w-8 h-8 rounded-full" /> </nav> </div> </header> );
const MockFooter: React.FC = () => ( <footer className="bg-blue-700 text-white py-12"> <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm"> <div><h3 className="font-semibold mb-3">Company</h3><ul>{['Home', 'About us', 'Academics', 'Co - Parent', 'STEAM', 'Forum', 'Franchises', 'Foundation'].map(link => (<li key={link}><a href="#" className="hover:text-blue-200 py-0.5 block">{link}</a></li>))}</ul></div> <div><h3 className="font-semibold mb-3">Resources</h3><ul>{['Skill Development', 'Brain Development', 'Schools Collaboration', 'Teacher Collaboration', 'Skill Development Centers', 'Notsoextra curricular', 'Summer Courses', 'Competitions', 'Steamnology'].map(link => (<li key={link}><a href="#" className="hover:text-blue-200 py-0.5 block">{link}</a></li>))}</ul></div> <div><h3 className="font-semibold mb-3">Support</h3><ul>{['Products', 'Blogs', 'Privacy Policy', 'Shipping Policy', 'Terms & Conditions', 'Disclaimers'].map(link => (<li key={link}><a href="#" className="hover:text-blue-200 py-0.5 block">{link}</a></li>))}</ul></div> <div><h3 className="font-semibold mb-3">Contact Us</h3><p className="mb-1">Eldeco Centre, Malviya Nagar...</p><p className="mb-1">Phone: (+91) 922-044-2129</p><p className="mb-1">Email for Queries: info@edunique.in</p><p className="mb-1">Email for Support: supportyou@edunique.in</p><p>Email for Careers: rightfit@edunique.in</p><div className="flex space-x-3 mt-4">{['O','X','in','f'].map(s=><div key={s} className="w-8 h-8 bg-white text-blue-700 rounded-md flex items-center justify-center font-bold">{s}</div>)}</div></div> </div> <div className="text-center text-xs mt-8 border-t border-blue-600 pt-6">Edunique All Rights Reserved 2025</div> </footer> );

interface AssessmentDetailsSectionProps { onContinue: () => void; assessmentName: string; setAssessmentName: (val: string) => void; description: string; setDescription: (val: string) => void; selectedClass: string; setSelectedClass: (val: string) => void; selectedGroup: string; setSelectedGroup: (val: string) => void; testDate: string; setTestDate: (val: string) => void; expiryDate: string; setExpiryDate: (val: string) => void; durationHours: number; setDurationHours: (val: number) => void; durationMinutes: number; setDurationMinutes: (val: number) => void; totalPoints: number; setTotalPoints: (val: number) => void; passPoints: number; setPassPoints: (val: number) => void; assignmentScope: 'all' | 'selective'; setAssignmentScope: (val: 'all' | 'selective') => void; selectedStudentId: string | null; setSelectedStudentId: (val: string | null) => void; searchStudentQuery: string; setSearchStudentQuery: (val: string) => void; currentStudentMonth: string; selectedStandard: string; setSelectedStandard: (val: string) => void; }
const AssessmentDetailsSection: React.FC<AssessmentDetailsSectionProps> = (props) => { const { onContinue, assessmentName, setAssessmentName, description, setDescription, selectedClass, setSelectedClass, selectedGroup, setSelectedGroup, testDate, setTestDate, expiryDate, setExpiryDate, durationHours, setDurationHours, durationMinutes, setDurationMinutes, totalPoints, setTotalPoints, passPoints, setPassPoints, assignmentScope, setAssignmentScope, selectedStudentId, setSelectedStudentId, searchStudentQuery, setSearchStudentQuery, currentStudentMonth, selectedStandard, setSelectedStandard } = props; const filteredStudents = sampleStudents.filter(student => student.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) && student.levelGrade === selectedStandard ); return ( <> <div className="grid grid-cols-1 lg:grid-cols-5 gap-8"> <div className="lg:col-span-3 space-y-6"> <TextInput label="Assessment Name" id="assessmentName" value={assessmentName} onChange={e => setAssessmentName(e.target.value)} /> <TextareaInput label="Description" id="description" value={description} onChange={e => setDescription(e.target.value)} /> <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> <SelectDropdown label="Select Classes" id="selectClasses" options={sampleClasses} value={selectedClass} onChange={e => setSelectedClass(e.target.value)} /> <SelectDropdown label="Select Group" id="selectGroup" options={sampleGroups} value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} /> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> <DateInput label="Test Date" id="testDate" value={testDate} onChange={e => setTestDate(e.target.value)} placeholder="DD/MM/YYYY"/> <DateInput label="Expiry Date" id="expiryDate" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="DD/MM/YYYY"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-2">Duration & Point</label> <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"> <NumberSpinnerInput label="Hours" value={durationHours} onValueChange={setDurationHours} max={23} /> <NumberSpinnerInput label="Minutes" value={durationMinutes} onValueChange={setDurationMinutes} max={59} /> <NumberSpinnerInput label="Total Points" value={totalPoints} onValueChange={setTotalPoints} max={999}/> <NumberSpinnerInput label="Pass Points" value={passPoints} onValueChange={setPassPoints} max={999}/> </div> </div> </div> <div className="lg:col-span-2 space-y-6"> <div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Unitary" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50" /></div> <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto custom-orange-scrollbar">{sampleUnitaryOptions.map((opt, index) => ( <div key={index} className={`p-3 cursor-pointer ${index !== sampleUnitaryOptions.length -1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}><p className="text-sm font-medium text-gray-800">{opt.title}</p><p className="text-xs text-gray-500">{opt.subtitle}</p></div> ))}</div> <div className="flex space-x-6 pt-2"><CustomRadio id="forAllStudents" name="assignmentScope" value="all" checked={assignmentScope === 'all'} onChange={() => setAssignmentScope('all')} label="For all" /><CustomRadio id="forSelectiveStudents" name="assignmentScope" value="selective" checked={assignmentScope === 'selective'} onChange={() => setAssignmentScope('selective')} label="For selective Students" /></div> {assignmentScope === 'selective' && ( <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50"> <div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search Student" value={searchStudentQuery} onChange={(e) => setSearchStudentQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div> <div className="flex items-center justify-between"><div className="flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1.5"><button className="p-1 hover:bg-gray-100 rounded-full focus:outline-none"><FiChevronLeft size={16} /></button><span className="mx-2 whitespace-nowrap">{currentStudentMonth}</span><button className="p-1 hover:bg-gray-100 rounded-full focus:outline-none"><FiChevronRight size={16} /></button></div><div className="relative w-28"><select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white">{sampleStandards.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" /></div></div> <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto custom-orange-scrollbar bg-white">{filteredStudents.length > 0 ? filteredStudents.map(student => ( <StudentListItem key={student.id} student={student} isSelected={selectedStudentId === student.id} onSelect={setSelectedStudentId} /> )) : ( <p className="p-4 text-sm text-gray-500 text-center">No students found.</p> )}</div> </div> )} </div> </div> <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-3"> <button type="button" className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">Cancel</button> <button type="button" onClick={onContinue} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Continue</button> </div> </> ); };

interface AssessmentQuestionnaireSectionProps { questions: Question[]; setQuestions: React.Dispatch<React.SetStateAction<Question[]>>; onCancel: () => void; onSave: () => void; onPreview: () => void; onUpload: () => void; }
const AssessmentQuestionnaireSection: React.FC<AssessmentQuestionnaireSectionProps> = ({ questions, setQuestions, onCancel, onSave, onPreview, onUpload }) => { const pageId = useId(); const handleQuestionChange = (qIndex: number, field: keyof Question, value: any) => { setQuestions(prevQs => prevQs.map((q, i) => (i === qIndex ? { ...q, [field]: value } : q))); }; const handleOptionTextChange = (qIndex: number, optIndex: number, text: string) => { setQuestions(prevQs => prevQs.map((q, i) => i === qIndex ? { ...q, options: q.options.map((opt, oi) => oi === optIndex ? { ...opt, text } : opt ), } : q )); }; const handleNumOptionsChange = (qIndex: number, newNumOptions: number) => { setQuestions(prevQs => prevQs.map((q, i) => { if (i === qIndex) { const currentOptions = q.options; let newOptionsArray: QuestionOption[]; if (newNumOptions > currentOptions.length) { newOptionsArray = [ ...currentOptions, ...Array.from({ length: newNumOptions - currentOptions.length }, (_, k) => ({ id: `opt-${currentOptions.length + k}`, text: '', })), ]; } else { newOptionsArray = currentOptions.slice(0, newNumOptions); } const correctOptionStillExists = newOptionsArray.some(opt => opt.id === q.correctOptionId); return { ...q, numOptions: newNumOptions, options: newOptionsArray, correctOptionId: correctOptionStillExists ? q.correctOptionId : null, }; } return q; })); }; const fileInputRef = React.useRef<HTMLInputElement>(null); const handleUploadClick = () => { fileInputRef.current?.click(); }; return ( <div className="space-y-8"> {questions.map((q, qIndex) => ( <div key={q.id} className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"> <div className="flex items-center mb-1"> <label htmlFor={`${pageId}-qText-${qIndex}`} className="block text-sm font-medium text-gray-700 mr-2">Question {qIndex + 1}.</label> <div className="flex-grow"><TextInput id={`${pageId}-qText-${qIndex}`} value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} placeholder="Question"/></div> </div> <div className="flex items-center my-4"><label className="block text-sm font-medium text-gray-700 mr-3">Options</label><CompactSpinner value={q.numOptions} onIncrement={() => handleNumOptionsChange(qIndex, Math.min(10, q.numOptions + 1))} onDecrement={() => handleNumOptionsChange(qIndex, Math.max(1, q.numOptions - 1))} min={1} max={10}/></div> <div className="space-y-3 pl-4 mb-4">{q.options.slice(0, q.numOptions).map((opt, optIndex) => ( <div key={opt.id} className="flex items-center"> <label htmlFor={`${pageId}-q${qIndex}-optText-${optIndex}`} className="text-sm text-gray-600 mr-2 w-16">Option {optIndex + 1}:</label> <div className="flex-grow"><TextInput id={`${pageId}-q${qIndex}-optText-${optIndex}`} value={opt.text} onChange={(e) => handleOptionTextChange(qIndex, optIndex, e.target.value)} placeholder="Question"/></div> </div> ))}</div> <div className="flex items-center space-x-4 flex-wrap">{q.options.slice(0, q.numOptions).map((opt, optIndex) => ( <CustomRadio key={opt.id} id={`${pageId}-q${qIndex}-correctOpt-${opt.id}`} name={`${pageId}-q${qIndex}-correctAnswer`} value={opt.id} checked={q.correctOptionId === opt.id} onChange={() => handleQuestionChange(qIndex, 'correctOptionId', opt.id)} label={`Option ${optIndex + 1}`}/> ))}<div className="flex items-center ml-auto"><label className="text-sm font-medium text-gray-700 mr-2">Points</label><CompactSpinner value={q.points} onIncrement={() => handleQuestionChange(qIndex, 'points', Math.min(100, q.points + 1))} onDecrement={() => handleQuestionChange(qIndex, 'points', Math.max(0, q.points - 1))} min={0} max={100} formatValue={(val) => String(val).padStart(2, '0')}/></div></div> </div> ))} <div className="mt-10 pt-6 flex justify-end space-x-3"> <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">Cancel</button> <button type="button" onClick={onSave} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Save</button> <button type="button" onClick={onPreview} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Preview</button> <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { if(e.target.files) console.log("Uploaded file:", e.target.files[0].name);}} /> <button type="button" onClick={handleUploadClick} className="px-6 py-2 text-sm font-medium text-gray-700 bg-yellow-400 border border-transparent rounded-lg shadow-sm hover:bg-yellow-500 transition-colors flex items-center"><FiUpload className="mr-2 h-4 w-4"/> Upload File</button> </div> </div> ); };

// --- Step 3: Assessment Review Component ---
interface AssessmentReviewSectionProps {
  assessmentName: string;
  description: string;
  testDate: string;
  batchName: string;
  durationHours: number;
  durationMinutes: number;
  totalPoints: number;
  passPoints: number;
  expiryDate: string;
  questions: Question[];
  onEditDetails: () => void;
  onEditQuestion: (qIndex: number) => void;
  onCancel: () => void;
  onSave: () => void;
  onPublish: () => void;
}
const AssessmentReviewSection: React.FC<AssessmentReviewSectionProps> = ({
  assessmentName, description, testDate, batchName, durationHours, durationMinutes,
  totalPoints, passPoints, expiryDate, questions,
  onEditDetails, onEditQuestion, onCancel, onSave, onPublish
}) => {
  const formatDuration = () => {
    if (durationHours > 0 && durationMinutes > 0) return `${durationHours} Hours : ${durationMinutes} Minutes`;
    if (durationHours > 0) return `${durationHours} Hours`;
    return `${durationMinutes} Minutes`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{assessmentName || "Assessment Title"}</h2>
        <p className="text-sm text-gray-600 mb-4">{description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 space-y-1 mb-4">
          <p>Scheduled for: <span className="text-pink-600 font-medium">{testDate || "12/04/2025"}, 06:00 AM</span> <span className="text-pink-600 font-medium ml-2">{batchName || "Batch 1"}</span></p>
          <p>Time : {formatDuration()}</p>
          <p>Total Point: {totalPoints}</p>
          <p>Passing: {passPoints}</p>
          <p>Expiry Date: {expiryDate || "14/04/2025"}</p>
        </div>
        <button 
          onClick={onEditDetails}
          className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition-colors flex items-center"
        >
          <FiEdit3 className="mr-1.5 h-4 w-4" /> Edit
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-gray-500">Question {qIndex + 1}</p>
                <h3 className="text-md font-semibold text-gray-800">{q.questionText}</h3>
              </div>
              <p className="text-sm font-medium text-gray-700">{q.points} Points</p>
            </div>
            <div className="space-y-2 mb-3">
              {q.options.slice(0, q.numOptions).map(opt => (
                <div 
                  key={opt.id} 
                  className={`p-3 rounded-md text-sm
                    ${opt.id === q.correctOptionId 
                      ? 'bg-green-100 text-green-700 flex items-center' 
                      : 'bg-white text-gray-700 border border-gray-200'}`}
                >
                  {opt.id === q.correctOptionId && <FiCheckCircle className="mr-2 h-5 w-5 text-green-500" />}
                  {opt.text || `Option ${opt.id}`}
                </div>
              ))}
            </div>
            <button 
              onClick={() => onEditQuestion(qIndex)}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition-colors flex items-center"
            >
              <FiEdit3 className="mr-1.5 h-4 w-4" /> Edit
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="button" onClick={onSave} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Save</button>
        <button type="button" onClick={onPublish} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Publish</button>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function CreateAssessmentPage() {
  const [currentStep, setCurrentStep] = React.useState(1);

  const [assessmentName, setAssessmentName] = React.useState('My Biology Test');
  const [description, setDescription] = React.useState('This test covers chapters 1-3 on plant biology and photosynthesis.');
  const [selectedClass, setSelectedClass] = React.useState(sampleClasses[0].value);
  const [selectedGroup, setSelectedGroup] = React.useState(sampleGroups[1].value); // 'batch1'
  const [testDate, setTestDate] = React.useState('12/04/2025');
  const [expiryDate, setExpiryDate] = React.useState('14/04/2025');
  const [durationHours, setDurationHours] = React.useState(0);
  const [durationMinutes, setDurationMinutes] = React.useState(30);
  const [totalPointsState, setTotalPointsState] = React.useState(100); // from image
  const [passPoints, setPassPoints] = React.useState(40); // from image
  const [assignmentScope, setAssignmentScope] = React.useState<'all' | 'selective'>('all');
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);
  const [searchStudentQuery, setSearchStudentQuery] = React.useState('');
  const [currentStudentMonth] = React.useState('June 2025');
  const [selectedStandard, setSelectedStandard] = React.useState(sampleStandards[0].value);
  
  const [questions, setQuestions] = React.useState<Question[]>(initialQuestions);

  const handleBackClick = () => { if (typeof window !== "undefined") { window.history.back(); } };
  const goToNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const goToPrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(step, 3)));


  const step1Props = { assessmentName, setAssessmentName, description, setDescription, selectedClass, setSelectedClass, selectedGroup, setSelectedGroup, testDate, setTestDate, expiryDate, setExpiryDate, durationHours, setDurationHours, durationMinutes, setDurationMinutes, totalPoints: totalPointsState, setTotalPoints: setTotalPointsState, passPoints, setPassPoints, assignmentScope, setAssignmentScope, selectedStudentId, setSelectedStudentId, searchStudentQuery, setSearchStudentQuery, currentStudentMonth, selectedStandard, setSelectedStandard, onContinue: goToNextStep, };
  const step2Props = { questions, setQuestions, onCancel: goToPrevStep, onSave: () => console.log("Save Questionnaire", questions), onPreview: goToNextStep, onUpload: () => console.log("Upload questions clicked"), };
  
  const selectedGroupObject = sampleGroups.find(g => g.value === selectedGroup);
  const batchNameForReview = selectedGroupObject ? selectedGroupObject.label : "N/A";

  // Calculate total points for review from questions if not using the manually set totalPointsState
  const calculatedTotalPoints = questions.reduce((sum, q) => sum + q.points, 0);


  const step3Props = {
    assessmentName, description, testDate, batchName: batchNameForReview, durationHours, durationMinutes,
    totalPoints: totalPointsState, // Using the manually set total points from step 1
    passPoints, expiryDate, questions,
    onEditDetails: () => goToStep(1),
    onEditQuestion: (qIndex: number) => {
      console.log("Edit question index:", qIndex); // Can be used to focus/scroll in step 2
      goToStep(2);
    },
    onCancel: goToPrevStep, // Go back to questionnaire
    onSave: () => console.log("Save Assessment Review"),
    onPublish: () => console.log("Publish Assessment"),
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <MockHeader />
      <main className="flex-grow py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
            <div className="flex items-center">
              <button onClick={handleBackClick} className="mr-2 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back"> <FiArrowLeft className="w-5 h-5 text-gray-700" /> </button>
              {currentStep === 1 && <h1 className="text-xl font-semibold text-gray-800">Create Assessment</h1>}
            </div>
            {currentStep === 1 && ( <div className="flex items-center space-x-3 w-full sm:w-auto"> <button className="flex-1 sm:flex-none flex items-center justify-center bg-white border border-gray-300 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"> <FiCloud className="mr-2 w-4 h-4" /> Choose From Existing Assessment </button> <button className="flex-1 sm:flex-none flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"> AI Generated Assessment <FiCloud className="ml-2 w-4 h-4" /> </button> </div> )}
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 pb-6 space-y-4 sm:space-y-0">
              <ProgressStep number={1} label="Assessment Details" isActive={currentStep === 1} />
              <div className="hidden sm:block flex-grow border-t-2 border-dashed border-gray-300 mx-4 self-center h-0 w-1/4"></div>
              <ProgressStep number={2} label="Assessment Questionnaire" isActive={currentStep === 2} />
              <div className="hidden sm:block flex-grow border-t-2 border-dashed border-gray-300 mx-4 self-center h-0 w-1/4"></div>
              <ProgressStep number={3} label="Review" isActive={currentStep === 3} />
            </div>
            {currentStep === 1 && <AssessmentDetailsSection {...step1Props} />}
            {currentStep === 2 && <AssessmentQuestionnaireSection {...step2Props} />}
            {currentStep === 3 && <AssessmentReviewSection {...step3Props} />}
          </div>
        </div>
      </main>
      <MockFooter />
      <style jsx global>{` .custom-orange-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-orange-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; } .custom-orange-scrollbar::-webkit-scrollbar-thumb { background: #FFAB91; border-radius: 10px; } .custom-orange-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF8A65; } .custom-orange-scrollbar { scrollbar-width: thin; scrollbar-color: #FFAB91 #f1f1f1; } `}</style>
    </div>
  );
}