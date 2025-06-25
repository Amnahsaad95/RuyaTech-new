import { User } from '@/types/user';
import { AcademicCapIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {

  console.log(user);
  const getRoleIcon = () => {
    
    switch (user.role) {
      case 'professional':{
        if(user.isexpert)
            return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                   </svg>;

        return <BriefcaseIcon className="h-5 w-5 text-blue-600" />;
    }
      case 'student':
        return <AcademicCapIcon className="h-5 w-5 text-pink-600" />;
      case 'company':
        return <BuildingOfficeIcon className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
    
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'professional':
        return 'text-blue-600';
      case 'student':
        return 'text-pink-600';
      case 'company':
        return 'text-amber-500';
      default:
        return '';
    }
  };

  return (
    <div className="user-card bg-white rounded-xl shadow-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img 
            src={`http://127.0.0.1:8000/storage/${user.profile_image}` || '/default-avatar.png'} 
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
            {getRoleIcon()}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
          <p className={`${getRoleColor()} font-medium`}>
            {user.role === 'professional' && user.bio?.professional_info?.title}
            {user.role === 'student' && `${user.bio?.academic_info?.degree_level} Student`}
            {user.role === 'company' && user.bio?.company_info?.legal_name}
          </p>
          <p className="text-gray-500 text-sm">
            {user.role === 'professional' && `${user.bio?.professional_info?.years_experience}+ years experience`}
            {user.role === 'student' &&
                  `${user.bio?.academic_info?.institution || ''} '${
                    typeof user.bio?.academic_info?.year === 'string'
                      ? user.bio.academic_info.year.slice(-2)
                      : ''
                  }`}
            {user.role === 'company' && `${user.bio?.company_info?.company_size} employees`}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 line-clamp-2">{user.bio?.summary}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {user.role === 'professional' && user.bio?.professional_info?.skills?.slice(0, 3).map((skill, index) => (
          <span 
            key={index} 
            className="skill-pill bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm transition-all hover:bg-blue-200"
          >
            {skill.name}
          </span>
        ))}
        {user.role === 'student' && user.bio?.skills_learning?.map((skill, index) => (
          <span 
            key={index} 
            className="skill-pill bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm transition-all hover:bg-pink-200"
          >
            {skill}
          </span>
        ))}
        {user.role === 'company' && user.bio?.company_info?.industry.map((skill, index) => (
          <span 
            key={index} 
            className="skill-pill bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm transition-all hover:bg-amber-200"
          >
            {skill}
          </span>
        ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
        {user.role === 'company' && user.bio?.services?.map((service, index) => (
          <span 
            key={index} 
            className="skill-pill bg-green-100 text-amber-800 px-3 py-1 rounded-full text-sm transition-all hover:bg-amber-200"
          >
            {service}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          <svg className="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {user.city}, {user.country}
        </span>
        {user.role === 'professional' && user.isjobseek?(
          <span className="flex items-center">
            <svg className="h-4 w-4 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 00-5 5c0 3.866 5 9 5 9s5-5.134 5-9a5 5 0 00-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                <path d="M11 14.7l-4.29 2.48.82-4.77-3.47-3.38 4.8-.7L12 4.5l2.14 4.83 4.8.7-3.47 3.38.82 4.77L13 14.7V20l-1-.6-1 .6v-5.3z" />
            </svg>
            Hiring Now
          </span>
          
        ):null}
        {user.role === 'student' && user.isjobseek?(
          <span className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v-2m0 0V8m0 2h8m-8 0H4m4-4h8a2 2 0 012 2v2H6V8a2 2 0 012-2zm12 4v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8" />
                </svg>
                Hiring Now
        </span>
        ):null}
        {user.role === 'company' && (
          <span className="flex items-center">
            <svg className="h-4 w-4 text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {user.bio?.hiring_needs?.open_positions?.length} open positions
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Profile</button>
        <button className="text-green-600 hover:text-green-800 font-medium text-sm">
          {user.role === 'professional' && 'Connect'}
          {user.role === 'student' && 'Message'}
          {user.role === 'company' && 'Explore Jobs'}
        </button>
      </div>
    </div>
  );
}
