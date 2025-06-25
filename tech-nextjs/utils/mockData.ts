import { User } from '@/types/index';

export const mockUsers: User[] = [
  // Professional Users
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'professional',
    city: 'San Francisco',
    country: 'United States',
    mainField: 'Software Engineering',
    summary: 'Senior Full-Stack Developer with 8+ years of experience in building scalable web applications. Passionate about clean code and mentoring junior developers.',
    socialProfile: 'https://linkedin.com/in/sarahjohnson',
    isAvailableForWork: true,
    isOpenToFreelance: false,
    joinedDate: '2023-01-15',
    professionalInfo: {
      title: 'Senior Software Engineer',
      yearsExperience: 8,
      skills: [
        { name: 'JavaScript', level: 'expert' },
        { name: 'React', level: 'expert' },
        { name: 'Node.js', level: 'advanced' },
        { name: 'Python', level: 'intermediate' },
        { name: 'AWS', level: 'advanced' }
      ],
      education: [
        {
          degree: 'Master of Computer Science',
          institution: 'Stanford University',
          year: 2018,
          field: 'Computer Science'
        },
        {
          degree: 'Bachelor of Engineering',
          institution: 'UC Berkeley',
          year: 2015,
          field: 'Computer Science'
        }
      ],
      workHistory: [
        {
          company: 'Google',
          position: 'Senior Software Engineer',
          startDate: '2020-03',
          endDate: '2023-12',
          current: false,
          description: 'Led development of cloud infrastructure services'
        },
        {
          company: 'Meta',
          position: 'Software Engineer',
          startDate: '2018-06',
          endDate: '2020-02',
          current: false,
          description: 'Developed React components for main platform'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          year: 2022,
          expires: 2025
        }
      ],
      isExpert: true,
      isJobSeeking: true,
      portfolio: ['https://github.com/sarahjohnson', 'https://sarahjohnson.dev']
    }
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'professional',
    city: 'Dubai',
    country: 'UAE',
    mainField: 'Data Science',
    summary: 'Data Scientist specializing in machine learning and AI solutions. Experience in healthcare and fintech industries.',
    socialProfile: 'https://linkedin.com/in/ahmedhassan',
    isAvailableForWork: false,
    isOpenToFreelance: true,
    joinedDate: '2023-02-20',
    professionalInfo: {
      title: 'Senior Data Scientist',
      yearsExperience: 6,
      skills: [
        { name: 'Python', level: 'expert' },
        { name: 'Machine Learning', level: 'expert' },
        { name: 'TensorFlow', level: 'advanced' },
        { name: 'SQL', level: 'advanced' },
        { name: 'R', level: 'intermediate' }
      ],
      education: [
        {
          degree: 'PhD in Data Science',
          institution: 'MIT',
          year: 2019,
          field: 'Data Science'
        }
      ],
      workHistory: [
        {
          company: 'Microsoft',
          position: 'Senior Data Scientist',
          startDate: '2019-08',
          current: true,
          description: 'Leading AI research projects'
        }
      ],
      certifications: [
        {
          name: 'Google Cloud Professional Data Engineer',
          issuer: 'Google Cloud',
          year: 2021,
          expires: 2024
        }
      ],
      isExpert: true,
      isJobSeeking: false,
      portfolio: ['https://github.com/ahmedhassan']
    }
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'professional',
    city: 'Barcelona',
    country: 'Spain',
    mainField: 'UX Design',
    summary: 'Creative UX/UI Designer with a passion for user-centered design. Experienced in designing mobile and web applications.',
    socialProfile: 'https://linkedin.com/in/mariarodriguez',
    isAvailableForWork: true,
    isOpenToFreelance: true,
    joinedDate: '2023-03-10',
    professionalInfo: {
      title: 'Senior UX Designer',
      yearsExperience: 5,
      skills: [
        { name: 'Figma', level: 'expert' },
        { name: 'Adobe Creative Suite', level: 'expert' },
        { name: 'User Research', level: 'advanced' },
        { name: 'Prototyping', level: 'advanced' },
        { name: 'HTML/CSS', level: 'intermediate' }
      ],
      education: [
        {
          degree: 'Master of Design',
          institution: 'ELISAVA',
          year: 2020,
          field: 'Interaction Design'
        }
      ],
      workHistory: [
        {
          company: 'Spotify',
          position: 'Senior UX Designer',
          startDate: '2021-01',
          current: true,
          description: 'Designing user experiences for mobile app'
        }
      ],
      certifications: [],
      isExpert: false,
      isJobSeeking: true,
      portfolio: ['https://mariarodriguez.design', 'https://dribbble.com/mariarodriguez']
    }
  },

  // Student Users
  {
    id: 4,
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    city: 'Boston',
    country: 'United States',
    mainField: 'Computer Science',
    summary: 'Computer Science student passionate about artificial intelligence and machine learning. Looking for internship opportunities.',
    socialProfile: 'https://linkedin.com/in/alexchen',
    isAvailableForWork: true,
    isOpenToFreelance: false,
    joinedDate: '2023-04-05',
    studentInfo: {
      institution: 'MIT',
      program: 'Computer Science',
      degreeLevel: 'undergraduate',
      year: 'junior',
      graduationYear: 2025,
      fieldOfStudy: 'Computer Science',
      courses: ['CS 6.034 Artificial Intelligence', 'CS 6.006 Introduction to Algorithms', 'CS 6.031 Software Construction'],
      skillsLearning: ['Python', 'Machine Learning', 'Deep Learning', 'React', 'Node.js'],
      interests: ['Artificial Intelligence', 'Robotics', 'Computer Vision'],
      careerGoals: {
        shortTerm: 'Summer internship at a tech company',
        longTerm: 'AI Research Scientist at a leading tech company'
      }
    }
  },
  {
    id: 5,
    name: 'Emma Thompson',
    email: 'emma.thompson@university.edu',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    city: 'London',
    country: 'United Kingdom',
    mainField: 'Business Administration',
    summary: 'MBA student with focus on digital marketing and entrepreneurship. Previous experience in consulting.',
    socialProfile: 'https://linkedin.com/in/emmathompson',
    isAvailableForWork: true,
    isOpenToFreelance: true,
    joinedDate: '2023-05-12',
    studentInfo: {
      institution: 'London Business School',
      program: 'Master of Business Administration',
      degreeLevel: 'master',
      year: 'graduate',
      graduationYear: 2024,
      fieldOfStudy: 'Business Administration',
      courses: ['Digital Marketing Strategy', 'Entrepreneurship', 'Data Analytics for Business'],
      skillsLearning: ['Digital Marketing', 'Data Analysis', 'Project Management', 'Strategy'],
      interests: ['Startups', 'Digital Transformation', 'Sustainability'],
      careerGoals: {
        shortTerm: 'Product Manager role at a tech startup',
        longTerm: 'Start my own sustainable tech company'
      }
    }
  },
  {
    id: 6,
    name: 'Raj Patel',
    email: 'raj.patel@university.edu',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    city: 'Mumbai',
    country: 'India',
    mainField: 'Engineering',
    summary: 'Mechanical Engineering student with interest in renewable energy and sustainable technology.',
    socialProfile: 'https://linkedin.com/in/rajpatel',
    isAvailableForWork: true,
    isOpenToFreelance: false,
    joinedDate: '2023-06-18',
    studentInfo: {
      institution: 'IIT Bombay',
      program: 'Mechanical Engineering',
      degreeLevel: 'undergraduate',
      year: 'senior',
      graduationYear: 2024,
      fieldOfStudy: 'Mechanical Engineering',
      courses: ['Renewable Energy Systems', 'Thermodynamics', 'Fluid Mechanics'],
      skillsLearning: ['CAD Design', 'MATLAB', 'Python', 'Project Management'],
      interests: ['Renewable Energy', 'Sustainability', 'Innovation'],
      careerGoals: {
        shortTerm: 'Graduate program in renewable energy',
        longTerm: 'Lead sustainable technology projects'
      }
    }
  },

  // Company Users
  {
    id: 7,
    name: 'TechStart Inc.',
    email: 'hr@techstart.com',
    profileImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
    role: 'company',
    city: 'Austin',
    country: 'United States',
    mainField: 'Technology',
    summary: 'Fast-growing startup developing AI-powered solutions for healthcare. We are looking for talented engineers and data scientists.',
    socialProfile: 'https://linkedin.com/company/techstart',
    isAvailableForWork: false,
    isOpenToFreelance: false,
    joinedDate: '2023-01-30',
    companyInfo: {
      legalName: 'TechStart Inc.',
      foundedYear: 2021,
      companySize: '11-50',
      industry: ['Technology', 'Healthcare', 'Artificial Intelligence'],
      website: 'https://techstart.com',
      headquarters: 'Austin, TX',
      services: ['AI Development', 'Healthcare Solutions', 'Data Analytics'],
      fundingStage: 'series-a',
      hiringNeeds: {
        isHiring: true,
        openPositions: [
          {
            title: 'Senior Software Engineer',
            department: 'Engineering',
            location: 'Austin, TX / Remote',
            type: 'tech'
          },
          {
            title: 'Data Scientist',
            department: 'Data Science',
            location: 'Austin, TX',
            type: 'tech'
          },
          {
            title: 'Product Manager',
            department: 'Product',
            location: 'Austin, TX',
            type: 'non-tech'
          }
        ]
      }
    }
  },
  {
    id: 8,
    name: 'Global Consulting Group',
    email: 'careers@globalconsulting.com',
    profileImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop',
    role: 'company',
    city: 'New York',
    country: 'United States',
    mainField: 'Consulting',
    summary: 'Leading management consulting firm helping Fortune 500 companies with digital transformation and strategy.',
    socialProfile: 'https://linkedin.com/company/globalconsulting',
    isAvailableForWork: false,
    isOpenToFreelance: false,
    joinedDate: '2023-02-14',
    companyInfo: {
      legalName: 'Global Consulting Group LLC',
      foundedYear: 1995,
      companySize: '201-500',
      industry: ['Consulting', 'Strategy', 'Digital Transformation'],
      website: 'https://globalconsulting.com',
      headquarters: 'New York, NY',
      services: ['Management Consulting', 'Digital Strategy', 'Change Management'],
      fundingStage: 'bootstrapped',
      hiringNeeds: {
        isHiring: true,
        openPositions: [
          {
            title: 'Senior Consultant',
            department: 'Consulting',
            location: 'New York, NY',
            type: 'non-tech'
          },
          {
            title: 'Business Analyst',
            department: 'Analytics',
            location: 'Multiple Locations',
            type: 'non-tech'
          }
        ]
      }
    }
  },
  {
    id: 9,
    name: 'EcoTech Solutions',
    email: 'jobs@ecotech.com',
    profileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
    role: 'company',
    city: 'Copenhagen',
    country: 'Denmark',
    mainField: 'Clean Technology',
    summary: 'Sustainable technology company focused on renewable energy solutions and environmental monitoring systems.',
    socialProfile: 'https://linkedin.com/company/ecotech',
    isAvailableForWork: false,
    isOpenToFreelance: true,
    joinedDate: '2023-03-22',
    companyInfo: {
      legalName: 'EcoTech Solutions ApS',
      foundedYear: 2018,
      companySize: '51-200',
      industry: ['Clean Technology', 'Renewable Energy', 'Environmental'],
      website: 'https://ecotech.com',
      headquarters: 'Copenhagen, Denmark',
      services: ['Renewable Energy Systems', 'Environmental Monitoring', 'Sustainability Consulting'],
      fundingStage: 'series-b',
      hiringNeeds: {
        isHiring: true,
        openPositions: [
          {
            title: 'Environmental Engineer',
            department: 'Engineering',
            location: 'Copenhagen',
            type: 'tech'
          },
          {
            title: 'Sustainability Consultant',
            department: 'Consulting',
            location: 'Remote',
            type: 'non-tech'
          }
        ]
      }
    }
  },

  // Additional users for better filtering demonstration
  {
    id: 10,
    name: 'David Kim',
    email: 'david.kim@email.com',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'professional',
    city: 'Seoul',
    country: 'South Korea',
    mainField: 'Mobile Development',
    summary: 'Mobile app developer specializing in iOS and Android applications. 4 years of experience in fintech.',
    socialProfile: 'https://linkedin.com/in/davidkim',
    isAvailableForWork: false,
    isOpenToFreelance: true,
    joinedDate: '2023-07-08',
    professionalInfo: {
      title: 'Mobile Developer',
      yearsExperience: 4,
      skills: [
        { name: 'Swift', level: 'advanced' },
        { name: 'Kotlin', level: 'advanced' },
        { name: 'React Native', level: 'intermediate' },
        { name: 'Flutter', level: 'beginner' }
      ],
      education: [
        {
          degree: 'Bachelor of Computer Science',
          institution: 'KAIST',
          year: 2020,
          field: 'Computer Science'
        }
      ],
      workHistory: [
        {
          company: 'Samsung',
          position: 'Mobile Developer',
          startDate: '2020-03',
          current: true,
          description: 'Developing mobile banking applications'
        }
      ],
      certifications: [],
      isExpert: false,
      isJobSeeking: false,
      portfolio: ['https://github.com/davidkim']
    }
  },
  {
    id: 11,
    name: 'Lisa Wang',
    email: 'lisa.wang@university.edu',
    profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    role: 'student',
    city: 'Toronto',
    country: 'Canada',
    mainField: 'Data Science',
    summary: 'Data Science PhD candidate researching natural language processing and computational linguistics.',
    socialProfile: 'https://linkedin.com/in/lisawang',
    isAvailableForWork: true,
    isOpenToFreelance: false,
    joinedDate: '2023-08-15',
    studentInfo: {
      institution: 'University of Toronto',
      program: 'Data Science',
      degreeLevel: 'phd',
      year: 'graduate',
      graduationYear: 2026,
      fieldOfStudy: 'Data Science',
      courses: ['Natural Language Processing', 'Deep Learning', 'Statistical Methods'],
      skillsLearning: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Research Methods'],
      interests: ['Natural Language Processing', 'AI Ethics', 'Computational Linguistics'],
      careerGoals: {
        shortTerm: 'Complete PhD research on NLP',
        longTerm: 'Research Scientist at AI research lab'
      }
    }
  },
  {
    id: 12,
    name: 'FinanceFlow Corp',
    email: 'talent@financeflow.com',
    profileImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop',
    role: 'company',
    city: 'London',
    country: 'United Kingdom',
    mainField: 'Financial Technology',
    summary: 'Fintech startup revolutionizing personal finance management through AI-powered insights and automation.',
    socialProfile: 'https://linkedin.com/company/financeflow',
    isAvailableForWork: false,
    isOpenToFreelance: false,
    joinedDate: '2023-09-01',
    companyInfo: {
      legalName: 'FinanceFlow Corp Ltd',
      foundedYear: 2022,
      companySize: '1-10',
      industry: ['Financial Technology', 'Artificial Intelligence', 'Personal Finance'],
      website: 'https://financeflow.com',
      headquarters: 'London, UK',
      services: ['Personal Finance Management', 'AI Financial Insights', 'Automated Investing'],
      fundingStage: 'seed',
      hiringNeeds: {
        isHiring: true,
        openPositions: [
          {
            title: 'Full-Stack Developer',
            department: 'Engineering',
            location: 'London / Remote',
            type: 'tech'
          },
          {
            title: 'Marketing Manager',
            department: 'Marketing',
            location: 'London',
            type: 'non-tech'
          }
        ]
      }
    }
  }
];

