"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";

export default function Livepage() {
  const [roomId, setRoomId] = useState("");
    let router=useRouter()
  const joinRoom = (e) => {
    if (roomId) {
      router.push(`/call/${roomId}`);
      console.log(roomId)
    } else {
      alert("Please enter a room ID.");
    }
    e.preventDefault()
  };
  return (
    <div className="p-[50px] text-center fixed left-[50%] top-[50%] -translate-1/2 max-w-full">
      <h1>Join a Video Call Room</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2.5 text-lg mr-2.5"
      />
      <button
        onClick={joinRoom}
        className="py-2.5 px-5 text-lg"
      >
        Join
      </button>
    </div>
  );
}
