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
        <div className="text-gray-400">No downloaded videos yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {downloads.map((v, i) => (
            <div key={i} className="grid grid-cols-[40%_auto] gap-5 relative group hover:bg-gray-800 p-3 rounded-xl">
              <img
                src={`http://localhost:5000/${v.thumbnail.replace(/\\/g, "/")}`}
                alt=""
                width={"100%"}
                className="rounded-xl"
              />
              <div className="flex flex-col gap-3 my-6">
                <h1 className="text-xl">{v.videotitle}</h1>
                
                  <p>{v.uploader}</p>
                
                <Link href={`/videopage/${v._id}`} className="w-25 mt-2 inline-block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition">Play</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 