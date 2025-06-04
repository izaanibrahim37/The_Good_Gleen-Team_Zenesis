import React from 'react';
import AuthForm from '../components/common/AuthForm';
import { Plane as Plant } from 'lucide-react';

const FarmerAuth: React.FC = () => {
  // Farmer-specific details
  const userType = 'farmer';
  const authImage = 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg';
  const primaryColor = '#2D6A4F';
  const secondaryColor = '#40916C';
  
  const logoComponent = (
    <div className="flex items-center">
      <Plant className="h-8 w-8" />
      <span className="ml-2 text-2xl font-bold">FarmConnect</span>
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

export default FarmerAuth;