import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { UserRole, signIn, signUp, checkRateLimit } from '../../lib/supabase';
import { useUserRole } from '../../contexts/UserRoleContext';

interface AuthFormProps {
  userType: UserRole;
  authImage: string;
  primaryColor: string;
  secondaryColor: string;
  logoComponent: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  userType, 
  authImage, 
  primaryColor, 
  secondaryColor, 
  logoComponent 
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { setRole } = useUserRole();

  // Password strength checker
  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    setPasswordStrength(strength);
    return strength;
  };

  // Form validation
  const validateForm = () => {
    // Reset error
    setError('');

    // Check for empty fields
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    // Check rate limiting
    if (!checkRateLimit(email)) {
      setError('Too many login attempts. Please try again later.');
      return false;
    }

    // Additional validations for signup
    if (!isLogin) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }

      if (checkPasswordStrength(password) < 3) {
        setError('Password is too weak. Include uppercase, numbers, and special characters.');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (!firstName.trim() || !lastName.trim()) {
        setError('First name and last name are required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle login
        await signIn(email, password);
        // Fetch user role and set it in context
        setRole(userType);
        // Redirect to appropriate dashboard
        redirectToDashboard();
      } else {
        // Handle signup
        await signUp(email, password, userType);
        // Set role in context
        setRole(userType);
        // Redirect to appropriate dashboard
        redirectToDashboard();
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDashboard = () => {
    switch(userType) {
      case 'farmer':
        navigate('/farmer-dashboard');
        break;
      case 'retailer':
        navigate('/retailer-dashboard');
        break;
      case 'ngo':
        navigate('/ngo-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  // Password strength indicator colors
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-green-400';
    return 'bg-green-600';
  };

  // Get typography color based on user type
  const getTextColor = () => {
    switch (userType) {
      case 'farmer': return 'text-green-800';
      case 'retailer': return 'text-blue-800';
      case 'ngo': return 'text-orange-800';
      default: return 'text-gray-800';
    }
  };

  // Get button color based on user type
  const getButtonClasses = () => {
    const baseClasses = 'w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ';
    
    switch (userType) {
      case 'farmer':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`;
      case 'retailer':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
      case 'ngo':
        return `${baseClasses} bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500`;
      default:
        return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image and Branding */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center p-12 items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, ${primaryColor}99, ${secondaryColor}99), url(${authImage})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="text-white max-w-md">
          <div className="mb-6">{logoComponent}</div>
          <h1 className="text-4xl font-bold mb-4">
            {isLogin ? 'Welcome Back!' : 'Join as a ' + userType.charAt(0).toUpperCase() + userType.slice(1)}
          </h1>
          <p className="text-xl opacity-90">
            {userType === 'farmer' && 'Connect with retailers and access resources to grow your agribusiness.'}
            {userType === 'retailer' && 'Find quality produce and build relationships with local farmers.'}
            {userType === 'ngo' && 'Support sustainable agriculture and make a difference in farming communities.'}
          </p>
        </div>
      </div>

      {/* Mobile Header */}
      <div 
        className="md:hidden w-full p-6 flex items-center justify-center"
        style={{ 
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        <div className="text-white">
          <div className="mb-3 flex justify-center">{logoComponent}</div>
          <h1 className="text-xl font-bold text-center">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
          </h1>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold ${getTextColor()}`}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin 
                ? `Access your ${userType} account`
                : `Register as a ${userType} on our platform`
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="text-red-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                    style={{ focusRing: primaryColor }}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                    style={{ focusRing: primaryColor }}
                    aria-required="true"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                style={{ focusRing: primaryColor }}
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!isLogin) checkPasswordStrength(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                style={{ focusRing: primaryColor }}
                aria-required="true"
              />

              {!isLogin && password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 w-1/4 rounded-full ${i < passwordStrength ? getStrengthColor() : 'bg-gray-200'}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {passwordStrength <= 1 && 'Weak password'}
                    {passwordStrength === 2 && 'Moderate password'}
                    {passwordStrength === 3 && 'Strong password'}
                    {passwordStrength === 4 && 'Very strong password'}
                  </p>
                </div>
              )}
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ focusRing: primaryColor }}
                  aria-required="true"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={getButtonClasses()}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium hover:underline"
                style={{ color: primaryColor }}
              >
                {isLogin
                  ? `Don't have an account? Sign up`
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;