import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'

import Cover1 from 'assets/img/cover1.jpg'
import Cover2 from 'assets/img/cover2.jpg'
import Cover3 from 'assets/img/cover3.jpg'
import Cover4 from 'assets/img/cover4.jpg'
import Cover5 from 'assets/img/cover5.jpg'
import Cover6 from 'assets/img/cover6.jpg'

export default function Sliders() {
  useEffect(async () => {
    const Flickity = await import('flickity/dist/flickity.pkgd')
    console.log(Flickity)
    const elem = document.querySelector('.main-carousel')
    const flkty = new Flickity.default(elem, {
      // options
      cellAlign: 'left',
      contain: true,
      height: '160px',
      freeScroll: true,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
    })

    // $(".main-carousel").flickity({
    //   // options
    //   cellAlign: "left",
    //   contain: true,
    // });
  }, [])

  const belowText = useRef()
  useEffect(() => {
    gsap.fromTo(belowText.current, { y: 50 }, { duration: 0.5, y: 0 })
  })

  return (
    <div className="sliders-wrapper">
      <div className="main-carousel">
        <Link href="/work/1" className="carousel-cell mx-4">
          <div>
            <Image
              height={400}
              width={500}
              placeholder="blur"
              src={Cover1}
              alt="cover 1"
            />
            <h1 ref={belowText}>below text</h1>
          </div>
        </Link>
        <div className="carousel-cell mx-">
          <Image
            height={400}
            width={500}
            placeholder="blur"
            src={Cover2}
            alt="cover 2"
          />
          <h1 ref={belowText}>below text</h1>
        </div>
        <div className="carousel-cell mx-">
          <Image
            height={400}
            width={500}
            placeholder="blur"
            src={Cover3}
            alt="cover 3"
          />
          <h1 ref={belowText}>below text</h1>
        </div>
        <div className="carousel-cell mx-">
          <Image
            height={400}
            width={500}
            placeholder="blur"
            src={Cover4}
            alt="cover 4"
          />
          <h1 ref={belowText}>below text</h1>
        </div>
        <div className="carousel-cell mx-">
          <Image
            height={400}
            width={500}
            placeholder="blur"
            src={Cover5}
            alt="cover 5"
          />
          <h1 ref={belowText}>below text</h1>
        </div>
        <div className="carousel-cell mx-">
          <Image
            height={400}
            width={500}
            placeholder="blur"
            src={Cover6}
            alt="cover 6"
          />
          <h1 ref={belowText}>below text</h1>
        </div>
      </div>
    </div>
  )
}
