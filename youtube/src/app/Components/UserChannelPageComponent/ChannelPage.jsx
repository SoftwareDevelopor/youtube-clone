'use client'
import { MainContextProvider } from "@/app/MainContext";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";


export default function ChannelPage() {
  let { user } = useContext(MainContextProvider);
  const [points, setPoints] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const fetchPoints = async () => {
    if (user && user.displayName && user.email) {
      setIsLoading(true);
      try {
        console.log('Fetching points for user:', user.email);
        const response = await fetch("https://youtube-clone-oprs.onrender.com/api/user/getPoints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.displayName,
            email: user.email,
          }),
        });
        
        console.log('Points response status:', response.status);
        const data = await response.json();
        console.log('Points response data:', data);
        
        if (response.ok) {
          setPoints(data.points || 0);
          console.log('Points set to:', data.points);
        } else {
          console.error('Failed to fetch points:', data.message);
          setPoints(0); // Set to 0 instead of null for better UX
        }
      } catch (error) {
        console.error("Error fetching points:", error);
        setPoints(0); // Set to 0 instead of null for better UX
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No user data available for points fetch');
      setPoints(0);
    }
  };

  const incrementPoints = async (increment = 1) => {
    if (user && user.displayName && user.email) {
      try {
        console.log('Incrementing points by:', increment);
        const response = await fetch("https://youtube-clone-oprs.onrender.com/api/user/addPoints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.displayName,
            email: user.email,
            increment: increment,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points); // Update points state with new total
          console.log(`Points incremented by ${increment}. New total: ${data.points}`);
        } else {
          console.error('Failed to increment points:', data.message);
        }
      } catch (error) {
        console.error("Error incrementing points:", error);
      }
    }
  };

  const refreshPoints = () => {
    fetchPoints();
  };

  const checkPremiumStatus = async () => {
    if (user && user.email) {
      try {
        console.log('Checking premium status for:', user.email);
        const response = await fetch("https://youtube-clone-oprs.onrender.com/api/user/checkPremiumStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });
        const data = await response.json();
        console.log('Premium status response:', data);
        if (response.ok) {
          setIsPremium(data.isPremium || false);
          setPremiumExpiry(data.premiumExpiry);
        } else {
          console.error('Failed to check premium status:', data.message);
          setIsPremium(false);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      }
    }
  };

  // Fetch points and premium status when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, fetching points and premium status');
      fetchPoints();
      checkPremiumStatus();
    } else {
      console.log('No user, resetting points');
      setPoints(0);
      setIsPremium(false);
    }
  }, [user]);

  // Refresh points when component becomes visible (when user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('Page became visible, refreshing points');
        fetchPoints();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // Auto-refresh points every 30 seconds when user is logged in
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing points');
      fetchPoints();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Manual refresh function for testing
  const handleManualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchPoints();
    checkPremiumStatus();
  };

  let handleBannerImageFile=(event)=>{
    let Imagefile=(event.target.files[0])
    if(Imagefile){
      setSelectedFile(Imagefile)
      setPreviewImageUrl(URL.createObjectURL(Imagefile))
      
    }
  }

  return (
    <div className="px-2 sm:px-4 md:px-8 py-4 sm:py-6 flex flex-col gap-5 sm:gap-7">
      <div className="flex items-center justify-center w-full">
       {
         previewImageUrl ?
        <>
          <img src={previewImageUrl} className="w-full h-40 sm:h-56 md:h-64 object-cover rounded-lg" alt={selectedFile}/>
        </>
        :
        (
          <label htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40 sm:h-56 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleBannerImageFile}/>
        </label>
        )
       }
      </div>

      {
        user ? 
        <Link href="#" className="grid grid-cols-1 md:grid-cols-[30%_auto] gap-5 md:gap-9 items-center">
        <div className="flex items-center justify-center bg-black rounded-full p-2 sm:p-4 md:p-5 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto md:mx-0">
          <img
            className="object-cover rounded-full w-full h-full"
            src={user.photoURL}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between p-2 sm:p-4 leading-normal">
          <h5 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {user.displayName}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-sm sm:text-base">
            50 Subscribers
          </p>
          
          {/* Points Display with Loading State */}
          <div className="mb-3">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Loading points...
                </span>
              ) : (
                `Points: ${points !== null ? points : 0}`
              )}
            </p>
            {/* Debug info for testing */}
            <button 
              onClick={handleManualRefresh}
              className="text-xs text-gray-500 hover:text-gray-700 mt-1"
            >
              Refresh Points
            </button>
          </div>
          
          {isPremium && (
            <div className="mb-3 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <p className="text-white font-bold text-lg">⭐ Premium Member</p>
              <p className="text-white text-sm">
                Unlimited downloads until {premiumExpiry ? new Date(premiumExpiry).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          )}
          {!isPremium && (
            <div className="mb-3 p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-700 font-semibold">Free Plan</p>
              <p className="text-gray-600 text-sm">1 download per day. Upgrade to Premium for unlimited downloads!</p>
            </div>
          )}
          <p className="text-sm sm:text-base">
            This is the Description.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center mt-2">
            <Link href={"https://studio.youtube.com/"}>
              <button
                type="button"
                className="bg-[#282828] px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-3xl w-full sm:w-auto"
              >
                Customize Channel
              </button>
            </Link>

            <Link href={"https://studio.youtube.com/"}>
              <button
                type="button"
                className="bg-[#282828] px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-3xl w-full sm:w-auto"
              >
                Manage Videos
              </button>
            </Link>
          </div>
        </div>
      </Link>
      :
      <>
      </>
      }
    </div>
  );
}

