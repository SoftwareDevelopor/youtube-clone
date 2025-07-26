'use client'
import React, { useContext } from 'react';
import { MainContextProvider } from '@/app/MainContext';
import Link from 'next/link';

export default function DownloadSection() {
  const { downloads } = useContext(MainContextProvider);
  

  return (
    <div className="p-5 w-full overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 text-white">Downloads</h2>
      {downloads.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No downloaded videos yet.</div>
          <p className="text-gray-500 text-sm">
            Download videos to watch them offline. You can download 1 video per day for free, 
            or upgrade to Premium for unlimited downloads.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {downloads.map((v, i) => (
            <div key={i} className="grid grid-cols-[40%_auto] gap-5 relative group hover:bg-gray-800 p-3 rounded-xl transition-all duration-200">
              <img
                src={v.thumbnail}
                alt={v.videotitle}
                width={"100%"}
                className="rounded-xl object-cover h-48"
              />
              <div className="flex flex-col gap-3 my-6">
                <h1 className="text-xl font-semibold">{v.videotitle}</h1>
                <p className="text-gray-400">By: {v.uploader}</p>
                <p className="text-gray-400 text-sm">Channel: {v.videochannel}</p>
                {v.description && (
                  <p className="text-gray-500 text-sm line-clamp-2">{v.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Link href={`/videopage/${v._id}`} className="inline-block bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition">
                    Play Video
                  </Link>
                  <span className="inline-block bg-green-600 text-white text-center py-2 px-4 rounded">
                    Downloaded
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 