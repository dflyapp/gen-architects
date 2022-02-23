import React, { useRef, useState } from "react";
import Link from 'next/link'
import Slider from "react-slick";
// import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Cover1 from "assets/img/cover1.jpg";
import Cover2 from "assets/img/cover2.jpg";
import Cover3 from "assets/img/cover3.jpg";
import Cover4 from "assets/img/cover4.jpg";
import Cover5 from "assets/img/cover5.jpg";
import Cover6 from "assets/img/cover6.jpg";

import styles from './Sliders.module.css'

export default function Sliders() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };
  return (
    <div class="carousel">
      <Slider {...settings}>
        <div className={styles.slider}>
          <Link href="/work/1">
            <Image placeholder="blur" src={Cover2} alt="cover 2" />
          </Link>
          <div className="flex justify-between">
            <h4>Conversation</h4>
            <h5>West Hall</h5>
          </div>
          <div className="absolute right-0 top-0">
            <span className="rotate-90">GEN 31---219</span>
          </div>
        </div>
        <div className={styles.slider}>
          <Image placeholder="blur" src={Cover3} alt="cover 3" />
        </div>
        <div className={styles.slider}>
          <Image placeholder="blur" src={Cover4} alt="cover 4" />
        </div>
        <div className={styles.slider}>
          <Image placeholder="blur" src={Cover5} alt="cover 5" />
        </div>
        <div className={styles.slider}>
          <Image placeholder="blur" src={Cover6} alt="cover 6" />
        </div>
        <div className={styles.slider}>
          <Image placeholder="blur" src={Cover1} alt="cover 1" />
        </div>
      </Slider>
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
