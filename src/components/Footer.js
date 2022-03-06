import LogoPicture from 'assets/svg/logo_picture.svg'

export default function Footer() {
  return (
    <section className="md:px-6 bg-prbred pt-6 md:pt-24 lg:pt-32 pb-32 md:pb-6">
      <div className="">
        <div className="w-full flex flex-wrap">
          <div className="w-full md:w-10/12 ml-auto">
            <div className="flex flex-wrap items-end md:-mx-3 md:pl-6">
              <div className="w-full md:w-auto order-1 md:order-1 md:px-3 overflow-hidden mt-32 md:mt-0 mb-16 md:mb-0 flex justify-between">
                <img src={LogoPicture.src} alt="logo" style={{ width: 100, height: 'auto' }} className="mx-auto" />
              </div>
              <div className="ml-0 md:ml-12 w-full md:w-8/12 order-2 md:order-2 p-4 md:p-0 md:px-3 mb-18 md:mb-0">
                <span className="block leading-tight text-xs md:text-sm uppercase mb-1 md:mb-3 invert-select">
                  More projects
                </span>
                <div></div>
                <div>
                  <a
                    className="flex flex-wrap items-center border-b border-black py-3 md:py-4 xl:py-5 hover:text-white group fake-strike--group"
                    href="/work/1"
                  >
                    <span className="flex flex-wrap w-20 md:w-24 text-xs md:text-sm leading-none items-center">
                      <span className="block text-2xs pt-px mr-1 invert-select">
                        GEN
                      </span>
                      <span className="block leading-none invert-select">
                        21—365
                      </span>
                    </span>
                    <span className="block text-xl md:text-2xl xl:text-3xl font-display mt-2 fake-strike invert-select leading-none">
                      59 HOUSE
                    </span>
                    <span className="block ml-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 md:w-8 -mr-2"
                        viewBox="0 0 17.938 17.937"
                      >
                        <g
                          data-name="Group 33"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            data-name="Path 1"
                            d="M2.18 5.752h10.006v10.005"
                          ></path>
                          <path
                            data-name="Path 2"
                            d="M12.185 5.752L.354 17.583"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-full md:w-10/12 ml-auto mt-0 md:mt-24 lg:mt-32 md:pl-12 lg:pl-4 px-4 md:px-0"
      >
        <ul className="flex flex-wrap border-t border-black border-b">
          <li className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 pr-2 md:pr-3 lg:pr-4 xl:pr-5 block xl:border-r border-black hidden md:block invert-select">
            GEN Architects
          </li>
          <li className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 pr-2 lg:px-3 lg:px-4 xl:px-5 xl:pr-6 hidden xl:block invert-select">
            © 2022
          </li>
          <li className="block md:border-l border-black invert-select">
            <a
              className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 md:px-2 lg:px-4 xl:px-5 invert-select block hover:text-white focus:text-white hover:line-through focus:line-through"
              target="_blank"
              rel="noopener noreferrer"
              href="/privacy"
            >
              Privacy
            </a>
          </li>
          <li className="ml-auto block border-l border-black invert-select">
            <a
              className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 px-2 lg:px-4 xl:px-5 invert-select block hover:text-white focus:text-white hover:line-through focus:line-through"
              href="tel:+84 768 647 058"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="block invert-select md:hidden">Tel</span>
              <span className="hidden invert-select md:block">+84 768 647 058</span>
            </a>
          </li>
          <li className="invert-select block border-l border-black">
            <a
              className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 px-2 lg:px-4 xl:px-5 invert-select block hover:text-white focus:text-white hover:line-through focus:line-through"
              href="mailto:phuoc15kt25@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
          </li>
          <li className="border-l border-black invert-select">
            <a
              className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 px-2 lg:px-4 xl:px-5 block hover:text-white focus:text-white hover:line-through focus:line-through invert-select"
              href="https://twitter.com/prbarchitects"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twi<span className="hidden md:inline invert-select">tter</span>
            </a>
          </li>
          <li className="border-l border-black invert-select">
            <a
              className="text-sm lg:text-lg xl:text-xl py-2 md:py-3 px-2 lg:px-4 xl:px-5 pr-0 lg:pr-0 xl:pr-0 block hover:text-white focus:text-white hover:line-through focus:line-through invert-select"
              href="https://www.instagram.com/prbarchitects/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Insta<span className="hidden md:inline invert-select">gram</span>
            </a>
          </li>
        </ul>
        <ul className="flex flex-wrap border-b border-black md:hidden">
          <li className="text-sm md:text-lg py-2 block pr-12 block invert-select">
            GEN Architects
          </li>
        </ul>
      </div>
    </section>
  )
}
