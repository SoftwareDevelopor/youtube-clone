"use client";

import React, { useContext, useEffect, useState } from "react";

import axiosInstance from "../Components/axioscomponent/axiosinstances";
import NavSlider from "../Components/Navitems/NavSlider";
import Link from "next/link";
import { MainContextProvider } from "../MainContext";
import axios from "axios";


function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

export default function Rightsidebar() {
  const [video, setVideo] = useState(null);
  let { user } = useContext(MainContextProvider);
  const getVideo = async () => {
    try {
      const res = await axios.get('https://youtube-clone-oprs.onrender.com/video/getallvideos');
      setVideo(res.data)
    } catch (error) {
      console.log(error)
    }
  };
  // Determine grid layout: row-wise if video, column-wise otherwise
  useEffect(() => {
    getVideo();
  }, []);
  return (
    <>
      <div className="p-5 w-full overflow-hidden">
        <NavSlider />
        <div
        
          className="grid lg:grid-cols-3 grid-cols-1 items-center gap-6"
        >
          {video && user? (
            video.map((vid, idx) => (
              <div className="rounded-lg" key={idx}>
                <Link href={`/videopage/${vid._id}`}>
                  <img
                    className="rounded-lg"
                    src={`https://youtube-clone-oprs.onrender.com/${vid.thumbnail
                      .replace(/\\/g, "/")
                      .replace(/\//g, "/")}`}
                    alt={vid.videotitle}
                  />
                </Link>
                <div className="p-3 flex gap-5">
                  <Link href={`/${vid._id}`}>
                    <div className="w-15 h-15 rounded-full">
                      <img
                        src={vid.videochannel}
                        className="max-w-full rounded-full"
                        alt=""
                      />
                    </div>
                  </Link>
                  <div>
                    <a href="#">
                      <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {vid.videotitle}
                      </h5>
                    </a>
                    <p className=" font-normal text-gray-700 dark:text-gray-400">
                      {vid.uploader}
                    </p>
                    <p>
                      {vid.views} views &#x2022;{" "}

                      {timeAgo(vid.createdAt)}
                      
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : 
          (
            <div className="w-full px-7 mt-5 rounded-md py-8 bg-gray-600">
              Please Sign In User & Try Uploading Videos
            </div>
          )
          }
        </div>
      </div>
    </>
  );
}
