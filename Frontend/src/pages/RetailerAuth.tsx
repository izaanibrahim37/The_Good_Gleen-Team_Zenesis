import React from 'react';
import AuthForm from '../components/common/AuthForm';
import { ShoppingBag } from 'lucide-react';

const RetailerAuth: React.FC = () => {
  // Retailer-specific details
  const userType = 'retailer';
  const authImage = 'https://images.pexels.com/photos/2292919/pexels-photo-2292919.jpeg';
  const primaryColor = '#1E40AF';
  const secondaryColor = '#3B82F6';
  
  const logoComponent = (
    <div className="flex items-center">
      <ShoppingBag className="h-8 w-8" />
      <span className="ml-2 text-2xl font-bold">MarketLink</span>
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

export default RetailerAuth;