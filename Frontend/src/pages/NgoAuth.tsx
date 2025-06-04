import React from 'react';
import AuthForm from '../components/common/AuthForm';
import { Heart } from 'lucide-react';

const NgoAuth: React.FC = () => {
  // NGO-specific details
  const userType = 'ngo';
  const authImage = 'https://images.pexels.com/photos/2706654/pexels-photo-2706654.jpeg';
  const primaryColor = '#C05621';
  const secondaryColor = '#ED8936';
  
  const logoComponent = (
    <div className="flex items-center">
      <Heart className="h-8 w-8" />
      <span className="ml-2 text-2xl font-bold">AgroImpact</span>
    </div>
  );

  return (
    <AuthForm
      userType={userType}
      authImage={authImage}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      logoComponent={logoComponent}
    />
  );
};

export default NgoAuth;