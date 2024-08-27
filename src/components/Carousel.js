import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Model } from './Model'

// getting from https://github.com/Popmotion/popmotion/blob/master/packages/popmotion/src/utils/wrap.ts
export const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const sliderVariants = {
  incoming: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    scale: 1.2,
    opacity: 0,
  }),
  active: { x: 0, scale: 1, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    scale: 1,
    opacity: 0.2,
  }),
}

const sliderTransition = {
  duration: 1,
  ease: [0.56, 0.03, 0.12, 1.04],
}

const App = () => {
  const [[imageCount, direction], setImageCount] = useState([0, 0])

  const activeImageIndex = wrap(0, Model.length, imageCount)

  const swipeToImage = (swipeDirection) => {
    setImageCount([imageCount + swipeDirection, swipeDirection])
  }

  const dragEndHandler = (dragInfo) => {
    const draggedDistance = dragInfo.offset.x
    const swipeThreshold = 50
    if (draggedDistance > swipeThreshold) {
      swipeToImage(-1)
    } else if (draggedDistance < -swipeThreshold) {
      swipeToImage(1)
    }
  }

  const skipToImage = (imageId) => {
    let changeDirection
    if (imageId > activeImageIndex) {
      changeDirection = 1
    } else if (imageId < activeImageIndex) {
      changeDirection = -1
    }
    setImageCount([imageId, changeDirection])
  }

  return (
    <>
      <div className="flex flex-col items-center mx-8">
        <div className="relative w-[350px] md:w-[800px] h-[500px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={imageCount}
              style={{
                backgroundImage: `url(${Model[activeImageIndex].cover.src})`
              }}
              custom={direction}
              variants={sliderVariants}
              initial="incoming"
              animate="active"
              exit="exit"
              transition={sliderTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, dragInfo) => dragEndHandler(dragInfo)}
              className="absolute h-full w-full hover:cursor-grab bg-cover bg-no-repeat bg-center will-change-transform"
            />
          </AnimatePresence>
        </div>

        <div className='flex gap-x-4 my-4'>
          <button onClick={() => swipeToImage(-1)}>PREV</button>
          <button onClick={() => swipeToImage(1)}>NEXT</button>
        </div>
      </div>
      <div className="flex justify-center gap-x-2">
        {Model.map((image) => (
          <div
            key={image.id}
            onClick={() => skipToImage(image.id - 1)}
            className="relative h-[120px] w-[90px]"
          >
            <img
              className={`absolute top-0 left-0 h-full w-full object-cover ${
                image.id === activeImageIndex + 1 ? 'blur-sm brightness-50' : null
              }`}
              src={image.cover.src}
              alt="Cover"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default App
