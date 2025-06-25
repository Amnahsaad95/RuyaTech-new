import { User, UserRole, Bio, ProfessionalInfo, Education, Certificate, WorkExperience, Portfolio, AcademicInfo, Course, CareerGoals, CompanyInfo, HiringNeeds, OpenPosition } from '@/types/user';

const mockUsers: User[] = [
  // Professionals (5 users)
  {
    id: 1,
    name: "Ahmed Khalid",
    email: "ahmed.khalid@example.com",
    phone: "+966501234567",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "professional",
    city: "Riyadh",
    country: "Saudi Arabia",
    status: "approved",
    isexpert: true,
    isjobseek: true,
    bio: {
      professional_info: {
        title: "Senior Software Engineer",
        years_experience: 8,
        skills: [
          { name: "JavaScript", experience: "6 years" },
          { name: "React", experience: "5 years" },
          { name: "Node.js", experience: "4 years" }
        ],
        languages: ["Arabic", "English"]
      },
      education: [
        {
          degree: "Bachelor of Computer Science",
          institution: "King Saud University",
          year: 2014
        }
      ],
      certifications: [
        {
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          year: "2020"
        }
      ],
      work_history: [
        {
          position: "Senior Frontend Developer",
          company: "STC Solutions",
          start_year: "2019",
          end_year: "2023",
          is_current: false,
          description: "Led frontend team for enterprise applications"
        }
      ],
      portfolio: [
        {
          title: "E-commerce Platform",
          description: "Built with React and Node.js",
          url: "https://github.com/ahmed/ecommerce"
        }
      ],
      summary: "Experienced full-stack developer with expertise in modern JavaScript frameworks."
    }
  },
  {
    id: 2,
    name: "Sarah Al-Farsi",
    email: "sarah.alfarsi@example.com",
    phone: "+966502345678",
    profile_image: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "professional",
    city: "Jeddah",
    country: "Saudi Arabia",
    status: "approved",
    isexpert: false,
    isjobseek: true,
    bio: {
      professional_info: {
        title: "UX/UI Designer",
        years_experience: 5,
        skills: [
          { name: "Figma", experience: "4 years" },
          { name: "Adobe XD", experience: "3 years" },
          { name: "User Research", experience: "3 years" }
        ],
        languages: ["Arabic", "English", "French"]
      },
      education: [
        {
          degree: "Bachelor of Design",
          institution: "Princess Nourah University",
          year: 2017
        }
      ],
      work_history: [
        {
          position: "UI Designer",
          company: "Mobily",
          start_year: "2019",
          is_current: true,
          description: "Designing user interfaces for mobile applications"
        }
      ],
      summary: "Creative designer passionate about creating intuitive user experiences."
    }
  },
  // Add 3 more professionals with similar structure...

  // Students (5 users)
  {
    id: 6,
    name: "Mohammed Hassan",
    email: "mohammed.hassan@example.com",
    phone: "+966503456789",
    profile_image: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "student",
    city: "Dammam",
    country: "Saudi Arabia",
    status: "approved",
    bio: {
      academic_info: {
        institution: "King Fahd University of Petroleum and Minerals",
        program: "Computer Engineering",
        degree_level: "Bachelor",
        year: "2024"
      },
      courses: [
        {
          code: "CS201",
          name: "Data Structures",
          semester: "Fall 2022",
          grade: "A",
          year: "2022"
        }
      ],
      skills_learning: ["Python", "Machine Learning", "Data Analysis"],
      interests: ["AI", "Robotics", "IoT"],
      career_goals: {
        short_term: "Complete internship at tech company",
        long_term: "Become AI researcher"
      },
      summary: "Computer engineering student passionate about AI and machine learning."
    }
  },
  {
    id: 7,
    name: "Layla Abdullah",
    email: "layla.abdullah@example.com",
    phone: "+966504567890",
    profile_image: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "student",
    city: "Medina",
    country: "Saudi Arabia",
    status: "pending",
    bio: {
      academic_info: {
        institution: "Taibah University",
        program: "Information Technology",
        degree_level: "Bachelor",
        year: "2025"
      },
      courses: [
        {
          name: "Web Development",
          year: "2023"
        }
      ],
      skills_learning: ["HTML/CSS", "JavaScript", "UI Design"],
      interests: ["Web Accessibility", "Frontend Development"],
      summary: "IT student focusing on frontend development and web accessibility."
    }
  },
  // Add 3 more students with similar structure...

  // Companies (5 users)
  {
    id: 11,
    name: "Saudi Tech Solutions",
    email: "info@sauditech.com",
    phone: "+96611234567",
    profile_image: "https://logo.clearbit.com/sauditech.com",
    role: "company",
    city: "Riyadh",
    country: "Saudi Arabia",
    status: "approved",
    bio: {
      company_info: {
        legal_name: "Saudi Tech Solutions LLC",
        founded_year: 2015,
        company_size: "201-500",
        industry: ["Software Development", "Cloud Computing"],
        website: "https://www.sauditech.com",
        headquarters: "Riyadh, Saudi Arabia"
      },
      services: [
        "Enterprise Software Development",
        "Cloud Migration",
        "AI Solutions"
      ],
      hiring_needs: {
        open_positions: [
          {
            title: "DevOps Engineer",
            department: "Engineering",
            location: "Riyadh"
          }
        ],
        hiring_process: ["Technical Screening", "Cultural Fit Interview", "Final Offer"]
      },
      summary: "Leading Saudi technology company providing innovative digital solutions."
    }
  },
  {
    id: 12,
    name: "Neom Tech Ventures",
    email: "careers@neomtech.com",
    phone: "+96611345678",
    profile_image: "https://logo.clearbit.com/neomtech.com",
    role: "company",
    city: "Neom",
    country: "Saudi Arabia",
    status: "approved",
    bio: {
      company_info: {
        legal_name: "Neom Tech Ventures",
        founded_year: 2020,
        company_size: "1001-5000",
        industry: ["Renewable Energy", "Smart Cities", "AI"],
        website: "https://www.neomtech.com",
        headquarters: "Neom, Saudi Arabia"
      },
      hiring_needs: {
        open_positions: [
          {
            title: "AI Research Scientist",
            department: "R&D",
            location: "Neom"
          },
          {
            title: "Sustainability Engineer",
            department: "Green Tech",
            location: "Neom"
          }
        ]
      },
      summary: "Pioneering the future of sustainable technology in Neom."
    }
  }
  // Add 3 more companies with similar structure...
];

export default mockUsers;