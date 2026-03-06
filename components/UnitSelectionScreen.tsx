import React from 'react';
import Container from './common/Container';
import Button from './common/Button';
import { subjects } from '../data/quizData';

interface UnitSelectionScreenProps {
    subjectKey: string;
    onSelectUnit: (unit: string) => void;
    goBack: () => void;
}

const unitIcons: Record<string, string> = {
    // Math
    "relations and functions": '📉',
    "rational expressions and rational functions": '➗',
    "matrices": '🔳',
    "determinants and their properties": '🔲',
    "vectors": '➡️',
    "transformations of the plane": '🔄',
    "statistics": '📊',
    "probablity": '🎲',
    "sequences and series": '♾️',
    "introductions to calculus": '📉',
    "statistics_g12": '📈',
    "introduction to linear programming": '🎯',
    "mathematical applications in business": '💸',

    // Physics
    "physics and human society": '🌍',
    "motion in one and two dimensions": '🏎️',
    "dynamics": '💥',
    "heat conduction and calorimetry": '🌡️',
    "electrostatics and electric circuit": '🔌',
    "nuclear physics": '⚛️',
    "application of physics in other fields": '🛠️',
    "two-dimensional motion": '🛸',
    "fluid mechanics": '💧',
    "electromagnetism": '🧲',
    "basics of electronics": '📟',

    // Chemistry
    "atomic structure and periodic properties of the elements": '⚛️',
    "chemical bonding": '🔗',
    "physical states of matter": '☁️',
    "chemical kinetics": '⏱️',
    "chemical equilibrium": '⚖️',
    "some important oxygen containing organic compound": '🧪',
    "acid-base equilibria": '🍋',
    "electrochemistry": '🔋',
    "industrial chemistry": '🏭',
    "polymers": '🧬',
    "introduction of environmental chemistry": '🌱',

    // Biology
    "biology and technology": '🧬',
    "animals": '🦁',
    "enzymes": '⚡',
    "genetics": '🧬',
    "the human body systems": '🩺',
    "population and natural resources": '🌳',
    "application of biology": '💊',
    "microorganisms": '🦠',
    "energy transformation": '☀️',
    "evolution": '🐒',
    "human body system": '🫁',
    "climate change": '🌡️',
    "introduction of environmental chemistry_bio": '🌎',
};

const unitDescriptions: Record<string, Record<string, string>> = {
    math: {
        "Relations and functions": "Grade 11 • Unit 1",
        "Rational expressions and rational functions": "Grade 11 • Unit 2",
        "matrices": "Grade 11 • Unit 3",
        "determinants and their properties": "Grade 11 • Unit 4",
        "vectors": "Grade 11 • Unit 5",
        "transformations of the plane": "Grade 11 • Unit 6",
        "statistics": "Grade 11 • Unit 7",
        "probablity": "Grade 11 • Unit 8",
        "sequences and series": "Grade 12 • Unit 1",
        "introductions to Calculus": "Grade 12 • Unit 2",
        "statistics_G12": "Grade 12 • Unit 3",
        "introduction to linear programming": "Grade 12 • Unit 4",
        "mathematical applications in business": "Grade 12 • Unit 5"
    },
    physics: {
        "Physics and human society": "Grade 11 • Unit 1",
        "vectors": "Grade 11 • Unit 2",
        "Motion in one and two dimensions": "Grade 11 • Unit 3",
        "Dynamics": "Grade 11 • Unit 4",
        "Heat conduction and calorimetry": "Grade 11 • Unit 5",
        "Electrostatics and electric circuit": "Grade 11 • Unit 6",
        "Nuclear physics": "Grade 11 • Unit 7",
        "Application of physics in other fields": "Grade 12 • Unit 1",
        "Two-dimensional motion": "Grade 12 • Unit 2",
        "Fluid mechanics": "Grade 12 • Unit 3",
        "Electromagnetism": "Grade 12 • Unit 4",
        "Basics of electronics": "Grade 12 • Unit 5"
    },
    chemistry: {
        "Atomic structure and periodic properties of the Elements": "Grade 11 • Unit 1",
        "Chemical bonding": "Grade 11 • Unit 2",
        "Physical States of matter": "Grade 11 • Unit 3",
        "Chemical kinetics": "Grade 11 • Unit 4",
        "Chemical equilibrium": "Grade 11 • Unit 5",
        "Some important oxygen containing organic compound": "Grade 11 • Unit 6",
        "Acid-Base equilibria": "Grade 12 • Unit 1",
        "Electrochemistry": "Grade 12 • Unit 2",
        "Industrial chemistry": "Grade 12 • Unit 3",
        "Polymers": "Grade 12 • Unit 4",
        "Introduction of environmental chemistry": "Grade 12 • Unit 5"
    },
    biology: {
        "Biology and technology": "Grade 11 • Unit 1",
        "Animals": "Grade 11 • Unit 2",
        "Enzymes": "Grade 11 • Unit 3",
        "Genetics": "Grade 11 • Unit 4",
        "The human body systems": "Grade 11 • Unit 5",
        "Population and natural resources": "Grade 11 • Unit 6",
        "Application of Biology": "Grade 12 • Unit 1",
        "Microorganisms": "Grade 12 • Unit 2",
        "Energy transformation": "Grade 12 • Unit 3",
        "Evolution": "Grade 12 • Unit 4",
        "Human body System": "Grade 12 • Unit 5",
        "Climate change": "Grade 12 • Unit 6",
        "Introduction of environmental chemistry_Bio": "Grade 12 • Unit 7"
    }
};

const UnitSelectionScreen: React.FC<UnitSelectionScreenProps> = ({ subjectKey, onSelectUnit, goBack }) => {
    // Standardize access
    const subjectData = subjects[subjectKey] || {};
    const units = Object.keys(subjectData);
    const subjectName = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);

    const getDescription = (unitKey: string) => {
        const subjectMapping = unitDescriptions[subjectKey];
        if (subjectMapping && subjectMapping[unitKey]) {
            return subjectMapping[unitKey];
        }
        return "General Topic";
    };

    return (
        <Container title={subjectName} goBack={goBack}>
            {units.length > 0 ? (
                units.map(unitKey => {
                    // Use case-insensitive matching for icons
                    const iconKey = unitKey.toLowerCase();
                    const description = getDescription(unitKey);
                    
                    return (
                        <Button 
                            key={unitKey} 
                            icon={unitIcons[iconKey] || '📚'}
                            onClick={() => onSelectUnit(unitKey)}
                            variant="list"
                        >
                            <div className="flex flex-col items-start text-left w-full">
                                <span className="text-xl capitalize font-bold text-slate-800 dark:text-white">
                                    {unitKey.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    {description}
                                </span>
                            </div>
                        </Button>
                    );
                })
            ) : (
                <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
                     <p className="text-slate-500 font-bold">No units found for {subjectName}.</p>
                </div>
            )}
        </Container>
    );
};

export default UnitSelectionScreen;