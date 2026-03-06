
import React from 'react';
import { books } from '../data/booksData';

interface BookPdfScreenProps {
    subjectKey: string;
    grade: 11 | 12;
    goBack: () => void;
}

const BookPdfScreen: React.FC<BookPdfScreenProps> = ({ subjectKey, grade, goBack }) => {
    const subject = books[subjectKey];
    const gradeData = subject?.grades[grade];

    if (!gradeData || !gradeData.pdfUrl) {
        return (
            <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-6xl mb-6">⚠️</span>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">PDF Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">Sorry, the PDF for this textbook is not available at the moment.</p>
                <button 
                    onClick={goBack}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            {/* Modern Top Navigation Bar */}
            <nav className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 shadow-sm z-10">
                <button 
                    onClick={goBack}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-slate-300"
                    aria-label="Go back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </button>
                
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {subject.name} <span className="text-slate-400 dark:text-slate-500 font-medium ml-1">Grade {grade}</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <a 
                        href={gradeData.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        </svg>
                        External
                    </a>
                </div>
            </nav>

            {/* Full Screen PDF Viewer */}
            <div className="flex-1 relative bg-slate-100 dark:bg-slate-950">
                <iframe 
                    src={`${gradeData.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                    className="w-full h-full border-none"
                    title={`${subject.name} Grade ${grade} Textbook`}
                />
                
                {/* Mobile Floating Action Button for External View */}
                <a 
                    href={gradeData.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
                    title="Open in new tab"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default BookPdfScreen;
