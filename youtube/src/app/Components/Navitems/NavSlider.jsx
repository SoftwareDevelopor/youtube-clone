"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { items } from "./NavItems";
import './NavSlider.css'
export default function NavSlider() {
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        
        }
      }
    ]
  };
 

  return (
    <div className="slider-container">
      <Slider id="navslider" {...settings}>
        {
          items.map((v,i)=>{
            return(
              <div >
          
                  <p className="rounded-4xl text-md bg-[#364153] mx-0.5 py-3 mb-5 text-center">{v.item}</p>
                
              </div>
            )
          })
        }
      
      </Slider>
    </div>
  );
}
