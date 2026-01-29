import { Pill, FlaskConical, ScrollText, Palette, Microscope, Award, BookOpen, User } from 'lucide-react';

export const personalData = {
    name: "Kanchan", // Inferred from email
    role: "B. Pharm Student",
    contact: {
        location: "Bhopal, Madhya Pradesh",
        phone: "+91 8770399538",
        email: "Kanchanpharma21@gmail.com",
        linkedin: "https://www.linkedin.com/in/kanchan-patel-ab005a392/",
    },
    summary: "Dedicated and detail-oriented B. Pharm (4th Year) student at Ravishankar College of Pharmacy. Gained hands-on industrial training in capsule manufacturing and quality standards. Eager to leverage academic knowledge and technical skills in a professional pharmaceutical environment.",
    education: [
        {
            degree: "Bachelor of Pharmacy (B. Pharm)",
            institution: "Ravishankar College of Pharmacy, Bhopal",
            year: "Expected 2026",
            score: null
        },
        {
            degree: "Higher Secondary School (Class XII)",
            institution: "Higher Secondary School, Sakhi",
            year: "2022",
            score: "77%"
        },
        {
            degree: "High School Certificate (Class X)",
            institution: "Higher Secondary School, Sakhi",
            year: "2020",
            score: "76%"
        }
    ],
    experience: [
        {
            role: "Vocational Trainee",
            company: "National Capsules Private Limited",
            duration: "July 22, 2025 – August 20, 2025",
            points: [
                "Completed intensive industrial training focused on the manufacturing of Empty Hard Gelatine & HPMC Capsules.",
                "Observed large-scale production workflows and adhered to industrial safety and hygiene protocols.",
                "Studied the quality control processes involved in capsule shell production.",
                "Gained practical insights into pharmaceutical business operations for academic project requirements."
            ]
        }
    ],
    skills: {
        technical: [
            { name: "Pharmacology", icon: Pill },
            { name: "Pharmaceutics", icon: FlaskConical },
            { name: "Pharmaceutical Analysis", icon: Microscope },
            { name: "Lab Techniques (Titration, Pipetting)", icon: FlaskConical },
            { name: "Solution Preparation", icon: FlaskConical },
            { name: "Microscope/Spectrometer", icon: Microscope },
        ],
        software: [
            { name: "Microsoft Word", icon: BookOpen },
            { name: "Microsoft Excel", icon: BookOpen },
        ],
        soft: [
            "Strong Work Ethic", "Discipline", "Adaptability", "Team Collaboration"
        ]
    },
    interests: [
        { name: "Painting", description: "Demonstrates patience and attention to detail", icon: Palette }
    ]
};
