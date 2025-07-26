'use client'
import { MainContextProvider } from "@/app/MainContext";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";


export default function ChannelPage() {
  let { user } = useContext(MainContextProvider);
  const [points, setPoints] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const fetchPoints = async () => {
    if (user && user.displayName && user.email) {
      try {
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
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points);
        } else {
          setPoints(null);
          console.error(data.message || "Failed to fetch points");
        }
      } catch (error) {
        setPoints(null);
        console.error("Error fetching points:", error);
      }
    }
  };

  const incrementPoints = async (increment = 1) => {
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
            increment: increment,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points);
          console.log(`Points incremented by ${increment}. New total: ${data.points}`);
        } else {
          console.error(data.message || "Failed to increment points");
        }
      } catch (error) {
        console.error("Error incrementing points:", error);
      }
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [user]);


  let handleBannerImageFile=(event)=>{
    let Imagefile=(event.target.files[0])
    if(Imagefile){
      setSelectedFile(Imagefile)
      setPreviewImageUrl(URL.createObjectURL(Imagefile))
      
    }
  }

  // useEffect(()=>{
  //   if(previewImageUrl){
  //     return URL.revokeObjectURL(previewImageUrl)
  //   }
  // },[previewImageUrl])


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
          <p className="mb-3 text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
            {points !== null ? `Points: ${points}` : "Loading points..."}
          </p>
          <button
            onClick={() => incrementPoints(5)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg mb-3 hover:bg-green-700 transition"
          >
            Add 5 Points (Test)
          </button>
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
