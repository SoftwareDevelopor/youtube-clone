"use client";
import React, { useContext } from "react";
import { MainContextProvider } from "@/app/MainContext";
import Link from "next/link";
import { AiOutlineHistory, AiOutlineDelete } from "react-icons/ai";
export default function History() {
  const { history, setHistory } = useContext(MainContextProvider);

  const removeFromHistory = (videoId) => {
    setHistory(history.filter((video) => video.id !== videoId));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const renderVideoCard = (video) => (
    <div
      key={video.id}
      className="relative group hover:bg-gray-800 p-3 rounded-xl transition-all duration-200"
    >
      <Link href={`/videopage/${video.id}`}>
        <div className="grid grid-cols-[30%_auto] gap-5">
          <div className="relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="rounded-xl w-full"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          <div className="flex flex-col gap-3 my-6">
            <h3 className="text-xl font-semibold text-white line-clamp-2">
              {video.title}
            </h3>
            <div className="flex flex-col gap-1 text-gray-400">
              <p className="text-sm">{video.channel}</p>
              <div className="flex items-center gap-2 text-xs">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.timeAgo || "Recently"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={() => removeFromHistory(video.id)}
        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <AiOutlineDelete className="text-lg" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <AiOutlineHistory className="text-5xl text-red-600" />
              Watch History
            </h1>
            <p className="text-gray-400">Videos you've watched recently</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear All History
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <AiOutlineHistory className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No watch history</h3>
            <p className="text-gray-500 mb-6">
              Videos you watch will appear here
            </p>
            <Link
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Watching
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((video) => renderVideoCard(video))}
          </div>
        )}
      </div>
    </div>
  );
}
