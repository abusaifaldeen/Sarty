
import React from 'react';

const HeaderBanner = () => {
  return (
    <header className="relative w-full bg-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Left side: Skewed Cards */}
        <div className="flex items-center space-x-2">
          <div className="transform -skew-x-12 bg-green-500 px-4 py-1 text-white">
            تعارف
          </div>
          <div className="transform -skew-x-12 bg-blue-400 px-4 py-1 text-white">
            مسابقات
          </div>
          <div className="transform -skew-x-12 bg-red-500 px-4 py-1 text-white">
            جوائز
          </div>
        </div>

        {/* Center: Logo and URL */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800">شات سهر الخليج</h1>
          <a href="https://ch1tt.com" className="text-blue-500">
            https://ch1tt.com
          </a>
        </div>

        {/* Right side: Placeholder Image */}
        <div className="w-16 h-16 bg-gray-300 rounded-full">
          {/* Placeholder for the girl's face image */}
        </div>
      </div>
    </header>
  );
};

export default HeaderBanner;