// Helper functions for filtering
export const getUniqueSkills = (): string[] => {
  const skills = new Set<string>();
  
  mockUsers.forEach(user => {
    if (user.professionalInfo?.skills) {
      user.professionalInfo.skills.forEach(skill => skills.add(skill.name));
    }
    if (user.studentInfo?.skillsLearning) {
      user.studentInfo.skillsLearning.forEach(skill => skills.add(skill));
    }
  });
  
  return Array.from(skills).sort();
};

export const getUniqueCountries = (): string[] => {
  const countries = new Set<string>();
  mockUsers.forEach(user => {
    if (user.country) countries.add(user.country);
  });
  return Array.from(countries).sort();
};

export const getUniqueCities = (): string[] => {
  const cities = new Set<string>();
  mockUsers.forEach(user => {
    if (user.city) cities.add(user.city);
  });
  return Array.from(cities).sort();
};

export const getUniqueIndustries = (): string[] => {
  const industries = new Set<string>();
  mockUsers.forEach(user => {
    if (user.mainField) industries.add(user.mainField);
    if (user.companyInfo?.industry) {
      user.companyInfo.industry.forEach(industry => industries.add(industry));
    }
  });
  return Array.from(industries).sort();
};

export const getUniqueFieldsOfStudy = (): string[] => {
  const fields = new Set<string>();
  mockUsers.forEach(user => {
    if (user.studentInfo?.fieldOfStudy) fields.add(user.studentInfo.fieldOfStudy);
    if (user.professionalInfo?.education) {
      user.professionalInfo.education.forEach(edu => {
        if (edu.field) fields.add(edu.field);
      });
    }
  });
  return Array.from(fields).sort();
};

