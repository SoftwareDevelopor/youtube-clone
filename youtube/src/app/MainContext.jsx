"use client";
import React, { createContext, useEffect, useState } from "react";

export let MainContextProvider = createContext();
export default function MainContext({ children }) {

  

  // Downloads state
  let [downloads, setDownloads] = useState(
    localStorage.getItem("DOWNLOADS")
      ? JSON.parse(localStorage.getItem("DOWNLOADS"))
      : []
  );

  useEffect(() => {
    localStorage.setItem("DOWNLOADS", JSON.stringify(downloads));
  }, [downloads]);

  let [token, settoken] = useState(localStorage.getItem("TOKEN") ?? "");
  let [user, setuser] = useState(
    localStorage.getItem("USER")
      ? JSON.parse(localStorage.getItem("USER"))
      : null
  );

  useEffect(() => {
    localStorage.setItem("USER", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("TOKEN", token);
  }, [token]);

  let [isSubscribed, setisSubscribed] = useState(
    localStorage.getItem("Subscription") ?? false
  );
  useEffect(() => {
    localStorage.setItem("Subscription", isSubscribed);
  }, [isSubscribed]);

  

  let obj = {
    user,
    token,
    settoken,
    setuser,
    isSubscribed,
    setisSubscribed,
    downloads,
    setDownloads
  };

  return (
    <>
      <MainContextProvider.Provider value={obj}>
        {children}
      </MainContextProvider.Provider>
    </>
  );
}
