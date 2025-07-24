'use client'
import { explore, mainNavItems, morefromyoutube, secondaryNavItems, settingsItems } from "@/app/common/navitems";
import React from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { MdArrowForwardIos } from "react-icons/md";
import './Drawer.css'
import Link from "next/link";
import { IoMdDownload } from "react-icons/io";

export default function DrawerNav({opennavitems,setopennav}) {
    
  return (
    <>
      <aside
        id="separator-sidebar"
        className={`w-[260px] h-screen fixed top-0 left-0 transition-transform -translate-x-full sm:translate-x-0 ${
          opennavitems == 1 ? "block" : "hidden"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex items-center gap-7 bg-black px-5">
          <HiOutlineBars3
            className="text-3xl cursor-pointer"
            onClick={() => setopennav(0)}
          />
          <img src="/images/photo.png" alt="" className="w-20" />
        </div>
        <div className="px-3 overflow-y-scroll max-h-screen bg-black dark:bg-blend-darken drawernav">
          {/* <img src={image} alt="" /> */}

          <ul className=" font-medium">
            {mainNavItems.map((items, index) => {
              let Icon = items.icon;
              return (
                <li key={index}>
                  <Link
                    href={`${items.url}`}
                    className="flex items-center p-2 gap-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Icon className="text-2xl" />
                    {items.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li className="text-2xl flex items-center gap-8">
              You <MdArrowForwardIos />
            </li>
            <li>
              <Link href="/downloads" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                <span className="text-2xl"><IoMdDownload/></span>
                <span className="ms-3">Downloads</span>
              </Link>
            </li>
            {secondaryNavItems.map((items, index) => {
              let Icon = items.icon;
              return (
                <li key={index}>
                  <Link
                    href={`${items.url}`}
                    className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                  >
                    <Icon className="text-2xl" />
                    <span className="ms-3">{items.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li className="text-2xl flex items-center gap-8">Explore</li>

            {explore.map((items, index) => {
              let Icon = items.icon;
              return (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                  >
                    <Icon className="text-2xl" />
                    <span className="ms-3">{items.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li className="text-2xl flex items-center gap-8">
              More From Youtube
            </li>

            {morefromyoutube.map((items, index) => {
              let Icon = items.icon;
              return (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                  >
                    <Icon className="text-2xl text-red-600" />
                    <span className="ms-3">{items.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li className="text-2xl flex items-center gap-8">
              More From Youtube
            </li>

            {settingsItems.map((items, index) => {
              let Icon = items.icon;
              return (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                  >
                    <Icon className="text-2xl " />
                    <span className="ms-3">{items.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <ul className="flex flex-wrap gap-3 p-3">
            <li>About</li>
            <li>Press</li>
            <li>CopyRight </li>
            <li>Contact Us</li>
            <li>Creator</li>
            <li>Advertise</li>
            <li>Developers</li>
            <li>Terms</li>
            <li>Privacy</li>
            <li>Policy&Safety</li>
            <li>How YouTube Works</li>
            <li>Test new Features</li>
          </ul>
        </div>
      </aside>
    </>
  );
}
