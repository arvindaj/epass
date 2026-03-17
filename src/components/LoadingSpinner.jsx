import React from 'react';

const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClass = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14' }[size];

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClass}`}></div>
      </div>
    );
  }
  return <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClass}`}></div>;
};

export default LoadingSpinner;
