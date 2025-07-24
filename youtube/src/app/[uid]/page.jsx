'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import ChannelPage from '../Components/UserChannelPageComponent/ChannelPage';

export default function UserChannelPage() {
  const { uid } = useParams();
   
  return <ChannelPage/>;
} 