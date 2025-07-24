import React from 'react';
import UploadVideo from '../Components/UploadComponent/UploadVideo';

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      
      <div className="w-full max-w-lg rounded-lg shadow-lg p-8">
        <UploadVideo />
      </div>
    </div>
  );
} 