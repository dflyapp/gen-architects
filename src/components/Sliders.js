import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import gsap from "gsap";

import Cover1 from "assets/img/cover1.jpg";
import Cover2 from "assets/img/cover2.jpg";
import Cover3 from "assets/img/cover3.jpg";
import Cover4 from "assets/img/cover4.jpg";
import Cover5 from "assets/img/cover5.jpg";
import Cover6 from "assets/img/cover6.jpg";

import * as $ from "jquery";

// const DynamicComponent = dynamic(() => {
//   if (typeof window !== "undefined") {
//     import("flickity/dist/flickity.pkgd")
//   }
// })

export default function Sliders() {
  useEffect(async () => {
    const Flickity = await import("flickity/dist/flickity.pkgd");
    console.log(Flickity);
    const elem = document.querySelector(".main-carousel");
    const flkty = new Flickity.default(elem, {
      // options
      cellAlign: "left",
      contain: true,
      height: "160px",
    });

    // $(".main-carousel").flickity({
    //   // options
    //   cellAlign: "left",
    //   contain: true,
    // });
  }, []);

  const belowText = useRef();
  useEffect(() => {
    gsap.fromTo(belowText.current, { y: 50 }, { duration: 0.5, y: 0 });
  });

  return (
    <div>
      <div className="main-carousel">
        <div className="carousel-cell">
          <h1 ref={belowText}>below text</h1>
          <Image placeholder="blur" src={Cover1} alt="cover 1" />
        </div>
        <div className="carousel-cell">
          <Image placeholder="blur" src={Cover2} alt="cover 2" />
        </div>
        <div className="carousel-cell">
          <Image placeholder="blur" src={Cover3} alt="cover 3" />
        </div>
      </div>

    </div>
  );
}

/*
import { Pagination } from "swiper";

export default function Sliders() {
  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={100}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
        navigation={false}
      >
        <SwiperSlide>
          <Image placeholder="blur" src={Cover1} alt="cover 1" />
        </SwiperSlide>
        <SwiperSlide>
          <Image placeholder="blur" src={Cover2} alt="cover 2" />
        </SwiperSlide>
        <SwiperSlide>
          <Image placeholder="blur" src={Cover3} alt="cover 3" />
        </SwiperSlide>
        <SwiperSlide>
          <Image placeholder="blur" src={Cover4} alt="cover 4" />
        </SwiperSlide>
        <SwiperSlide>
          <Image placeholder="blur" src={Cover5} alt="cover 5" />
        </SwiperSlide>
        <SwiperSlide>
          <Image placeholder="blur" src={Cover6} alt="cover 6" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
*/