import { FaGoogle, FaRegKeyboard } from "react-icons/fa";
import {
  MdOutlineSwitchAccount,
  MdOutlineHelpOutline,
  MdOutlineSettings,
  MdOutlineFeedback,
} from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import { SiYoutubestudio } from "react-icons/si";
import { LuCircleDollarSign } from "react-icons/lu";
import { RiShieldUserLine } from "react-icons/ri";
import { CiDark } from "react-icons/ci";
import { IoLanguageSharp } from "react-icons/io5";
import { FiGlobe } from "react-icons/fi";

export let a = [
  {
    id: 1, 
    name: "Google",
    icon: FaGoogle,
    url: "https://accounts.google.com/"
  },
  {
    id: 2,
    name: "Switch  Account",
    icon: MdOutlineSwitchAccount ,
    url: "https://accounts.google.com/AccountChooser?continue=https://www.google.com/&service=accountsettings&flowName=GlifWebSignIn&flowEntry=AccountChooser&hl=en"
  },
  {
    id: 3,
    name: "Sign Out",
    icon: IoIosLogIn ,
    url: "https://accounts.google.com/Logout?continue=https://www.google.com/"
  }
];

export let b = [
  {
    id: 1,
    name: "YouTube Studio",
    icon: SiYoutubestudio,
    url: "https://studio.youtube.com/"
  },
  {
    id: 2,
    name: "Purchase and Memberships",
    icon: LuCircleDollarSign,
    url: "https://www.youtube.com/purchases"
  }
];

export let c = [
  {
    id: 1,
    name: "Your Data in YouTube",
    icon: RiShieldUserLine,
    url: "https://activity.google.com/item?utm_source=activity&contentId=activity-YouTube&hl=en"
  },
  {
    id: 2,
    name: "Appearance: ",
    icon: CiDark,
    url: ""
  },
  {
    id: 3,
    name: "Language: ",
    icon: IoLanguageSharp,
    url: ""
  },
  {
    id: 4,
    name: "Restricted Mode: ",
    icon: RiShieldUserLine,
    url: ""
  },
  {
    id: 5,
    name: "Location: ",
    icon: FiGlobe,
    url: ""
  },
  {
    id: 6,
    name: "Keyboard Shortcuts",
    icon: FaRegKeyboard,
    url: ""
  }
];

export let d = [{
  id: 1,
  name: "Settings",
  icon: MdOutlineSettings,
  url: "https://www.youtube.com/account"
}]


export let e = [
  {
    id: 1,
    name: "Help",
    icon: MdOutlineHelpOutline ,
    url: "https://support.google.com/youtube/?hl=en#topic=9257498"
  },
  {
    id: 2,
    name: "Send Feedback",
    icon: MdOutlineFeedback ,
    url: "https://support.google.com/youtube/?hl=en#topic=9257498"
  }
];


