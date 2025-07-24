"use client";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { recommendedVideos } from "@/app/common/Rightsidebar";
import Link from "next/link";
import { MainContextProvider } from "../MainContext";
import axiosInstance from "../Components/axioscomponent/axiosinstances";

export default function Searched() {
  let [videos, setvideos] = useState([]);
  let [filtedata, setfilterdata] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  let getdata = async () => {
    let getvideos = await axiosInstance.get(`/video/getallvideos`);

    setvideos(getvideos.data);
  };
  const filteredVideos = videos.filter(
    (item) =>
      item.videotitle.toLowerCase().includes(query.toLowerCase()) ||
      item.uploader.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="p-5 w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Search Results for: <span className="text-blue-400">{query}</span>
      </h2>
      {filteredVideos ? (
        <div className="grid grid-cols-1 items-center gap-6">
          {filteredVideos.map((v, i) => (
            <div
              key={i}
              className="grid p-3 grid-cols-[30%_auto] bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <Link href={`/videopage/${v.id}`}>
                <img
                  className="rounded-lg w-full"
                  src={`http://localhost:5000/${v.thumbnail
                    .replace(/\\/g, "/")
                    .replace(/\//g, "/")}`}
                  alt={v.videotitle}
                />
              </Link>
              <div className="p-5 flex flex-col gap-4">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {v.videotitle}
                  </h5>
                </a>
                <div className="flex gap-2 items-center">
                  <div className="w-18 h-18 rounded-full">
                    <img src={v.videochannel} alt="" className="rounded-full w-full " />
                  </div>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {v.uploader}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No results found.</p>
      )}
    </div>
  );
}
