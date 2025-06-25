// app/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import UserCard from '@/components/members/UserCard';
import UserFilters from '@/components/members/UserFilters';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    role: '' as UserRole | '',
    search: '',
    sort: 'name-asc',
    skills: '',
    experience: '',
    education: '',
    industry: '',
    location: '',
  });

  const itemsPerPage = 9;

  const sortUsers = (users: User[], sortOption: string) => {
  const [field, direction] = sortOption.split('-');
  
  return [...users].sort((a, b) => {
    // Default sorting by name
    if (field === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return direction === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    }
    
    // Professional-specific sorting
    if (field === 'experience' && a.role === 'professional' && b.role === 'professional') {
      const expA = a.bio?.professional_info?.years_experience || 0;
      const expB = b.bio?.professional_info?.years_experience || 0;
      return direction === 'asc' ? expA - expB : expB - expA;
    }
    
    // Education sorting for professionals and students
    if (field === 'education') {
      // Implement your education level comparison logic here
      // This is a simplified example
      return direction === 'asc' ? 1 : -1;
    }
    
    // Company-specific sorting
    if (field === 'founded' && a.role === 'company' && b.role === 'company') {
      const yearA = a.bio?.company_info?.founded_year || 0;
      const yearB = b.bio?.company_info?.founded_year || 0;
      return direction === 'asc' ? yearA - yearB : yearB - yearA;
    }
    
    // Recent sorting (by created_at)
    if (field === 'recent') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });
};


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('http://127.0.0.1:8000/api/all-members');
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(Math.ceil(data.users.length / itemsPerPage));
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...users];
    
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.bio?.professional_info?.title?.toLowerCase().includes(searchTerm)) ||
        (user.bio?.company_info?.legal_name?.toLowerCase().includes(searchTerm))
      );
    }
    
    result = sortUsers(result, filters.sort);
    
    if (filters.skills && filters.role === 'professional') {
      result = result.filter(user => 
        user.bio?.professional_info?.skills?.some(skill => 
          skill.name.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }
    
    if (filters.experience && filters.role === 'professional') {
      const exp = parseInt(filters.experience);
      result = result.filter(user => 
        user.bio?.professional_info?.years_experience &&
        user.bio.professional_info.years_experience >= exp
      );
    }
    
    if (filters.education && (filters.role === 'professional' || filters.role === 'student')) {
      result = result.filter(user => 
        user.bio?.education?.some(edu => 
          edu.degree.toLowerCase().includes(filters.education.toLowerCase()) ||
          edu.institution.toLowerCase().includes(filters.education.toLowerCase())
        ) ||
        user.bio?.academic_info?.degree_level?.toLowerCase().includes(filters.education.toLowerCase())
      );
    }
    
    if (filters.industry && filters.role === 'company') {
      result = result.filter(user => 
        user.bio?.company_info?.industry?.some(ind => 
          ind.toLowerCase().includes(filters.industry.toLowerCase())
        )
      );
    }
    
    if (filters.location) {
      result = result.filter(user => 
        (user.city?.toLowerCase().includes(filters.location.toLowerCase())) ||
        (user.country?.toLowerCase().includes(filters.location.toLowerCase()))
      );
    }
    
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
    setFilteredUsers(result);
  }, [users, filters]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Discover Professionals, Students & Companies</h1>
      
      <UserFilters filters={filters} setFilters={setFilters} />
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600">No users found matching your criteria</h2>
          <button 
            onClick={() => setFilters({
              role: '',
              search: '',
              sort: 'name-asc',
              skills: '',
              experience: '',
              education: '',
              industry: '',
              location: '',
            })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;