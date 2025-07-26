'use client'

import { MainContextProvider } from '@/app/MainContext';
import React, { useContext, useState } from 'react'

import axios, { Axios, AxiosHeaders } from 'axios';
import axiosInstance from '../axioscomponent/axiosinstances';
import { toast, ToastContainer } from 'react-toastify';

export default function UploadVideo() {

    let { user } = useContext(MainContextProvider)

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  

  // Generate a simple video ID (timestamp-based for demo)
  const generateVideoId = () => `vid_${Date.now()}`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(null);
    }
  };


  let resetform=()=>{
    setDescription('')
    setTitle('')
    setPreview(null)
    setThumbnailPreview(null)
    setThumbnailFile(null)
    setVideoFile(null)
  }

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnailFile) {
      toast.error('Please select both a video and a thumbnail.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('videotitle', title);
    formData.append('description', description);
    formData.append('uploader', user?.displayName || user?.email || 'Unknown Channel');
    formData.append('videochannel', user?.displayName || user?.email || 'Unknown Channel');
    // formData.append('channelLogo', user?.photoURL || '');

    try {
      const response = await fetch('https://youtube-clone-oprs.onrender.com/video/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      toast.success("Upload Successfully!");
      resetform();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.error || 'Upload failed. Please try again.');
    }
  };

  

  return (
    user ? (
      <>
      <ToastContainer/>
        <form onSubmit={handleUpload} className=' border rounded-lg p-6 shadow-lg space-y-1'>
        
        <div className='mb-2'>
          <label className='block font-medium mb-1'>Channel:</label>
          <div className='p-2 bg-gray-100 text-black rounded'>{user?.displayName || user?.email || 'Unknown Channel'}</div>
        </div>
        <div className='mb-2'>
          <label htmlFor="video-upload" className='block font-medium mb-1'>Video File:</label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
        {preview && (
          <div className='mb-2'>
            <video width="320" height="180" controls>
              <source src={preview} type={videoFile ? videoFile.type : ''} />
              
            </video>
          </div>
        )}
        <div className='mb-2'>
          <label htmlFor="thumbnail-upload" className='block font-medium mb-1'>Thumbnail Image:</label>
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>
        {thumbnailPreview && (
          <div className='mb-2'>
            <img src={thumbnailPreview} alt="Thumbnail Preview" width={160} height={90} className='rounded border' />
          </div>
        )}
        <div className='mb-2'>
          <label htmlFor="title" className='block font-medium mb-1'>Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full border rounded p-2'
            required
          />
        </div>
        <div className='mb-2'>
          <label htmlFor="description" className='block font-medium mb-1'>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='w-full border rounded p-2'
            rows={3}
            required
          />
        </div>
        <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>Upload</button>
        
      </form>
    
      </>
    ) : (
      <div className='text-center p-8'>Please log in to upload a video.</div>
    )
  )
  
}
