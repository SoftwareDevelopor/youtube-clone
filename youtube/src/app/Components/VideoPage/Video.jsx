"use client";
import { recommendedVideos } from "@/app/common/Rightsidebar";
import { MainContextProvider } from "@/app/MainContext";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsHeartFill, BsThreeDotsVertical } from "react-icons/bs";
import { TbShare3 } from "react-icons/tb";
import { HiDownload } from "react-icons/hi";
import { IoCutOutline } from "react-icons/io5";
import { LiaSaveSolid } from "react-icons/lia";
import { VscReport } from "react-icons/vsc";
import Rightsidebar from "@/app/common/Rightsidebar";
import axios from "axios";
import axiosInstance from "../axioscomponent/axiosinstances";
import Script from 'next/script';

export default function Video() {
  let { id } = useParams();

  let [singledata, setSingleData] = useState(null);
  let [pointsAwarded, setPointsAwarded] = useState(false);

  let {
    isSubscribed,
    setisSubscribed,
    user,
    downloads,
    setDownloads
  } = useContext(MainContextProvider);

  let getSingleData = async () => {
    try {
      const res = await axios.get('https://youtube-clone-oprs.onrender.com/video/getallvideos');
      let data = res.data.find((v) => String(v._id) === String(id));
      //String(v._id) === String(id) :- first of all _id must be convert into the string then use it , before conversion of _id it is in object form.
      console.log(data)
      setSingleData(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setSingleData(null);
    }
  };

  const incrementPointsForWatching = async () => {
    if (user && user.displayName && user.email && singledata) {
      try {
        // Check if user has already watched this video today
        const videoId = singledata._id;
        const today = new Date().toDateString();
        const watchedKey = `watched_${user.email}_${videoId}_${today}`;
        
        // Check localStorage to see if this video was already watched today
        const alreadyWatched = localStorage.getItem(watchedKey);
        
        if (alreadyWatched) {
          console.log('Video already watched today, skipping points increment');
          return;
        }
        
        console.log('Incrementing points for watching video:', singledata.videotitle);
        
        const response = await fetch("https://youtube-clone-oprs.onrender.com/api/user/addPoints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.displayName,
            email: user.email,
            increment: 5, // 5 points for watching a video
          }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log(`Points incremented by 5 for watching video. New total: ${data.points}`);
          // Mark this video as watched today
          localStorage.setItem(watchedKey, 'true');
          
          // Set points awarded state to show notification
          setPointsAwarded(true);
          
          // Show success message to user
          console.log('Points awarded for watching video!');
          
          // Hide notification after 3 seconds
          setTimeout(() => {
            setPointsAwarded(false);
          }, 3000);
        } else {
          console.error('Failed to increment points for watching:', data.message);
        }
      } catch (error) {
        console.error("Error incrementing points for watching:", error);
      }
    }
  };

  useEffect(() => {
    getSingleData();
  }, []);

  // Increment points when video is loaded and user is logged in
  useEffect(() => {
    if (singledata && user) {
      incrementPointsForWatching();
    }
  }, [singledata, user]);

  let [visible, setvisible] = useState(0);
  let [modalVisible, setModalVisible] = useState(false);
  let [inputvalue, setinputvalue] = useState(false);

  let options = [
    {
      id: 1,
      name: "Download",
      icon: HiDownload,
    },
    {
      id: 2,
      name: "Thanks",
      icon: BsHeartFill,
    },
    {
      id: 3,
      name: "Clip",
      icon: IoCutOutline,
    },
    {
      id: 4,
      name: "Save",
      icon: LiaSaveSolid,
    },
    {
      id: 5,
      name: "Report",
      icon: VscReport,
    },
  ];

  const handleOptionClick = (optionName) => {
    if (optionName === "Save") {
      setModalVisible(true);
      setvisible(0); // Close the dropdown
    } else if (optionName == "Download") {
      handleDownload()
    }
  };

  // Debug function to check user state
  const debugUserState = () => {
    console.log('=== DEBUG USER STATE ===');
    console.log('User object:', user);
    console.log('User type:', typeof user);
    console.log('User keys:', user ? Object.keys(user) : 'No user object');
    console.log('User email:', user?.email);
    console.log('User displayName:', user?.displayName);
    console.log('User uid:', user?.uid);
    console.log('User photoURL:', user?.photoURL);
    console.log('User providerData:', user?.providerData);
    console.log('=======================');
  };

  let handleDownload = async () => {
    try {
      if (!singledata) {
        alert('Video data not loaded. Please refresh the page and try again.');
        return;
      }
      
      // Debug user state
      debugUserState();
      
      if (!user) {
        alert('You must be logged in to download videos. Please log in and try again.');
        return;
      }
      
    
      // Check if user has free download or premium access
      let canDownload = false;
      let isPremium = false;
      
      try {
        console.log('Checking download status for user:', userEmail);
        const freeRes = await axiosInstance.post('/api/user/hasFreeDownloadToday', { 
          email: userEmail 
        });
        
        console.log('Download status response:', freeRes.data);
        
        if (freeRes && freeRes.data) {
          canDownload = freeRes.data.free || false;
          isPremium = freeRes.data.isPremium || false;
          console.log('Download check result:', { canDownload, isPremium });
        }
      } catch (error) {
        console.error('Error checking download status:', error);
        // If we can't check, allow download anyway
        canDownload = true;
        console.log('Allowing download due to check failure');
      }

      // If user has premium or free download, proceed
      if (canDownload || isPremium) {
        console.log('Proceeding with download - user has access');
        await doDownload();
        return;
      }

      // If no free download and not premium, show payment option
      const shouldPay = confirm(
        'You have used your free download today. Would you like to get premium access for unlimited downloads?'
      );
      
      if (shouldPay) {
        // Load Razorpay script
        if (!window.Razorpay) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }

        const options = {
          key: 'rzp_test_1DP5mmOlF5G5ag',
          amount: 10000, // 100 INR in paise
          currency: 'INR',
          name: 'Video Download Premium',
          description: 'Premium Plan - Unlimited Downloads for 30 Days',
          handler: async function (response) {
            try {
              // Activate premium plan
              const premiumResponse = await fetch("https://youtube-clone-oprs.onrender.com/api/user/activatePremium", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: userEmail,
                  duration: 30,
                }),
              });
              
              if (premiumResponse.ok) {
                alert('Premium plan activated! You now have unlimited downloads for 30 days.');
              } else {
                console.error('Failed to activate premium plan');
              }
              
              // Proceed with download
              await doDownload();
            } catch (error) {
              console.error('Error activating premium plan:', error);
              // Still proceed with download
              await doDownload();
            }
          },
          prefill: {
            email: userEmail,
          },
          theme: {
            color: '#3399cc'
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
      
    } catch (error) {
      console.error('Download check failed:', error);
      // Don't show alert for general errors, just log them
      console.log('Download process encountered an error, but continuing...');
    }
  }

  async function doDownload() {
    try {
      console.log('Starting download for video:', singledata.videotitle);
      console.log('Video ID:', singledata._id);
      
      // Try multiple download methods
      let downloadSuccess = false;
      
      // Method 1: Try the API endpoint
      try {
        const response = await axios.get(`https://youtube-clone-oprs.onrender.com/video/download/${singledata._id}`, {
          responseType: 'blob',
          timeout: 30000, // 30 second timeout
        });
        
        if (response.data && response.data.size > 0) {
          console.log('Download response received, size:', response.data.size);
          
          // Create a link and trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          
          // Set filename with proper extension
          const fileExtension = singledata.filetype ? '.' + singledata.filetype.split('/')[1] : '.mp4';
          const filename = singledata.videotitle.replace(/[^a-z0-9]/gi, '_') + fileExtension;
          link.setAttribute('download', filename);
          
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          
          downloadSuccess = true;
          console.log('Download completed successfully via API');
        }
      } catch (apiError) {
        console.error('API download failed:', apiError);
      }
      
      // Method 2: Fallback to direct video URL if API fails
      if (!downloadSuccess && singledata.filepath) {
        try {
          console.log('Trying fallback download method...');
          
          const response = await fetch(singledata.filepath);
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            const fileExtension = singledata.filetype ? '.' + singledata.filetype.split('/')[1] : '.mp4';
            const filename = singledata.videotitle.replace(/[^a-z0-9]/gi, '_') + fileExtension;
            link.setAttribute('download', filename);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            downloadSuccess = true;
            console.log('Download completed successfully via fallback method');
          }
        } catch (fallbackError) {
          console.error('Fallback download failed:', fallbackError);
        }
      }
      
      if (!downloadSuccess) {
        // Show a more user-friendly error message
        alert('Download failed. The video might be temporarily unavailable. Please try again later.');
        return;
      }
      
      // Save to downloads in context
      setDownloads(prev => {
        // Avoid duplicates by _id
        if (prev.some(v => v._id == singledata._id)) return prev;
        return [...prev, singledata];
      });
      
      // Record download in backend (don't block on this)
      try {
        const recordResponse = await fetch(`https://youtube-clone-oprs.onrender.com/api/user/recordDownload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            videoId: singledata._id
          })
        });
        
        if (recordResponse.ok) {
          console.log('Download recorded successfully');
        } else {
          console.error('Failed to record download');
        }
      } catch (err) {
        console.error('Error recording download:', err);
        // Don't show error to user for this
      }
      
      // Show success message
      console.log('Video downloaded successfully!');
      
    } catch (error) {
      console.error('Download failed:', error);
      // Show a more user-friendly error message
      alert('Download failed. Please try again later or contact support if the problem persists.');
    }
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setinputvalue(isChecked);
  };

  return (
    <div className="py-6 px-2">
      {/* Points Awarded Notification */}
      {pointsAwarded && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="font-semibold">+5 Points earned for watching!</span>
          </div>
        </div>
      )}
      
      <div className="grid lg:grid-cols-[55%_auto] grid-cols-1 gap-9">
        {/* Main Video Area */}
        <div className="flex flex-col gap-5">
          {singledata ? (
            <>
              <video
                controls
                controlsList="nodownload"
                width={"100%"}
                className="rounded-2xl"
              >
                {/* controlsList="nodownload" :- this will remove or hide the download button in controls */}
                <source
                  src={`${singledata.filepath}`}
                  type={singledata.filetype}
                />
              </video>

              <h1 className="text-2xl">{singledata.videotitle}</h1>
              <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center gap-3 ">
                  <div className="w-14 h-14 rounded-full border flex justify-center items-center">
                    <img
                      src={singledata.videochannel}
                      alt=""
                      className="rounded-full w-full"
                    />
                  </div>
                  <h2>{singledata.uploader}</h2>
                  {isSubscribed ? (
                    <button
                      type="button"
                      onClick={() => setisSubscribed(false)}
                      className="bg-[#373737] text-white py-3 px-6 rounded-4xl"
                    >
                      Subscribed
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-[#f1f1f1] text-black px-5 py-3 rounded-4xl"
                      onClick={() => setisSubscribed(true)}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
                <div className="flex gap-5 items-center">
                  <AddtoLiked getSingleData={singledata} />
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-4xl text-2xl bg-[#373737] flex items-center gap-1.5 relative"
                  >
                    <TbShare3 />
                    <span>Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setvisible(visible == 0 ? 1 : 0)}
                    className="w-13 h-13 rounded-full bg-[#373737] text-2xl flex justify-center items-center relative"
                  >
                    <BsThreeDotsVertical />
                    <div
                      className={`py-3 absolute bottom-[50px] left-3 flex flex-col gap-1.5 bg-[#272727] rounded-xl ${
                        visible == 1 ? "block" : "hidden"
                      }`}
                    >
                      {options.map((item, index) => {
                        let Icon = item.icon;
                        return (
                          <div
                            key={index}
                            className="flex gap-2 items-center group hover:bg-gray-500 py-1.5 px-5 cursor-pointer"
                            onClick={() => handleOptionClick(item.name)}
                          >
                            <Icon />
                            <p>{item.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </button>
                </div>
              </div>

              <div className="w-full bg-[#272727] rounded-2xl my-2.5 p-5 text-xl">
                <p>{singledata.views} views</p>
                <p >{singledata.description}</p>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[500px] w-full mx-4 border rounded-xl py-5 px-3 bg-[#262626] modal">
          <h1 className="my-3 text-2xl relative">
            Save To :
            <span
              className="absolute right-2 text-4xl cursor-pointer hover:text-gray-400"
              onClick={closeModal}
            >
              &times;
            </span>
          </h1>
          <ul className="flex flex-col gap-2 my-2">
            <li className="flex gap-3 items-center text-2xl">
              <input
                type="checkbox"
                name="watchlater"
                id="watchlater"
                checked={inputvalue}
                onChange={handleCheckboxChange}
                className="w-5 h-5"
              />
              <span>Watch Later</span>
            </li>
          </ul>
          <button
            type="button"
            className="w-full py-2.5 text-center text-lg bg-[#3b3b3b] rounded-3xl my-2 cursor-pointer hover:bg-[#4a4a4a]"
          >
            New Playlist
          </button>
        </div>
      )}
    </div>
  );
}

function AddtoLiked({ getSingleData }) {
  let { thumbnail, _id, videotitle, uploader, like } = getSingleData;

  let [likes, setlikes] = useState(like || 0); // initialize with current like count

  let likedobject = {
    thumbnail,
    videotitle,
    uploader,
  };

  let addtoliked = async (e) => {
    e.preventDefault();
    try {
      // Call backend to increment like
      const res = await axios.patch(`https://youtube-clone-oprs.onrender.com/video/like/${_id}`);
      console.log('Like response:', res.data);
      
      if (res.data && res.data.like !== undefined) {
        setlikes(res.data.like); // update with new like count from backend
      } else {
        console.log('Unexpected response format:', res.data);
      }
      
    } catch (err) {
      console.error("Failed to like video", err);
      if (err.response && err.response.data) {
        console.log('Error response:', err.response.data);
      }
    }
  };
  
  return (
    <>
      <div className="flex items-center gap-3 bg-[#373737] p-2.5 rounded-4xl">
        <span className="flex items-center text-3xl" onClick={addtoliked}>
          <AiOutlineLike />
          <span className="text-xl"> {likes} </span>
        </span>
        <span className="text-2xl">|</span>
        <span>
          <AiOutlineDislike className="text-3xl " />
        </span>
      </div>
    </>
  );
}
