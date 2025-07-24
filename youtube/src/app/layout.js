
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import MainContext from "./MainContext";
import HomePage from "./Components/HomeComponent/HomePage";
import Sidebar from "./common/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <MainContext>
          <div className="pt-2">
            <HomePage/>
            <div className="grid lg:grid-cols-[6%_auto] gap-9">
              <Sidebar/>
              {children}
            </div>
          </div>
      
        </MainContext>
      </body>
    </html>
  );
}
