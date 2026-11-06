import type { Project } from '../data/model'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Image from '../components/Image'
import PackageInfo from '../components/PackageInfo'

type WorkProps = {
  project: Project
  projects: Project[]
}

export default function Work({ project, projects }: WorkProps) {
  const [hero, packageImage, third, fourth, fifth] = project.images

  return (
    <>
      <header class="flex justify-between p-8">
        <a
          href="/"
          class="flex flex-wrap items-center animate-slide-right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6"
            viewBox="0 0 27.197 23.217"
          >
            <g
              data-name="Group 116"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                data-name="Path 1"
                d="M12.314 22.51l-10.9-10.9 10.9-10.9"
              />
              <path data-name="Path 2" d="M1.414 11.609h25.783" />
            </g>
          </svg>
          <span class="text-2xl block ml-3 cursor-pointer">
            All Projects
          </span>
        </a>
        <div>
          <a class="text-2xl" href="/">
            Menu
          </a>
        </div>
      </header>

      <div class="px-8">
        <hr />
      </div>

      <div class="mt-8 flex h-screen overflow-hidden">
        <div class="hidden sm:block bg-gray8 w-full sm:w-3/4">
          {hero && <Image src={hero.src} alt="picture 1" />}
        </div>
        <div class="flex justify-center items-center w-full relative">
          <div class="absolute left-4 top-4">
            <Image src="/assets/svg/arrow_right.svg" alt="logo" />
          </div>

          <div class="text-center">
            <h1 class="work-title">{project.name}</h1>
            <p class="mt-8 text-2xl">{project.location}</p>
          </div>
        </div>
      </div>

      <PackageInfo
        description={project.description}
        packages={project.package}
        img={packageImage}
        tag={project.tag}
      />

      <div class="mt-24 sm:mt-48 flex flex-wrap justify-between px-4">
        <div class="w-full sm:w-1/4 pr-2 md:pr-12 lg:pr-24">
          {third && <Image src={third.src} alt="picture 4" />}
          <div class="flex justify-between items-center">
            {third && <h4 class="text-sm">{third.detail}</h4>}
            <span class="text-xs">{project.tag}</span>
          </div>
        </div>
        <div class="w-full sm:w-3/4 pl-2 md:pl-24 mt-48">
          {fourth && <Image src={fourth.src} alt="picture 3" />}
          <div class="flex justify-between items-center">
            {fourth && <h4 class="text-sm">{fourth.detail}</h4>}
            <span class="text-xs">{project.tag}</span>
          </div>
        </div>
      </div>

      <div class="my-24 sm:my-48 px-4">
        <div class="w-full sm:w-3/4 mx-auto">
          {fifth && <Image src={fifth.src} alt="picture 5" />}
          <div class="flex justify-between items-center">
            {fifth && <h4 class="text-sm">{fifth.detail}</h4>}
            <span class="text-xs">{project.tag}</span>
          </div>
        </div>
      </div>

      {project.images[5] && (
        <div class="my-24 sm:my-48 px-4">
          <div class="w-full sm:w-3/4 mx-auto">
            <Image src={project.images[5].src} alt="picture 6" />
            <div class="flex justify-between items-center">
              <h4 class="text-sm">{project.images[5].detail}</h4>
              <span class="text-xs">{project.tag}</span>
            </div>
          </div>
        </div>
      )}

      <Contact />
      <Footer projects={projects} />
    </>
  )
}
