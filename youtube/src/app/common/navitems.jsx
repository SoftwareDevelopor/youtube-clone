import {
    AiOutlineFlag,
    AiOutlineHistory,
    AiOutlineHome,
    AiOutlineLike,
    AiOutlineQuestionCircle,
    AiOutlineSetting,
    AiOutlineTrophy,
  } from "react-icons/ai";
  import {
    SiYoutubegaming,
    SiYoutubekids,
    SiYoutubemusic,
    SiYoutubeshorts,
    SiYoutubestudio,
  } from "react-icons/si";
  import { BiLogoYoutube, BiTrendingUp } from "react-icons/bi";
  import { RiGraduationCapLine } from "react-icons/ri";
  import { HiShoppingBag } from "react-icons/hi2";
  import { PiFilmSlateBold } from "react-icons/pi";
  import { GoVideo } from "react-icons/go";
  import {
    MdLibraryMusic,
    MdLiveTv,
    MdNewspaper,
    MdOutlineAccountCircle,
    MdOutlineFeedback,
    MdOutlinePodcasts,
    MdOutlineSubscriptions,
    MdOutlineWatchLater,
    MdPlaylistPlay,
  } from "react-icons/md";

let mainNavItems = [
    { id: "home", label: "Home", icon: AiOutlineHome, url: '/' },
    { id: "shorts", label: "Shorts", icon: SiYoutubeshorts, url: '/shorts'},
    { id: "subscriptions", label: "Subscriptions", icon: MdOutlineSubscriptions, url: '/subscription' },
    { id: "you", label: "You", icon: MdOutlineAccountCircle, url: '/feed/you' }
  ];

  let secondaryNavItems = [
    { id: "history", label: "History", icon: AiOutlineHistory, url: '/feed/history' },
    { id: "playlist", label: "Playlist", icon: MdPlaylistPlay, url: '/feed/playlist' },
    { id: "your-videos", label: "Your videos", icon: GoVideo, url: 'https://studio.youtube.com/channel' },
    { id: "your-courses", label: "Your Courses", icon: RiGraduationCapLine, url: '/feed/courses' },
    { id: "watch-later", label: "Watch later", icon: MdOutlineWatchLater, url: '/feed/wl' },
    { id: "liked-videos", label: "Liked videos", icon: AiOutlineLike, url: '/feed/lv' },
  ];

  let explore = [
    { id: "trending", label: "Trending", icon: BiTrendingUp },
    { id: "shopping", label: "Shopping", icon: HiShoppingBag },
    { id: "music", label: "Music", icon: MdLibraryMusic },
    { id: "films", label: "Films", icon: PiFilmSlateBold },
    { id: "live", label: "Live", icon: MdLiveTv },
    { id: "gaming", label: "Gaming", icon: SiYoutubegaming },
    { id: "news", label: "News", icon: MdNewspaper },
    { id: "sports", label: "Sports", icon: AiOutlineTrophy },
    { id: "podcasts", label: "Podcasts", icon: MdOutlinePodcasts },
  ];

  let morefromyoutube = [
    { id: "youtubepremium", label: "Youtube Premium", icon: BiLogoYoutube },
    { id: "youtubestudio", label: "Youtube Studio", icon: SiYoutubestudio },
    { id: "youtubemusic", label: "Youtube Music", icon: SiYoutubemusic },
    { id: "youtubekids", label: "Youtube Kids", icon: SiYoutubekids },
  ];
  let settingsItems = [
    { id: "settings", label: "Settings", icon: AiOutlineSetting },
    { id: "report", label: "Report history", icon: AiOutlineFlag },
    { id: "help", label: "Help", icon: AiOutlineQuestionCircle },
    { id: "feedback", label: "Send feedback", icon: MdOutlineFeedback },
  ];

  export {mainNavItems,secondaryNavItems,settingsItems,morefromyoutube, explore}