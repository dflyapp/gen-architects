import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import Cover1 from "assets/img/cover1.jpg";
import Cover2 from "assets/img/cover2.jpg";
import Cover3 from "assets/img/cover3.jpg";
import Cover4 from "assets/img/cover4.jpg";
import Cover5 from "assets/img/cover5.jpg";
import Cover6 from "assets/img/cover6.jpg";

// import required modules
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
