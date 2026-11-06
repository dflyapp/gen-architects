import type { Project } from '../data/model'
import { wrap } from '../data/model'
import Image from './Image'

type CarouselProps = {
  index: number
  projects: Project[]
}

export default function Carousel({ index, projects }: CarouselProps) {
  if (projects.length === 0) {
    return (
      <div id="carousel" class="flex flex-col items-center mx-8">
        <p class="text-center text-xl mt-2">No projects yet.</p>
      </div>
    )
  }

  const safeIndex = Number.isFinite(index) ? index : 0
  const activeIndex = wrap(0, projects.length, safeIndex)
  const project = projects[activeIndex]

  return (
    <div id="carousel" class="flex flex-col items-center mx-8">
      <div class="relative w-full md:w-[800px] h-[300px] md:h-[500px] overflow-hidden">
        <div
          class="carousel-image absolute h-full w-full bg-cover bg-no-repeat bg-center will-change-transform"
          style={`background-image: url(${project.cover})`}
        />
      </div>

      <p class="text-center text-4xl mt-2">{project.name}</p>

      <div class="w-full justify-center flex gap-x-4 my-4">
        <button
          type="button"
          hx-get={`/partials/carousel?index=${activeIndex - 1}`}
          hx-target="#carousel"
          hx-swap="outerHTML"
        >
          ←
        </button>
        <a
          class="hover:opacity-70 text-prbred underline"
          href={`/work/${project.id}`}
        >
          view project
        </a>
        <button
          type="button"
          hx-get={`/partials/carousel?index=${activeIndex + 1}`}
          hx-target="#carousel"
          hx-swap="outerHTML"
        >
          →
        </button>
      </div>

      <div class="flex justify-center gap-x-2">
        {projects.map((item, itemIndex) => (
          <button
            type="button"
            key={item.id}
            hx-get={`/partials/carousel?index=${itemIndex}`}
            hx-target="#carousel"
            hx-swap="outerHTML"
            class="relative h-[120px] w-[90px]"
          >
            <Image
              class={`absolute top-0 left-0 h-12 md:h-full w-full object-cover ${
                item.id === project.id ? 'border-4 border-prbred' : ''
              }`}
              src={item.cover}
              alt="Cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
