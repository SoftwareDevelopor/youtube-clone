import Link from "next/link";
import React from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import DrawerNav from "./DrawerNav";

export default function Drawer({opensidebar,setopensidebar}) {
    
  return (
    <>
      <div className="flex lg:gap-2  gap-[0.5px] items-center">
        <button
          type="button"
          onClick={() => setopensidebar(opensidebar == 0 ? 1 : 0)}
          className="lg:p-2 p-[0.5px] rounded-full cursor-pointer"
        >
          <HiOutlineBars3 className="text-2xl text-gray-700 dark:text-gray-300" />
        </button>
        <Link href={"/"}>
          <img
            src="https://www.gstatic.com/youtube/img/promos/growth/9b1975f702157ee1185549e8e802d1ec8ed71c8cff6bc88b3b36bea06c06c9ba_122x56.webp"
            alt="Youtube"
            className="w-25"
          />
        </Link>
      </div>

      <DrawerNav opennavitems={opensidebar} setopennav={setopensidebar}/>
    </>
  );
}
