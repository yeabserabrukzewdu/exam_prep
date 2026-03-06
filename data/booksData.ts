import { BookSubject } from '../types';

export const books: Record<string, BookSubject> = {
    math: {
        name: "Mathematics",
        icon: "➕",
        description: "Comprehensive guides for Algebra, Calculus, and Geometry.",
        grades: {
            11: {
                pdfUrl: "/math_g11.pdf",
                chapters: [
                    { 
                        title: "Unit 1: Relations and Functions", 
                        content: "## Relations and Functions\n\nA **relation** is a set of ordered pairs $(x, y)$. The domain is the set of first coordinates, and the range is the set of second coordinates.\n\nA **function** is a specific type of relation where every input $x$ has exactly one output $y$."
                    }
                ]
            },
            12: {
                pdfUrl: "/math_g12.pdf",
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
                pdfUrl: "/physics_g11.pdf",
                chapters: [
                    { title: "Unit 1: Vectors", content: "## Vectors\n\nPhysical quantities are classified as scalars (magnitude only) or vectors (magnitude and direction)." }
                ]
            },
            12: {
                pdfUrl: "/physics_g12.pdf",
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
                pdfUrl: "/history_g11.pdf",
                chapters: [
                    { title: "Unit 1: History, Historiography, and Human Evolution", content: "## Historiography\n\nHistoriography refers to the way history has been written, the methodologies, and the perspectives used." }
                ]
            },
            12: {
                pdfUrl: "/history_g12.pdf",
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
                pdfUrl: "/geography_g11.pdf",
                chapters: [
                    { title: "Unit 1: Formation of the Continents", content: "## Pangaea\n\nPangaea was a supercontinent that existed during the late Paleozoic and early Mesozoic eras." }
                ]
            },
            12: {
                pdfUrl: "/geography_g12.pdf",
                chapters: [
                    { title: "Unit 1: Major Geological Processes", content: "## Plate Tectonics\n\nPlate tectonics is a scientific theory describing the large-scale motion of seven large plates and several smaller plates of Earth's lithosphere." }
                ]
            }
        }
    }
};