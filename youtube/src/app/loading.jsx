import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Please wait while we prepare your content
        </p>
        
        {/* Dots Animation */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
