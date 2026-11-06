import Carousel from '../components/Carousel'

export default function Home() {
  return (
    <div>
      <div class="w-screen h-screen relative overflow-x-hidden">
        <header class="flex justify-between p-8">
          <div class="animate-slide-down">
            <a class="text-2xl" href="/">
              Gallery
            </a>
            <span class="mx-2">/</span>
            <a class="text-2xl opacity-60" href="/">
              Index
            </a>
          </div>
          <div>
            <a class="text-2xl" href="/">
              Menu
            </a>
          </div>
        </header>

        <div class="px-8">
          <hr />
        </div>

        <section class="flex flex-col gap-y-2 h-full justify-between p-8 pb-48">
          <div class="animate-slide-up">
            <img
              style="width: 80px; height: auto"
              src="/assets/svg/logo_picture.svg"
              alt="gen"
            />
          </div>
          <Carousel index={0} />
        </section>
      </div>
    </div>
  )
}
