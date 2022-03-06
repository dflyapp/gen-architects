import styled from 'styled-components'
import Image from 'next/image'

const PackageName = styled.h4`
  color: white;
`

const SmallSpan = styled.span`
  color: white;
  font-size: 0.7rem;
`

export default function PackageInfo({ description, packages, img, tag }) {
  return (
    <div className="mt-8 flex flex-wrap justify-between items-end bg-gray-800 py-24">
      <div className="w-full sm:w-1/4 px-4 md:px-8 lg:px-24">
        <div className="flex justify-between items-center mb-2">
          <SmallSpan>{img.detail}</SmallSpan>
          <SmallSpan>{tag}</SmallSpan>
        </div>
        <Image src={img.src} alt="picture 4" />
      </div>
      <div className="w-full sm:w-3/4 px-12">
        {description && (
          <h1 className="text-xl sm:text-2xl text-white mb-24 font-light">
            {description}
          </h1>
        )}
        {packages &&
          packages.map((ele, index) => {
            return (
              <div
                key={index}
                className="border-t border-white text-white p-4 flex items-top"
              >
                <sub className="mr-2">{`0${index + 1}`}</sub>
                <PackageName className="text-sm sm:text-4xl font-light">
                  {ele}
                </PackageName>
              </div>
            )
          })}
      </div>
    </div>
  )
}
