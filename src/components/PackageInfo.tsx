import type { ProjectImage } from '../data/model'
import Image from './Image'

type PackageInfoProps = {
  description: string
  packages: string[]
  img: ProjectImage
  tag: string
}

export default function PackageInfo({
  description,
  packages,
  img,
  tag,
}: PackageInfoProps) {
  return (
    <div class="mt-8 flex flex-wrap justify-between items-end bg-gray-900 py-48">
      <div class="w-full sm:w-1/4 px-4 md:px-8 lg:px-24">
        <div class="flex justify-between items-center mb-2">
          <span class="text-white text-[0.7rem]">{img.detail}</span>
          <span class="text-white text-[0.7rem]">{tag}</span>
        </div>
        <Image src={img.src} alt="picture 4" />
      </div>
      <div class="w-full sm:w-3/4 px-12">
        <h4 class="text-white leading-[3.5rem] text-xl sm:text-5xl mb-24 font-normal leading-12">
          {description}
        </h4>
        {packages.map((item, index) => (
          <div
            key={item}
            class="border-t border-white text-white p-4 flex items-top"
          >
            <sub class="mr-2">{`0${index + 1}`}</sub>
            <h4 class="text-sm sm:text-xl font-light">{item}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
