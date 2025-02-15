import { motion } from 'framer-motion'

import Head from 'next/head'
import LogoPicture from 'assets/svg/logo_picture.svg'
import Carousel from 'components/Carousel'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Gen Architects</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="w-screen h-screen relative overflow-x-hidden">
        <header className="flex justify-between p-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a className="text-2xl">Gallery</a>
            <span className="mx-2">/</span>
            <a className="text-2xl opacity-60">Index</a>
          </motion.div>
          <div>
            <a className="text-2xl">Menu</a>
          </div>
        </header>

        <div className="px-8">
          <hr />
        </div>

        <section className="flex flex-col gap-y-2 h-full justify-between p-8 pb-48">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              style={{ width: 80, height: 'auto' }}
              src={LogoPicture.src}
              alt="gen"
            />
          </motion.div>
          <Carousel />
        </section>
      </div>
    </div>
  )
}
