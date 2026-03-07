
import React, { useState, useEffect, useRef } from 'react';
import { books } from '../data/booksData';
import { Document, Page, pdfjs } from 'react-pdf';

// Import styles
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf using a reliable CDN link that matches the installed version
// We use a specific version to avoid compatibility issues
const PDFJS_VERSION = '4.8.69';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

interface BookPdfScreenProps {
    subjectKey: string;
    grade: 11 | 12;
    goBack: () => void;
}

const BookPdfScreen: React.FC<BookPdfScreenProps> = ({ subjectKey, grade, goBack }) => {
    const subject = books[subjectKey];
    const gradeData = subject?.grades[grade];
    
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle responsive width
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // Use a small delay to ensure layout is stable
                const width = containerRef.current.clientWidth;
                if (width > 0) {
                    setContainerWidth(width - 32); // 16px padding on each side
                }
            }
        };
        
        // Initial call
        updateWidth();
        
        // Use ResizeObserver for better responsiveness than window 'resize'
        const observer = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        
        return () => observer.disconnect();
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (err: Error) => {
        console.error('PDF Load Error:', err);
        setIsLoading(false);
        setError('Failed to load the PDF. Please try opening it externally.');
    };

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
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col overflow-hidden">
            {/* Top Navigation Bar */}
            <nav className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 shadow-sm z-30">
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
                    {/* Zoom Controls (Desktop/Tablet) */}
                    <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mr-2">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300">➖</button>
                        <span className="px-2 text-xs font-bold text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(3.0, s + 0.2))} className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300">➕</button>
                    </div>
                    
                    <a 
                        href={gradeData.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        </svg>
                        <span className="hidden sm:inline">Open Full</span>
                    </a>
                </div>
            </nav>

            {/* PDF Viewer Content Area */}
            <div 
                ref={containerRef}
                className="flex-1 relative bg-slate-100 dark:bg-slate-950 overflow-auto flex flex-col items-center p-4 scroll-smooth"
            >
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 z-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 font-bold animate-pulse">Loading Textbook...</p>
                    </div>
                )}

                {error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <span className="text-5xl mb-4">😕</span>
                        <p className="text-slate-800 dark:text-white font-bold mb-4">{error}</p>
                        <a 
                            href={gradeData.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-md"
                        >
                            Open PDF Externally
                        </a>
                    </div>
                ) : (
                    <Document
                        file={gradeData.pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        className="shadow-2xl mb-24 max-w-full"
                    >
                        {containerWidth && (
                            <Page 
                                pageNumber={pageNumber} 
                                scale={scale}
                                width={containerWidth}
                                renderAnnotationLayer={true}
                                renderTextLayer={true}
                                className="rounded-sm overflow-hidden"
                                loading={<div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-sm" />}
                            />
                        )}
                    </Document>
                )}

                {/* Mobile Zoom Hint */}
                {!isLoading && !error && (
                    <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                        Pinch to zoom (if supported) or use buttons
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !error && numPages && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl px-4 py-2 flex items-center gap-4 z-40">
                        <div className="flex items-center gap-1">
                            <button 
                                disabled={pageNumber <= 1}
                                onClick={() => {
                                    setPageNumber(p => p - 1);
                                    containerRef.current?.scrollTo(0, 0);
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full disabled:opacity-20 transition-colors"
                                aria-label="Previous page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                            </button>
                            
                            <div className="flex flex-col items-center px-2 min-w-[80px]">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page</span>
                                <span className="text-base font-black text-slate-900 dark:text-white">
                                    {pageNumber} <span className="text-slate-400 font-medium mx-0.5">/</span> {numPages}
                                </span>
                            </div>

                            <button 
                                disabled={pageNumber >= numPages}
                                onClick={() => {
                                    setPageNumber(p => p + 1);
                                    containerRef.current?.scrollTo(0, 0);
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full disabled:opacity-20 transition-colors"
                                aria-label="Next page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Zoom Buttons */}
                        <div className="md:hidden h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                        <div className="md:hidden flex items-center gap-1">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.25))} className="p-2 text-lg">➖</button>
                            <button onClick={() => setScale(s => Math.min(3.0, s + 0.25))} className="p-2 text-lg">➕</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookPdfScreen;
