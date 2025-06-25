import React from 'react';
import { useTranslation } from 'next-i18next';
import { User } from '@/types/user';

interface EditProfileImageProps {
  user: User;
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

const EditProfileImage: React.FC<EditProfileImageProps> = ({ 
  user, 
  onImageChange,
  previewUrl
}) => {
  const { t } = useTranslation('profile');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onImageChange(file);
    }
  };
  
  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer mb-4"
        onClick={handleImageClick}
      >
        {previewUrl || user.profile_image ? (
          <img 
            src={previewUrl || (typeof user.profile_image === 'string' ? user.profile_image : '')} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-medium">
            {t('profile.fields.uploadImage')}
          </span>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {(previewUrl || user.profile_image) && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="text-sm text-red-600 hover:text-red-800"
        >
          {t('profile.fields.removeImage')}
        </button>
      )}
    </div>
  );
};

export default EditProfileImage;
