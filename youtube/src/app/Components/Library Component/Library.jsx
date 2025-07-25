"use client";
import React, { useContext, useState } from 'react';
import { MainContextProvider } from '@/app/MainContext';
import Link from 'next/link';
import { AiOutlineHistory, AiOutlineLike, AiOutlinePlayCircle, AiOutlineClockCircle, AiOutlinePlus, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdPlaylistPlay } from 'react-icons/md';

export default function UserLibraryPage() {
  const { 
    history, 
    setHistory, 
    likedvideo, 
    setlikedvideo, 
    watchLater, 
    setWatchLater, 
    playlists, 
    setPlaylists 
  } = useContext(MainContextProvider);

  const [activeTab, setActiveTab] = useState('history');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const tabs = [
    { id: 'history', label: 'History', icon: AiOutlineHistory, count: history.length },
    { id: 'liked', label: 'Liked Videos', icon: AiOutlineLike, count: likedvideo.length },
    { id: 'playlists', label: 'Playlists', icon: MdPlaylistPlay, count: playlists.length },
    { id: 'watchlater', label: 'Watch Later', icon: AiOutlineClockCircle, count: watchLater.length }
  ];

  const removeFromHistory = (videoId) => {
    setHistory(history.filter(video => video.id !== videoId));
  };

  const removeFromWatchLater = (videoId) => {
    setWatchLater(watchLater.filter(video => video.id !== videoId));
  };

  const removeFromLiked = (videoId) => {
    setlikedvideo(likedvideo.filter(video => video.id !== videoId));
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName,
        description: newPlaylistDescription,
        videos: [],
        thumbnail: `/images/${Math.floor(Math.random() * 24) + 1}.jpg`
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreatePlaylist(false);
    }
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  };

  const renderVideoCard = (video, onRemove, showRemove = true) => (
    <div key={video.id} className="relative group hover:bg-gray-800 p-3 rounded-xl transition-all duration-200">
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
            <h3 className="text-xl font-semibold text-white line-clamp-2">{video.title}</h3>
            <div className="flex flex-col gap-1 text-gray-400">
              <p className="text-sm">{video.channel}</p>
              <div className="flex items-center gap-2 text-xs">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.timeAgo || 'Recently'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {showRemove && onRemove && (
        <button
          onClick={() => onRemove(video.id)}
          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <AiOutlineDelete className="text-lg" />
        </button>
      )}
    </div>
  );

  const renderPlaylistCard = (playlist) => (
    <div key={playlist.id} className="relative group hover:bg-gray-800 p-4 rounded-xl transition-all duration-200">
      <div className="flex gap-4">
        <div className="relative w-48 h-32 flex-shrink-0">
          <img
            src={playlist.thumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <AiOutlinePlayCircle className="text-4xl text-white" />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{playlist.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
            <p className="text-gray-500 text-xs">{playlist.videos.length} videos</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Play All
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              <AiOutlineEye className="inline mr-1" />
              View
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => deletePlaylist(playlist.id)}
        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <AiOutlineDelete className="text-lg" />
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <AiOutlineHistory className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No watch history</h3>
                <p className="text-gray-500">Videos you watch will appear here</p>
              </div>
            ) : (
              history.map(video => renderVideoCard(video, removeFromHistory))
            )}
          </div>
        );
      
      case 'liked':
        return (
          <div className="space-y-4">
            {likedvideo.length === 0 ? (
              <div className="text-center py-12">
                <AiOutlineLike className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No liked videos</h3>
                <p className="text-gray-500">Videos you like will appear here</p>
              </div>
            ) : (
              likedvideo.map(video => renderVideoCard(video, removeFromLiked))
            )}
          </div>
        );
      
      case 'playlists':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <AiOutlinePlus />
                Create Playlist
              </button>
            </div>
            
            {playlists.length === 0 ? (
              <div className="text-center py-12">
                <MdPlaylistPlay className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No playlists</h3>
                <p className="text-gray-500">Create your first playlist to get started</p>
              </div>
            ) : (
              playlists.map(playlist => renderPlaylistCard(playlist))
            )}
          </div>
        );
      
      case 'watchlater':
        return (
          <div className="space-y-4">
            {watchLater.length === 0 ? (
              <div className="text-center py-12">
                <AiOutlineClockCircle className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No watch later videos</h3>
                <p className="text-gray-500">Videos you save to watch later will appear here</p>
              </div>
            ) : (
              watchLater.map(video => renderVideoCard(video, removeFromWatchLater))
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Library</h1>
        <p className="text-gray-400">Manage your videos, playlists, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-900 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="text-lg" />
              <span>{tab.label}</span>
              <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-6xl">
        {renderContent()}
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Playlist</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Enter playlist name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Enter playlist description"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={createPlaylist}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreatePlaylist(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
