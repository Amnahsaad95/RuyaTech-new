import React from 'react';
import { useTranslation } from 'next-i18next';
import { User, Skill } from '@/types/user';

interface EditProfessionalInfoProps {
  user: User;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const EditProfessionalInfo: React.FC<EditProfessionalInfoProps> = ({ 
  user, 
  onChange,
  errors
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const [skills, setSkills] = React.useState<Skill[]>(
    user.bio?.professional_info?.skills || []
  );
  const [newSkill, setNewSkill] = React.useState({ name: '', experience: 'Beginner' });
  
  // Update parent component when skills change
  React.useEffect(() => {
    if (user.bio && user.role === 'professional') {
      const newBio = { 
        ...user.bio, 
        professional_info: {
          ...user.bio.professional_info,
          skills
        }
      };
      onChange('bio', JSON.stringify(newBio));
    }
  }, [skills]);
  
  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill }]);
      setNewSkill({ name: '', experience: 'Beginner' });
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };
  
  const handleProfessionalInfoChange = (field: string, value: any) => {
    if (user.bio && user.role === 'professional') {
      const newBio = { 
        ...user.bio, 
        professional_info: {
          ...user.bio.professional_info,
          [field]: value
        }
      };
      onChange('bio', JSON.stringify(newBio));
    }
  };
  
  if (user.role !== 'professional') {
    return null;
  }
  
  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900">
        {t('profile:sections.professionalInfo')}
      </h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.title')}
          </label>
          <input
            type="text"
            id="title"
            value={user.bio?.professional_info?.title || ''}
            onChange={(e) => handleProfessionalInfoChange('title', e.target.value)}
            placeholder={t('profile:placeholders.title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
            {t('profile:fields.yearsExperience')}
          </label>
          <input
            type="number"
            id="yearsExperience"
            min="0"
            value={user.bio?.professional_info?.years_experience || ''}
            onChange={(e) => handleProfessionalInfoChange('years_experience', parseInt(e.target.value) || 0)}
            placeholder={t('profile:placeholders.yearsExperience')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Skills section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile:sections.skills')}
        </label>
        
        <div className="mb-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2">
              <div>
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-gray-500 ml-2">({skill.experience})</span>
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
            <label htmlFor="skillName" className="block text-sm font-medium text-gray-700">
              {t('common:name')}
            </label>
            <input
              type="text"
              id="skillName"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="w-1/3">
            <label htmlFor="skillExperience" className="block text-sm font-medium text-gray-700">
              {t('profile:sections.experience')}
            </label>
            <select
              id="skillExperience"
              value={newSkill.experience}
              onChange={(e) => setNewSkill({ ...newSkill, experience: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
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

export default EditProfessionalInfo;
