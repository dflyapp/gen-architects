import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import gsap from 'gsap'

import Cover1 from 'assets/img/cover1.jpg'
import Cover2 from 'assets/img/cover2.jpg'
import Cover3 from 'assets/img/cover3.jpg'
import Cover4 from 'assets/img/cover4.jpg'
import Cover5 from 'assets/img/cover5.jpg'
import Cover6 from 'assets/img/cover6.jpg'

export default function Sliders() {
  const router = useRouter()
  useEffect(async () => {
    const Flickity = await import('flickity/dist/flickity.pkgd')
    const elem = document.querySelector('.main-carousel')
    const flkty = new Flickity.default(elem, {
      cellAlign: 'left',
      contain: true,
      height: '160px',
      freeScroll: true,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
    })

    flkty.on('pointerDown', function () {
      setIsDragging(false)
    })

    flkty.on( 'pointerMove', function() {
      setIsDragging(true)
    });
  }, [])

  const belowText = useRef()
  const [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    gsap.fromTo(belowText.current, { y: 50 }, { duration: 0.5, y: 0 })
  })

  return (
    <div className="mt-8 sliders-wrapper">
      <div className="main-carousel">
        {[Cover1, Cover2, Cover3, Cover4, Cover5, Cover6].map((e) => {
          return (
            <div
              className="carousel-cell"
              key={e}
              onClick={(event) => {
                console.log("i am click or drag: ", isDragging)
                if (!isDragging) {
                  router.push('/work/1')
                }
              }}
            >
              <Image height={400} width={500} src={e} alt="cover 1" />
              <div className="flex justify-between items-center">
                <h4>Is the commit</h4>
                <h5>Towl Hall</h5>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
