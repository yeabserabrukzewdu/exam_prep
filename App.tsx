import React, { useState, useCallback, useEffect } from 'react';
import { User, View, QuizDetails, PastPaperDetails, BookDetails } from './types';

import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SubjectSelectionScreen from './components/SubjectSelectionScreen';
import UnitSelectionScreen from './components/UnitSelectionScreen';
import LevelSelectionScreen from './components/LevelSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ProgressScreen from './components/ProgressScreen';
import PersonalInfoScreen from './components/PersonalInfoScreen';
import BooksScreen from './components/PastPapersScreen';
import BookGradeScreen from './components/BookGradeScreen';
import BookChaptersScreen from './components/BookChaptersScreen';
import BookReaderScreen from './components/BookReaderScreen';
import BookPdfScreen from './components/BookPdfScreen';
import RealExamSelectionScreen from './components/RealExamSelectionScreen';
import NavBar from './components/NavBar';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('home');
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

    const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
    const [pastPaperDetails, setPastPaperDetails] = useState<PastPaperDetails | null>(null);
    const [realExamDetails, setRealExamDetails] = useState<{ subject: string; timeLimit: number } | null>(null);
    
    // Book State
    const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
    
    const [viewHistory, setViewHistory] = useState<View[]>(['home']);

    const navigate = useCallback((newView: View) => {
        setView(prevView => {
            setViewHistory(history => [...history, prevView]);
            return newView;
        });
    }, []);

    const goBack = useCallback(() => {
        setViewHistory(history => {
            const lastView = history[history.length - 1];
            if(lastView) {
                setView(lastView);
                return history.slice(0, -1);
            }
            return history;
        });
    }, []);

    // Helper: Fetch user data by email from API
    const fetchUserByEmail = async (email: string): Promise<User | null> => {
        try {
            const response = await fetch(`/api/users/${encodeURIComponent(email)}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    console.error("Fetch user error (JSON):", errorData);
                } else {
                    const errorText = await response.text();
                    console.error("Fetch user error (Text):", errorText);
                }
                return null;
            }
            return await response.json();
        } catch (e) {
            console.error("Network error fetching user:", e);
            return null;
        }
    };

    // Effect: Check for existing session on mount
    useEffect(() => {
        const restoreSession = async () => {
            const savedEmail = localStorage.getItem('matric_user_email');
            if (savedEmail) {
                const user = await fetchUserByEmail(savedEmail);
                if (user) {
                    setCurrentUser(user);
                    // Skip login screens if session exists
                    setView('subjects'); 
                }
            }
            setIsLoadingSession(false);
        };
        restoreSession();
    }, []);

    // Called after successful LOGIN
    const handleLoginSuccess = (user: User) => {
        localStorage.setItem('matric_user_email', user.email);
        setCurrentUser(user);
        navigate('subjects');
    };

    // Called after successful SIGNUP (Initial DB creation)
    const handleSignupSuccess = (user: User) => {
        localStorage.setItem('matric_user_email', user.email);
        setCurrentUser(user);
        // Go directly to welcome screen
        navigate('welcome');
    }
    
    // Called after Welcome Screen
    const handleWelcomeContinue = () => {
         // Directly go to subjects, skipping onboarding
         navigate('subjects');
    }

    const handleLogout = () => {
        localStorage.removeItem('matric_user_email');
        setCurrentUser(null);
        setView('home');
        setViewHistory(['home']);
    };

    // --- Supabase Actions ---

    // 1. General Profile Update
    const handleUpdateProfile = async (updatedUser: User) => {
        setCurrentUser(updatedUser);
        try {
            const response = await fetch(`/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: updatedUser.name,
                    phone: updatedUser.phone,
                    streak: updatedUser.streak,
                    last_quiz_date: updatedUser.lastQuizDate,
                    progress: updatedUser.progress
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Update profile error:", errorData);
            }
        } catch (e) {
            console.error("Network error updating profile:", e);
        }
    };

    // 2. Save Quiz Result
    const handleSaveQuizResult = async (updatedUser: User, subject: string, score: number, total: number, unit?: string, level?: number, year?: string, type: 'quiz' | 'past_paper' | 'real_exam' = 'quiz') => {
        setCurrentUser(updatedUser);
        try {
            const response = await fetch(`/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    streak: updatedUser.streak,
                    last_quiz_date: updatedUser.lastQuizDate,
                    progress: updatedUser.progress
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Save quiz result error:", errorData);
            }
        } catch (e) {
            console.error("Network error saving quiz result:", e);
        }
    };

    // Login: Refactored to use helper
    const handleLoginAttempt = async (email: string, password: string): Promise<User | null> => {
        const user = await fetchUserByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    };

    // Signup: Uses Username, Email, Password
    const handleSignupAttempt = async (username: string, email: string, password: string): Promise<User | null> => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: username,
                    email,
                    password,
                    full_name: username
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Signup error:", errorData);
                return null;
            }
            
            return await response.json();
        } catch (e) {
            console.error("Network error during signup:", e);
            return null;
        }
    };
    
    const renderView = () => {
        switch (view) {
            case 'home':
                return <HomeScreen onGetStarted={() => navigate('login')} />;
            case 'login':
                return (
                    <LoginScreen 
                        onLoginAttempt={handleLoginAttempt}
                        onSignupAttempt={handleSignupAttempt}
                        onLoginSuccess={handleLoginSuccess} 
                        onSignupSuccess={handleSignupSuccess}
                    />
                );
            case 'welcome':
                return <WelcomeScreen name={currentUser?.name || currentUser?.id || 'Student'} onContinue={handleWelcomeContinue} />;
            case 'subjects':
                return <SubjectSelectionScreen onSelectSubject={(subject) => { setSelectedSubject(subject); navigate('units'); }} goBack={goBack} />;
            case 'units':
                return <UnitSelectionScreen subjectKey={selectedSubject!} onSelectUnit={(unit) => { setSelectedUnit(unit); navigate('levels'); }} goBack={goBack} />;
            case 'levels':
                return <LevelSelectionScreen currentUser={currentUser!} subjectKey={selectedSubject!} unitKey={selectedUnit!} onSelectLevel={(level) => { setQuizDetails({ subject: selectedSubject!, unit: selectedUnit!, level }); setPastPaperDetails(null); navigate('quiz'); }} goBack={goBack} />;
            case 'quiz':
                return <QuizScreen currentUser={currentUser!} onSaveQuizResult={handleSaveQuizResult} quizDetails={quizDetails} pastPaperDetails={pastPaperDetails} realExamDetails={realExamDetails} onQuizEnd={() => navigate('subjects')} goBack={goBack} />;
            case 'progress':
                return <ProgressScreen user={currentUser!} />;
            case 'profile':
                return <PersonalInfoScreen user={currentUser!} onUpdateUser={handleUpdateProfile} onLogout={handleLogout} goBack={goBack} />;
            
            // Book Routes
            case 'books':
                return <BooksScreen onSelectSubject={(subject) => { setSelectedSubject(subject); navigate('book-grade'); }} goBack={goBack} />;
            case 'book-grade':
                 return <BookGradeScreen subjectKey={selectedSubject!} onSelectGrade={(grade) => { setBookDetails({ subject: selectedSubject!, grade }); navigate('book-pdf'); }} goBack={goBack} />;
            case 'book-chapters':
                 return <BookChaptersScreen subjectKey={bookDetails!.subject} grade={bookDetails!.grade} onSelectChapter={(idx) => { setBookDetails(prev => ({ ...prev!, chapterIndex: idx })); navigate('book-reader'); }} goBack={goBack} />;
            case 'book-reader':
                 return <BookReaderScreen subjectKey={bookDetails!.subject} grade={bookDetails!.grade} chapterIndex={bookDetails!.chapterIndex!} goBack={goBack} />;
            case 'book-pdf':
                 return <BookPdfScreen subjectKey={bookDetails!.subject} grade={bookDetails!.grade} goBack={goBack} />;
            
            case 'real-exam-selection':
                return <RealExamSelectionScreen onSelectExam={(subject, year) => { setRealExamDetails({ subject, year, timeLimit: 60 }); setQuizDetails(null); setPastPaperDetails(null); navigate('quiz'); }} goBack={goBack} />;

            default:
                return <HomeScreen onGetStarted={() => navigate('login')} />;
        }
    };

    if (isLoadingSession) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                     {/* Embedded Mascot SVG (Small) */}
                    <div className="w-20 h-20 relative animate-pulse">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                             <circle cx="100" cy="100" r="90" fill="#e2e8f0" className="dark:fill-slate-700" />
                             <path fill="#58CC02" d="M49.3,-46.6C64.6,-32.9,78.2,-16.4,79.8,1.4C81.4,19.2,71,38.5,55.9,52.3C40.8,66.1,20.4,74.5,-1.9,76C-24.2,77.5,-48.4,72,-61.7,57.5C-75,43,-77.4,19.5,-73.2,0.3C-69,-18.9,-58.3,-33.8,-45.1,-46.8C-31.9,-59.8,-16,-70.8,-0.3,-70.6C15.3,-70.4,34,-59.3,49.3,-46.6Z" transform="translate(100 100) scale(1.1)" />
                             <circle cx="75" cy="90" r="8" fill="white" />
                             <circle cx="125" cy="90" r="8" fill="white" />
                             <circle cx="77" cy="90" r="3" fill="black" />
                             <circle cx="123" cy="90" r="3" fill="black" />
                             <path d="M 85 110 Q 100 125 115 110" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen pt-4 sm:pt-6 md:pt-8 px-4">
            <main className="w-full max-w-2xl mx-auto flex-grow pb-32">
                {renderView()}
            </main>
            {currentUser && !['quiz', 'login', 'home', 'welcome', 'book-pdf'].includes(view) && <NavBar setView={navigate} activeView={view} />}
        </div>
    );
};

export default App;
