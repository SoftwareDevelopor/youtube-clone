"use client";
import React, { createContext, useEffect, useState } from "react";

export let MainContextProvider = createContext();
export default function MainContext({ children }) {
  // Downloads state
  let [downloads, setDownloads] = useState([]);
  let [token, settoken] = useState("");
  let [user, setuser] = useState(null);
  let [isSubscribed, setisSubscribed] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDownloads = localStorage.getItem("DOWNLOADS");
      if (storedDownloads) setDownloads(JSON.parse(storedDownloads));
      const storedToken = localStorage.getItem("TOKEN");
      if (storedToken) settoken(storedToken);
      const storedUser = localStorage.getItem("USER");
      if (storedUser) setuser(JSON.parse(storedUser));
      const storedSub = localStorage.getItem("Subscription");
      if (storedSub) setisSubscribed(storedSub === "true" || storedSub === true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("DOWNLOADS", JSON.stringify(downloads));
    }
  }, [downloads]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("USER", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("TOKEN", token);
    }
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("Subscription", isSubscribed);
    }
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
