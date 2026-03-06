
import React, { useState } from 'react';
import { pastPapers } from '../data/pastPapersData';
import Button from './common/Button';

interface RealExamSelectionScreenProps {
    onSelectExam: (subject: string, year: string) => void;
    goBack: () => void;
}

const RealExamSelectionScreen: React.FC<RealExamSelectionScreenProps> = ({ onSelectExam, goBack }) => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const subjectList = Object.keys(pastPapers);

    const getSubjectName = (key: string) => {
        return pastPapers[key]?.name || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const getSubjectIcon = (key: string) => {
        return pastPapers[key]?.icon || '📝';
    };

    if (selectedSubject) {
        const papers = pastPapers[selectedSubject].papers;
        const years = Object.keys(papers).sort((a, b) => b.localeCompare(a));

        return (
            <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setSelectedSubject(null)} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">{getSubjectName(selectedSubject)} Exams</h1>
                </div>

                <div className="space-y-4">
                    {years.map((year) => (
                        <button
                            key={year}
                            onClick={() => onSelectExam(selectedSubject, year)}
                            className="w-full bg-white dark:bg-slate-800 p-6 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700 hover:border-green-500 hover:translate-y-[-2px] transition-all text-left flex items-center justify-between group"
                        >
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                                    {year} {selectedSubject === 'sat' ? 'SAT' : selectedSubject === 'aptitude' ? 'Aptitude' : 'EEUE'} Exam
                                </h3>
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">
                                    {papers[year].totalQuestions} Questions • {papers[year].duration}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors">
                                <span className="text-green-500">▶</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={goBack} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Real Exams</h1>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                Select a subject to see available full-length exams with a 60-minute time limit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjectList.map((subject) => (
                    <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700 hover:border-green-500 hover:translate-y-[-2px] transition-all text-left flex items-center gap-4 group"
                    >
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors">
                            {getSubjectIcon(subject)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white">{getSubjectName(subject)}</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">
                                {Object.keys(pastPapers[subject].papers).length} Exams Available
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-100 dark:border-amber-900/30 rounded-3xl">
                <h4 className="text-amber-800 dark:text-amber-400 font-black mb-2 flex items-center gap-2">
                    <span>⚠️</span> Exam Rules
                </h4>
                <ul className="text-amber-700/80 dark:text-amber-400/70 text-sm space-y-2 font-bold">
                    <li>• You cannot pause the timer once started.</li>
                    <li>• The exam will automatically submit when time is up.</li>
                    <li>• AI Tutor is disabled during real exams.</li>
                </ul>
            </div>
        </div>
    );
};

export default RealExamSelectionScreen;
