import React from 'react';
import { useTranslation } from 'next-i18next';
import { User } from '@/types/user';

interface EditStudentInfoProps {
  user: User;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const EditStudentInfo: React.FC<EditStudentInfoProps> = ({ 
  user, 
  onChange,
  errors
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const [skillsLearning, setSkillsLearning] = React.useState<string[]>(
    user.bio?.skills_learning || []
  );
  const [newSkill, setNewSkill] = React.useState('');
  
  // Update parent component when skills change
  React.useEffect(() => {
    if (user.bio && user.role === 'student') {
      const newBio = { 
        ...user.bio, 
        skills_learning: skillsLearning
      };
      onChange('bio', JSON.stringify(newBio));
    }
  }, [skillsLearning]);
  
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkillsLearning([...skillsLearning, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skillsLearning];
    newSkills.splice(index, 1);
    setSkillsLearning(newSkills);
  };
  
  const handleAcademicInfoChange = (field: string, value: any) => {
    if (user.bio && user.role === 'student') {
      const newBio = { 
        ...user.bio, 
        academic_info: {
          ...user.bio.academic_info,
          [field]: value
        }
      };
      onChange('bio', JSON.stringify(newBio));
    }
  };
  
  if (user.role !== 'student') {
    return null;
  }
  
  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900">
        {t('profile:sections.academicInfo')}
      </h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.institution')}
          </label>
          <input
            type="text"
            id="institution"
            value={user.bio?.academic_info?.institution || ''}
            onChange={(e) => handleAcademicInfoChange('institution', e.target.value)}
            placeholder={t('profile:placeholders.institution')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="program" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.program')}
          </label>
          <input
            type="text"
            id="program"
            value={user.bio?.academic_info?.program || ''}
            onChange={(e) => handleAcademicInfoChange('program', e.target.value)}
            placeholder={t('profile:placeholders.program')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="degreeLevel" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.degreeLevel')}
          </label>
          <select
            id="degreeLevel"
            value={user.bio?.academic_info?.degree_level || ''}
            onChange={(e) => handleAcademicInfoChange('degree_level', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select degree level</option>
            <option value="High School">High School</option>
            <option value="Associate's">Associate's</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="Doctoral">Doctoral</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.year')}
          </label>
          <select
            id="year"
            value={user.bio?.academic_info?.year || ''}
            onChange={(e) => handleAcademicInfoChange('year', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select year</option>
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>
      </div>
      
      {/* Skills Learning section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile:sections.skills')} {t('common:learning')}
        </label>
        
        <div className="mb-4">
          {skillsLearning.map((skill, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2">
              <div>
                <span className="font-medium">{skill}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label htmlFor="newSkill" className="block text-sm font-medium text-gray-700">
              {t('common:skill')}
            </label>
            <input
              type="text"
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common:add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentInfo;
