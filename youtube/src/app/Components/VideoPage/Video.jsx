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
    if (user && user.displayName && user.email) {
      try {
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
        } else {
          console.error(data.message || "Failed to increment points for watching");
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

  let handleDownload = async () => {
    try {
      if (!singledata) return alert('Video data not loaded');
      if (!user || !user.email) return alert('You must be logged in to download.');

      // 1. Check if user has a free download today
      const freeRes = await axiosInstance.post('/api/user/hasFreeDownloadToday', { email: user.email });
      const isFree = freeRes.data.free;

      // 2. If not free, trigger Razorpay payment
      if (!isFree) {
        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }
        // Create order on backend (optional, for now use fixed amount)
        const options = {
          key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your test key if needed
          amount: 10000, // 100 INR in paise
          currency: 'INR',
          name: 'Video Download Premium',
          description: 'Premium Plan - Unlimited Downloads for 30 Days',
          handler: async function (response) {
            // On payment success, activate premium plan and proceed with download
            try {
              // Activate premium plan
              const premiumResponse = await fetch("https://youtube-clone-oprs.onrender.com/api/user/activatePremium", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: user.email,
                  duration: 30, // 30 days premium
                }),
              });
              
              if (premiumResponse.ok) {
                console.log('Premium plan activated successfully');
                alert('Premium plan activated! You now have unlimited downloads for 30 days.');
              } else {
                console.error('Failed to activate premium plan');
              }
              
              // Proceed with download
              await doDownload();
            } catch (error) {
              console.error('Error activating premium plan:', error);
              // Still proceed with download even if premium activation fails
              await doDownload();
            }
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: '#3399cc'
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }
      // 3. If free, proceed with download
      await doDownload();
    } catch (error) {
      console.log(error);
      
    }
  }

  async function doDownload() {
    // Fetch the file as a blob from the download endpoint
    const response = await axiosInstance.get(`/video/download/${singledata._id}`, {
      responseType: 'blob',
    });
    // Create a link and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', singledata.videotitle + (singledata.filetype ? '.' + singledata.filetype.split('/')[1] : ''));
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    // Save to downloads in context
    setDownloads(prev => {
      // Avoid duplicates by _id
      if (prev.some(v => v._id === singledata._id)) return prev;
      return [...prev, singledata];
    });
    // Record download in backend
    try {
      await axiosInstance.post('/api/user/recordDownload', { email: user.email, videoId: singledata._id });
    } catch (err) {
      // Ignore error
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
