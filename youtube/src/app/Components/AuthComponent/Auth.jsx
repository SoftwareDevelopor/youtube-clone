'use client'

import { MainContextProvider } from "@/app/MainContext";
import React, { useContext, useState } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/app/FirebaseConfig";
import { HiOutlinePlus, HiOutlineUserCircle, HiSignal } from "react-icons/hi2";
import { MdNotificationsNone } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { a, b, c, d, e } from "./AuthData";
import { CiYoutube } from "react-icons/ci";
import {RxPencil2} from 'react-icons/rx'
export default function Auth() {
  let { user, token, settoken, setuser } = useContext(MainContextProvider);

  let [openmodal, setopenmodal] = useState(false);

  let [visible,setvisible]=useState(false)

  let googlelogin = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        settoken(token);
        setuser(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <div className="lg:py-2 lg:px-4 px-2 rounded-4xl bg-[#2b2b2b] flex items-center justify-center lg:gap-3 gap-1.5 relative" onClick={()=>setvisible(visible==false ? true : false)}>
            <HiOutlinePlus className="lg:text-2xl text-sm text-white" />
            <button type="button" className="lg:text-2xl text-sm text-white cursor-pointer">
              Create
            </button>
            <div className={`absolute top-full lg:left-0 right-0 rounded-xl p-4 bg-[#2b2b2b] text-xl w-[200px] flex flex-col gap-3.5 ${visible==true ? "block" : "hidden"} `}>
              <div className="flex gap-2.5 items-center">
                <CiYoutube />
                <Link href="/upload">
                  <span>Upload Video</span>
                </Link>
              </div>
              <div className="flex gap-2.5 items-center">
                <HiSignal />
                <Link href="/live">
                  <span>Live</span>
                </Link>
              </div>
              <div className="flex gap-2.5 items-center">
                <RxPencil2 />
                <Link href="/post">
                  <span>Create Post</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            <MdNotificationsNone className="text-white text-4xl" />
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative">
            <img
              src={user.photoURL}
              alt=""
              className="w-full rounded-full cursor-pointer"
              onClick={() => setopenmodal(openmodal === false ? true : false)}
            />
            <div
              className={`absolute bg-[#282828] lg:right-15 left-0 top-5 rounded-xl lg:w-[400px] w-[250px] z-50 ${
                openmodal === true ? "block" : "hidden"
              }`}
            >
              <div className="border-b border-gray-500 py-[13px] flex gap-3 justify-evenly items-center">
                <div className="p-1 w-15 h-15 bg-black rounded-full">
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    {user.displayName}
                  </h1>
                  <Link href={`/${user.uid}`} className="text-blue-800 text-xl">
                    <p className="mt-2">View channel</p>
                  </Link>
                </div>
              </div>
              <div className="h-[570px] overflow-auto">
                <div className="border-b border-gray-600 py-4 flex flex-col">
                  {a.map((item) => {
                    const IconComponent = item.icon;
                    if (item.name === "Sign Out") {
                      return (
                        <button
                          key={item.id}
                          onClick={()=>{
                            settoken("");
                            setuser(null);
                            window.location.href = "/";
                          }}
                          className="flex items-center gap-5 text-xl text-gray-700 dark:text-gray-300 py-3 ps-5 group hover:bg-gray-600 transition-colors w-full text-left"
                        >
                          <IconComponent className="" />
                          <span className="">{item.name}</span>
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.id}
                        href={item.url}
                        className="flex items-center gap-5 text-xl text-gray-700 dark:text-gray-300 py-3 ps-5 group hover:bg-gray-600 transition-colors"
                      >
                        <IconComponent className="" />
                        <span className="">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-b border-gray-600 py-4 flex flex-col">
                  {b.map((i, index) => {
                    let Icon = i.icon;
                    return (
                      <Link
                        href={i.url}
                        key={index}
                        className="flex items-center gap-5 text-xl text-gray-700 dark:text-gray-300 py-3 ps-5 group hover:bg-gray-600 transition-colors"
                      >
                        <Icon />
                        <span>{i.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-b border-gray-600 py-4 flex flex-col">
                  {c.map((item, index) => {
                    let Icon = item.icon;

                    return (
                      <Link
                        href={item.url}
                        key={index}
                        className="flex items-center gap-5 text-xl text-gray-700 dark:text-gray-300 py-3 ps-5 group hover:bg-gray-600 transition-colors"
                      >
                        <Icon />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-b border-gray-600 py-4 flex flex-col">
                  {d.map((item, index) => {
                    let Icon = item.icon;

                    return (
                      <Link
                        href={item.url}
                        key={index}
                        className="flex items-center gap-5 text-xl text-gray-700 dark:text-gray-300 py-3 ps-5 group hover:bg-gray-600 transition-colors"
                      >
                        <Icon />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="py-4 flex flex-col">
                  {e.map((item, index) => {
                    let Icon = item.icon;

                    return (
                      <Link
                        href={item.url}
                        key={index}
                        className="flex items-center gap-5 text-xl text-gray-700 dark:text-gray-300 py-3 ps-5 group hover:bg-gray-600 transition-colors"
                      >
                        <Icon />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <BsThreeDotsVertical className="text-2xl text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={googlelogin}
            type="button"
            className="flex items-center gap-3 rounded-full p-1.5 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
          >
            <HiOutlineUserCircle className="text-xl" />
            <span className="font-semibold">Sign In</span>
          </button>
        </>
      )}
    </div>
  );
}
