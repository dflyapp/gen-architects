import Link from 'next/link'
import Image from 'next/image'

import LogoPicture from 'assets/svg/logo_picture.svg'

import Picture1 from 'assets/img/1/1.jpg'

export default function WrokPage() {
  return (
    <>
      <header className="flex justify-between p-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl">
            All Projects
          </Link>
        </div>
        <div>
          <a className="text-2xl">Menu</a>
        </div>
      </header>

      <div className="px-8">
        <hr />
      </div>

      <div className="mt-8 flex">
        <div className="bg-gray8" style={{ width: '800px', height: '700px' }}>
          <Image src={Picture1} alt="picture 1" />
        </div>
        <div className="flex justify-center items-center w-full relative">
          <div className="absolute left-4 top-4">
            <Image src={LogoPicture} alt="logo" />
          </div>

          <div className="text-center">
            <h1 className="text-5xl">West Hall</h1>
            <p>West Hall</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end bg-gray-800 py-24">
        <div className='w-3/4 px-12'>
          <h1 className="text-white mb-24">
            A comprehensive redevelopment of this former shopping centre, which
            will be transformed from a vacant building to a vibrant skills hub,
            at this important gateway to Worksop town centre, supporting a sense
            of place.
          </h1>
          <div className='border-t-2 border-white text-white p-4 flex items-top'>
            <sub className='mr-2'>01</sub>
            <h3>Site Analysis</h3>
          </div>
          <div className='border-t-2 border-white text-white p-4 flex items-top'>
            <sub className='mr-2'>01</sub>
            <h3>Site Analysis</h3>
          </div>
          <div className='border-t-2 border-white text-white p-4 flex items-top'>
            <sub className='mr-2'>01</sub>
            <h3>Site Analysis</h3>
          </div>
          <div className='border-t-2 border-white text-white p-4 flex items-top'>
            <sub className='mr-2'>01</sub>
            <h3>Site Analysis</h3>
          </div>
          <div className='border-t-2 border-white text-white p-4 flex items-top'>
            <sub className='mr-2'>01</sub>
            <h3>Site Analysis</h3>
          </div>
          <div className='border-t-2 border-white text-white p-4 flex items-top'>
            <sub className='mr-2'>01</sub>
            <h3>Site Analysis</h3>
          </div>
        </div>
      </div>
    </>
  )
}
