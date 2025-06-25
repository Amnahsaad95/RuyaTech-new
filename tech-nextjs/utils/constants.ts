import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    profile_image: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'professional',
    city: 'San Francisco',
    country: 'USA',
    
    isexpert: true,
    created_at: '2023-01-15',
    updated_at: '2023-06-20',
    bio: {
      professional_info: {
        title: 'Senior UX Designer',
        years_experience: 5,
        skills: [
          { name: 'UI/UX Design', experience: '5 years' },
          { name: 'Figma', experience: '4 years' },
          { name: 'User Research', experience: '5 years' }
        ]
      },
      summary: 'Passionate about creating intuitive user experiences with a focus on accessibility and inclusive design.'
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    profile_image: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'student',
    city: 'Boston',
    country: 'USA',
    created_at: '2023-02-10',
    updated_at: '2023-06-18',
    bio: {
      academic_info: {
        institution: 'MIT',
        program: 'Computer Science',
        degree_level: 'Bachelor',
        year: '2024'
      },
      summary: 'Aspiring software engineer with focus on machine learning and AI applications.'
    }
  },
  // Add more mock users...
];

export const skillsList = [
  'JavaScript', 'React', 'Node.js', 'Python', 'UI/UX',
  'TypeScript', 'AWS', 'Machine Learning', 'Data Science',
  'Product Management', 'GraphQL', 'Docker', 'Kubernetes'
];

export const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education',
  'Manufacturing', 'Retail', 'Consulting', 'Marketing'
];

export const companySizes = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
];
