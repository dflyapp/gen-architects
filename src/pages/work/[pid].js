import Link from 'next/link'
import Image from 'components/Image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import LogoPicture from 'assets/svg/logo_picture.svg'

import Detail1 from 'components/Detail1'
import Contact from 'components/Contact'
import Footer from 'components/Footer'

import { Model } from 'components/Model'

export default function WrokPage() {
  const router = useRouter()
  const { pid } = router.query
  console.log(Model[pid - 1], pid)
  const [model, setModel] = useState(null)

  useEffect(() => {
    setModel(Model[pid - 1])
  }, [pid])

  if (model == null) {
    return null
  }

  return (
    <>
      <header className="flex justify-between p-8">
        <Link href="/">
          <div className="flex flex-wrap items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6"
              viewBox="0 0 27.197 23.217"
            >
              <g
                data-name="Group 116"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  data-name="Path 1"
                  d="M12.314 22.51l-10.9-10.9 10.9-10.9"
                ></path>
                <path data-name="Path 2" d="M1.414 11.609h25.783"></path>
              </g>
            </svg>
            <span className="text-2xl block ml-3 cursor-pointer">
              All Projects
            </span>
          </div>
        </Link>
        <div>
          <a className="text-2xl">Menu</a>
        </div>
      </header>

      <div className="px-8">
        <hr />
      </div>

      <div className="mt-8 flex">
        <div className="hidden sm:block bg-gray8" style={{ width: '800px', height: '700px' }}>
          {model && <Image src={model.images[0].src} alt="picture 1" />}
        </div>
        <div className="flex justify-center items-center w-full relative">
          <div className="hidden sm:block absolute left-4 top-4">
            <Image src={LogoPicture} alt="logo" />
          </div>

          <div className="text-center">
            <h1 className="text-5xl">{model.name}</h1>
            <p>{model.location}</p>
          </div>
        </div>
      </div>

      <Detail1 description={model.description} packages={model.package} />

      <div className="mt-24 sm:mt-48 flex flex-wrap justify-between px-4">
        <div className="w-full sm:w-1/4 pr-2 md:pr-12 lg:pr-24">
          {model && <Image src={model.images[3].src} alt="picture 4" />}
          <div className="flex justify-between items-center">
            {model && <h4 className='text-sm'>{model.images[3].detail}</h4>}
            <span className='text-xs'>{model.tag}</span>
          </div>
        </div>
        <div className="w-full sm:w-3/4 pl-2 md:pl-24 mt-48">
          {model && <Image src={model.images[2].src} alt="picture 3" />}
          <div className="flex justify-between items-center">
            {model && <h4 className='text-sm'>{model.images[2].detail}</h4>}
            <span className='text-xs'>{model.tag}</span>
          </div>
        </div>
      </div>

      <div className="my-24 sm:my-48 px-4">
        <div className="w-full sm:w-3/4 mx-auto">
          {model && <Image src={model.images[4].src} alt="picture 5" />}
          <div className="flex justify-between items-center">
            {model && <h4 className='text-sm'>{model.images[4].detail}</h4>}
            <span className='text-xs'>{model.tag}</span>
          </div>
        </div>
      </div>

      <Contact />

      <Footer />
    </>
  )
}
