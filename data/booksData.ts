import { BookSubject } from '../types';
import { biologyData } from './biologyData';
import { chemistryData } from './chemistryData';
import { economicsData } from './economicsData';
import { englishData } from './englishData';

export const books: Record<string, BookSubject> = {
    math: {
        name: "Mathematics",
        icon: "➕",
        description: "Comprehensive guides for Algebra, Calculus, and Geometry.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Math.pdf",
                chapters: [
                    { 
                        title: "Unit 1: Relations and Functions", 
                        content: "## Relations and Functions\n\nA **relation** is a set of ordered pairs $(x, y)$. The domain is the set of first coordinates, and the range is the set of second coordinates.\n\nA **function** is a specific type of relation where every input $x$ has exactly one output $y$."
                    }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Math.pdf",
                chapters: [
                    { 
                        title: "Unit 1: Sequences and Series", 
                        content: "## Sequences and Series\n\n### Arithmetic Sequence\nA sequence where the difference between consecutive terms is constant ($d$)."
                    }
                ]
            }
        }
    },
    physics: {
        name: "Physics",
        icon: "⚡️",
        description: "Study mechanics, thermodynamics, and electromagnetism.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Physics.pdf",
                chapters: [
                    { title: "Unit 1: Vectors", content: "## Vectors\n\nPhysical quantities are classified as scalars (magnitude only) or vectors (magnitude and direction)." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Physics.pdf",
                chapters: [
                    { title: "Unit 1: Thermodynamics", content: "## Thermodynamics\n\n### First Law\nEnergy cannot be created or destroyed. $\\Delta U = Q - W$" }
                ]
            }
        }
    },
    history: {
        name: "History",
        icon: "🗿",
        description: "World and Ethiopian history.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 History.pdf",
                chapters: [
                    { title: "Unit 1: History, Historiography, and Human Evolution", content: "## Historiography\n\nHistoriography refers to the way history has been written, the methodologies, and the perspectives used." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 History.pdf",
                chapters: [
                    { title: "Unit 1: Capitalism and Nationalism", content: "## Capitalism\n\nCapitalism is an economic system based on private ownership of the means of production." }
                ]
            }
        }
    },
    geography: {
        name: "Geography",
        icon: "🌍",
        description: "Physical and human geography.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Geography.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Geography.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
    biology: {
        name: "Biology",
        icon: "🧬",
        description: "Study of living organisms.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Biology.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Biology.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
    chemistry: {
        name: "Chemistry",
        icon: "🧪",
        description: "Study of matter and its interactions.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Chemistry.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Chemistry.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
    economics: {
        name: "Economics",
        icon: "💰",
        description: "Study of production, distribution, and consumption of goods and services.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Economics.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Economics.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
    english: {
        name: "English",
        icon: "📖",
        description: "Study of literature and language.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 English.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 English.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
     information_technology: {
        name: "Information Technology",
        icon: "ℹ️",
        description: "Study of computer systems and applications.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Information Technology.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Information Technology.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
         amharic: {
        name: "Amharic",
        icon: "አማ",
        description: "Study of the Amharic language.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Amharic.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "./Grade 12 Amharic.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
             agriculture: {
        name: "Agriculture",
        icon: "🌾",
        description: "Study of farming and crop production.",
        grades: {
            11: {
                pdfUrl: "./Grade 11 Agriculture.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    },
};