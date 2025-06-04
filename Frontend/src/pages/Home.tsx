import React from 'react';
import { Link } from 'react-router-dom';
import { Plane as Plant, ShoppingBag, Heart } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Plant className="h-8 w-8 text-green-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">GoodGlean</h1>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to GoodGlean
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Connecting farmers, retailers, and NGOs to build a sustainable agricultural ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Farmer Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-700 to-green-500 py-6 px-6">
                  <Plant className="h-12 w-12 text-white opacity-90" />
                  <h3 className="mt-4 text-2xl font-bold text-white">Farmers</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    Connect with buyers, access resources, and grow your agricultural business with real-time market data.
                  </p>
                  <Link 
                    to="/farmer-auth" 
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Farmer Portal
                  </Link>
                </div>
              </div>
            </div>

            {/* Retailer Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-6 px-6">
                  <ShoppingBag className="h-12 w-12 text-white opacity-90" />
                  <h3 className="mt-4 text-2xl font-bold text-white">Retailers</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    Source fresh produce directly from farmers, manage inventory, and optimize your supply chain.
                  </p>
                  <Link 
                    to="/retailer-auth" 
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Retailer Portal
                  </Link>
                </div>
              </div>
            </div>

            {/* NGO Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-700 to-orange-500 py-6 px-6">
                  <Heart className="h-12 w-12 text-white opacity-90" />
                  <h3 className="mt-4 text-2xl font-bold text-white">NGOs</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    Support sustainable agriculture, track impact, and connect with farmers to implement development projects.
                  </p>
                  <Link 
                    to="/ngo-auth" 
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    NGO Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 GoodGlean. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;