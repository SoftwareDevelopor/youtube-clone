"use client";
import { MainContextProvider } from "@/app/MainContext";
import React, { useContext } from "react";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Liked_Video() {
  let { likedvideo, setlikedvideo } = useContext(MainContextProvider);

  return (
    <div className="p-5 w-full overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 text-white">Liked Videos</h2>
      {likedvideo.map((v, i) => {
        return (
          <div className="grid grid-cols-1 gap-6" key={i}>
            <Link href={`/videopage/${v.id}`}>
              <div className="grid grid-cols-[30%_auto] gap-5 relative group hover:bg-gray-800 p-3 rounded-xl">
                <img
                  src={v.thumbnail}
                  alt=""
                  width={"100%"}
                  className="rounded-xl"
                />
                <div className="flex flex-col gap-3 my-6">
                  <h1 className="text-xl">{v.title}</h1>
                  <span className="flex gap-2 items-center">
                    <p>{v.channel}</p>
                    <p>.</p>
                    <p>{v.views}</p>
                    <p>{v.duration}</p>
                  </span>
                </div>
                <div className="absolute top-2/4 right-5 translate-y-1/2">
                  <BsThreeDotsVertical />
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
