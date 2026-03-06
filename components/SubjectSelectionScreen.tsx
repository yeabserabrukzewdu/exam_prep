import React from 'react';
import Container from './common/Container';
import Button from './common/Button';
import { subjects } from '../data/quizData';

interface SubjectSelectionScreenProps {
    onSelectSubject: (subject: string) => void;
    goBack: () => void;
}

const subjectIcons: Record<string, string> = {
    math: '➕',
    biology: '🧬',
    chemistry: '🧪',
    english: '📖',
    physics: '⚡️',
    history: '🗿',
    geography: '🌍',
    economics: '💰',
    sat: '📝',
    aptitude: '🧠',
};

const SubjectSelectionScreen: React.FC<SubjectSelectionScreenProps> = ({ onSelectSubject, goBack }) => {
    return (
        <Container title="Choose a Subject" goBack={goBack}>
            {Object.keys(subjects).map(subjectKey => (
                <Button 
                    key={subjectKey} 
                    icon={subjectIcons[subjectKey] || '📚'} 
                    onClick={() => onSelectSubject(subjectKey)}
                    variant="list"
                >
                    <span className="text-xl capitalize">{subjectKey}</span>
                </Button>
            ))}
        </Container>
    );
};

export default SubjectSelectionScreen;