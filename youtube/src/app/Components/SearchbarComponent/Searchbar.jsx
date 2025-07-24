'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";

export default function Searchbar() {
  const router = useRouter();
  const [searchquery, setsearchquery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchquery) {
      router.push(`/searched?q=${searchquery}`);
    }
  };

  return (
    <>





      <div className=" gap-2 items-center mx-auto lg:flex sm:hidden md:hidden hidden">
        <form
          onSubmit={handleSearch}
          className="flex border border-gray-300 dark:border-gray-600 items-center rounded-full bg-white dark:bg-gray-800"
        >
          <input
            type="text"
            name="Search"
            id="searchbox"
            onChange={(e) => setsearchquery(e.target.value)}
            value={searchquery}
            className="w-[550px] py-1.5 ps-3 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Search"
          />

          <button
            type="submit"
            className="py-2 px-6 rounded-r-full bg-gray-100 dark:bg-gray-700 border-l border-gray-300 dark:border-gray-600 cursor-pointer"
          >
            <IoSearch className="text-2xl text-gray-600 dark:text-gray-400" />
          </button>
        </form>
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex justify-center items-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <AiFillAudio className="text-2xl text-gray-600 dark:text-gray-400" />
        </div>
      </div>
    </>
  );
}
