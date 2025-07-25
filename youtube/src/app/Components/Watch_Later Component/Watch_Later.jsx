"use client";
import React, { useContext } from "react";
import { MainContextProvider } from "@/app/MainContext";
import Link from "next/link";
import { AiOutlineClockCircle, AiOutlineDelete } from "react-icons/ai";

export default function WatchLaterPage() {
  const { watchLater, setWatchLater } = useContext(MainContextProvider);
  console.log(watchLater)
  const removeFromWatchLater = (videoId) => {
    setWatchLater(watchLater.filter(video => video.id !== videoId));
  };

  const clearWatchLater = () => {
    setWatchLater([]);
  };

  // const renderVideoCard = (video) => (
  //   <div key={video.id} className="relative group hover:bg-gray-800 p-3 rounded-xl transition-all duration-200">
  //     <Link href={`/videopage/${video.id}`}>
  //       <div className="grid grid-cols-[30%_auto] gap-5">
  //         <div className="relative">
  //           <img
  //             src={video.thumbnail}
  //             alt={video.title}
  //             className="rounded-xl w-full"
  //           />
  //           <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
  //             {video.duration}
  //           </div>
  //         </div>
  //         <div className="flex flex-col gap-3 my-6">
  //           <h3 className="text-xl font-semibold text-white line-clamp-2">{video.title}</h3>
  //           <div className="flex flex-col gap-1 text-gray-400">
  //             <p className="text-sm">{video.channel}</p>
  //             <div className="flex items-center gap-2 text-xs">
  //               <span>{video.views}</span>
  //               <span>•</span>
  //               <span>{video.timeAgo || "Recently"}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Link>
  //     <button
  //       onClick={() => removeFromWatchLater(video.id)}
  //       className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  //     >
  //       <AiOutlineDelete className="text-lg" />
  //     </button>
  //   </div>
  // );

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <AiOutlineClockCircle className="text-5xl text-red-600" />
              Watch Later
            </h1>
            <p className="text-gray-400">Videos you have saved to watch later</p>
          </div>
          {watchLater.length > 0 && (
            <button
              onClick={clearWatchLater}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl">
        {watchLater.length === 0 ? (
          <div className="text-center py-12">
            <AiOutlineClockCircle className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No watch later videos</h3>
            <p className="text-gray-500 mb-6">Videos you save to watch later will appear here</p>
            <Link 
              href={`/`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex">
              <img src={watchLater.thumbnail} alt="" />
              <span className="flex flex-col gap-2.5">
                <p className="text-2xl">{watchLater.title}</p>
                <p className="text-xl">{watchLater.channel}</p>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 