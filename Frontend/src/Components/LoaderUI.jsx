import React from "react";

const LoaderUI = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Glow ring */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-blue-200 animate-ping"></div>

        {/* Main spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

        {/* Inner spinner */}
        <div className="absolute w-10 h-10 rounded-full border-4 border-blue-400 border-b-transparent animate-spin"></div>
      </div>

      <p className="mt-6 text-gray-700 text-lg tracking-wide animate-pulse">
        Securing your workspace...
      </p>
    </div>
  );
};

export default LoaderUI;
