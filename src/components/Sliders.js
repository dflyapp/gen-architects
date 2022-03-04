import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import gsap from 'gsap'

import { Model } from './Model'

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

    flkty.on('pointerMove', function () {
      setIsDragging(true)
    })
  }, [])

  const belowText = useRef()
  const [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    gsap.fromTo(belowText.current, { y: 50 }, { duration: 0.5, y: 0 })
  })

  return (
    <div className="mt-8 sliders-wrapper">
      <div className="main-carousel">
        {Model.map((e) => {
          return (
            <div
              className="carousel-cell px-12"
              key={e.id}
              onClick={(event) => {
                console.log('i am click or drag: ', isDragging)
                if (!isDragging) {
                  // router.push(`/work/${e.id}`)
                  router.push({
                    pathname: '/work/[pid]',
                    query: { pid: e.id },
                  })
                }
              }}
            >
              <div className="relative">
                <Image
                  height={400}
                  width={500}
                  src={e.cover}
                  alt="cover image"
                />
                <span
                  className="absolute -right-14 top-0 text-sm"
                  style={{ transform: 'rotate(90deg)' }}
                >
                  {e.tag}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <h4 className="text-md font-light">{e.name}</h4>
                <h5 className="text-sm">{e.category}</h5>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
