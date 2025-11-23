
import React from 'react';

const NavigationTabs = () => {
  const tabs = ["شات الخليج", "شات فله الصوتي", "شات فله الخليج", "شات الجوال"];

  return (
    <nav className="bg-gray-200 py-2">
      <div className="container mx-auto flex justify-center space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="rounded-md bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-100"
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;
