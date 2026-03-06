
import React from 'react';
import { View } from '../types';
import { motion } from 'framer-motion';

interface NavBarProps {
    setView: (view: View) => void;
    activeView: View;
}

interface NavItemProps {
    icon: string;
    label: string;
    onClick: () => void;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, isActive }) => {
    return (
        <button
            onClick={onClick}
            className="relative flex flex-col items-center justify-center py-2 h-full transition-all w-full group"
        >
            <motion.span 
                animate={{ 
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -2 : 0 
                }}
                className={`text-2xl mb-1 z-10 transition-colors ${isActive ? 'grayscale-0' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}
            >
                {icon}
            </motion.span>
            <span className={`text-[10px] font-black tracking-tighter uppercase z-10 transition-colors ${isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {label}
            </span>
            
            {isActive && (
                <motion.div 
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-2xl -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </button>
    );
};

const NavBar: React.FC<NavBarProps> = ({ setView, activeView }) => {
    const learningViews: View[] = ['subjects', 'units', 'levels', 'books', 'book-grade', 'book-chapters', 'book-reader', 'quiz', 'real-exam-selection'];

    const isLearnActive = learningViews.includes(activeView) && !['books', 'book-grade', 'book-chapters', 'book-reader', 'real-exam-selection'].includes(activeView);
    const isBooksActive = ['books', 'book-grade', 'book-chapters', 'book-reader'].includes(activeView);
    const isExamsActive = activeView === 'real-exam-selection';
    const isScoresActive = activeView === 'progress';
    const isProfileActive = activeView === 'profile';

    return (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none">
            <nav className="mx-auto max-w-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] h-20 flex items-center justify-around px-2 pointer-events-auto">
                <NavItem 
                    icon="📝" 
                    label="Learn" 
                    onClick={() => setView('subjects')} 
                    isActive={isLearnActive} 
                />
                <NavItem 
                    icon="📖" 
                    label="Books" 
                    onClick={() => setView('books')} 
                    isActive={isBooksActive} 
                />
                <NavItem 
                    icon="🎓" 
                    label="Exams" 
                    onClick={() => setView('real-exam-selection')} 
                    isActive={isExamsActive} 
                />
                <NavItem 
                    icon="📊" 
                    label="Scores" 
                    onClick={() => setView('progress')} 
                    isActive={isScoresActive} 
                />
                <NavItem 
                    icon="👤" 
                    label="Profile" 
                    onClick={() => setView('profile')} 
                    isActive={isProfileActive} 
                />
            </nav>
        </div>
    );
};

export default NavBar;
