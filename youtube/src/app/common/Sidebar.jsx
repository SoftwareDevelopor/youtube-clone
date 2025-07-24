"use client";
import React from "react";

import Link from "next/link";
import { mainNavItems } from "./navitems";

export default function Sidebar() {
  return (
    <>
      <div className="fixed bottom-0 lg:hidden xl:hidden 2xl:hidden left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {mainNavItems.map((v, i) => {
            let Icon = v.icon;
            return (
              <Link href={v.url} key={i} className="flex items-center justify-center gap-5">
                <button
                  key={i}
                  type="button"
                  className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                >
                  <Icon />
                  <h1>{v.label}</h1>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className=" lg:block md:hidden sm:hidden hidden">
        {mainNavItems.map((items, index) => {
          const IconComponent = items.icon;
          return (
            <div
              className="py-2.5 px-1.5 mt-5 group rounded-lg hover:bg-[#31313153]"
              key={index}
            >
              <Link
                href={items.url}
                className="flex gap-2 flex-col items-center-safe"
              >
                <IconComponent className="text-3xl" />
                {items.label}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
