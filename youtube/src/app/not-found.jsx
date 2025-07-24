"use client";
import React from 'react';
import Link from 'next/link';

import Sidebar from "./common/Sidebar";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      
      <div className="grid grid-cols-[6%_auto] gap-2">
        <Sidebar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-black">
          <div className="text-center max-w-md mx-auto px-4">
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-red-500" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link 
                href="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full"
              >
                Go to Home
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full"
              >
                Go Back
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500 text-sm mb-4">
                You can also try:
              </p>
              <div className="space-y-2">
                <Link 
                  href="/" 
                  className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  • Browse trending videos
                </Link>
                <Link 
                  href="/" 
                  className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  • Search for content
                </Link>
                <Link 
                  href="/" 
                  className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  • Check your subscriptions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
