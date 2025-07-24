'use client'

import React, { useState} from 'react'
import Drawer from '../DrawerComponent/Drawer';
import Searchbar from '../SearchbarComponent/Searchbar';
import Auth from '../AuthComponent/Auth';



export default function HomePage() {
    // const [filteredVideos, setFilteredVideos] = useState(recommendedVideos);
    const [opensidebar, setopensidebar] = useState(0);
  
    // const handleSearch = useCallback((query) => {
    //   if (!query) {
    //     setFilteredVideos(recommendedVideos);
    //   } else {
    //     setFilteredVideos(
    //       recommendedVideos.filter(
    //         (item) =>
    //           item.title.toLowerCase().includes(query.toLowerCase()) ||
    //           item.channel.toLowerCase().includes(query.toLowerCase())
    //       )
    //     );
    //   }
    // }, []);
  
    // useEffect(() => {
    //   setFilteredVideos(recommendedVideos);
    // }, []);
  return (
    <>
     
            <div className="flex gap-3 px-7 py-1.5 sticky top-0 z-50 bg-black items-center justify-between">
              <Drawer
                opensidebar={opensidebar}
                setopensidebar={setopensidebar}
              />
              <Searchbar />
              <Auth />
            </div>

            {/* <div className="w-full flex justify-center py-4 bg-black sticky top-0 z-10">
        <Searchbar  />
      </div> */}
          
    </>
  )
}
