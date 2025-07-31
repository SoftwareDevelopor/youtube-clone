import Link from "next/link";
import React from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import DrawerNav from "./DrawerNav";

export default function Drawer({opensidebar,setopensidebar}) {
    
  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
        <button
          type="button"
          onClick={() => setopensidebar(opensidebar == 0 ? 1 : 0)}
          className="p-1 sm:p-1.5 md:p-2 lg:p-2.5 xl:p-3 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <HiOutlineBars3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-gray-700 dark:text-gray-300" />
        </button>
        <Link href={"/"} className="flex-shrink-0">
          <img
            src="https://www.gstatic.com/youtube/img/promos/growth/9b1975f702157ee1185549e8e802d1ec8ed71c8cff6bc88b3b36bea06c06c9ba_122x56.webp"
            alt="Youtube"
            className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto object-contain"
          />
        </Link>
      </div>

      <DrawerNav opennavitems={opensidebar} setopennav={setopensidebar}/>
    </>
  );
}
