import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Head from 'next/head'

import ArrowRight from 'assets/svg/arrow_right.svg'

import Image from 'components/Image'
import PackageInfo from 'components/PackageInfo'
import Contact from 'components/Contact'
import Footer from 'components/Footer'

import { Model } from 'components/Model'

const BigHeading = styled.h1`
  font-size: 7vw;
  line-height: 7vw;
`

export default function WorkPage() {
  const router = useRouter()
  const { pid } = router.query
  const [model, setModel] = useState(null)

  useEffect(() => {
    setModel(Model[pid - 1])
  }, [pid])

  if (model == null) {
    return null
  }

  return (
    <>
      <Head>
        <title>{model.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

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

      <div className="mt-8 flex h-screen overflow-hidden">
        <div className="hidden sm:block bg-gray8 w-full sm:w-3/4">
          {model && <Image src={model.images[0].src} alt="picture 1" />}
        </div>
        <div className="flex justify-center items-center w-full relative">
          <div className="absolute left-4 top-4">
            <Image src={ArrowRight} alt="logo" />
          </div>

          <div className="text-center">
            <BigHeading>{model.name}</BigHeading>
            <p className="mt-8 text-2xl">{model.location}</p>
          </div>
        </div>
      </div>

      {model && (
        <PackageInfo
          description={model.description}
          packages={model.package}
          img={model.images[1]}
          tag={model.tag}
        />
      )}

      <div className="mt-24 sm:mt-48 flex flex-wrap justify-between px-4">
        <div className="w-full sm:w-1/4 pr-2 md:pr-12 lg:pr-24">
          {model && <Image src={model.images[3].src} alt="picture 4" />}
          <div className="flex justify-between items-center">
            {model && <h4 className="text-sm">{model.images[3].detail}</h4>}
            <span className="text-xs">{model.tag}</span>
          </div>
        </div>
        <div className="w-full sm:w-3/4 pl-2 md:pl-24 mt-48">
          {model && <Image src={model.images[2].src} alt="picture 3" />}
          <div className="flex justify-between items-center">
            {model && <h4 className="text-sm">{model.images[2].detail}</h4>}
            <span className="text-xs">{model.tag}</span>
          </div>
        </div>
      </div>

      <div className="my-24 sm:my-48 px-4">
        <div className="w-full sm:w-3/4 mx-auto">
          {model && <Image src={model.images[4].src} alt="picture 5" />}
          <div className="flex justify-between items-center">
            {model && <h4 className="text-sm">{model.images[4].detail}</h4>}
            <span className="text-xs">{model.tag}</span>
          </div>
        </div>
      </div>

      {model && model.images[5] && (
        <div className="my-24 sm:my-48 px-4">
          <div className="w-full sm:w-3/4 mx-auto">
            {model && <Image src={model.images[5].src} alt="picture 5" />}
            <div className="flex justify-between items-center">
              {model && <h4 className="text-sm">{model.images[5].detail}</h4>}
              <span className="text-xs">{model.tag}</span>
            </div>
          </div>
        </div>
      )}

      <Contact />

      <Footer />
    </>
  )
}
