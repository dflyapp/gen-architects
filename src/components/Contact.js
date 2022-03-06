export default function Contact() {
  return (
    <section className="pb-4 pt-12 md:pb-14 md:pt-20 xl:pb-20 xl:pt-24">
      <div className="w-full md:w-9/12 mx-auto px-4 md:px-5 mb-0 md:mb-24 lg:mb-32 3xl:mb-40">
        <div className="max-w-sm pr-12 md:pr-0 md:max-w-lg lg:max-w-2xl p-3 md:p-0 -mx-4 md:mx-0 mb-2 md:mb-8">
          <span className="block font-display text-4xl md:text-6xl leading-slightnegative pr-1">
            Cần tư vấn<span className="block">cho dự án?</span>
            Liên hệ chúng tôi ngay hôm nay
          </span>
        </div>
        <div className="flex flex-wrap border-t border-b border-black w-auto pr-12 md:pr-0 md:w-full">
          <a
            href="mailto:phuoc15kt25@gmail.com"
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm sm:text-lg md:text-xl block py-2 lg:py-3 pr-3 lg:pr-4 leading-tight hover:line-through focus:line-through lg:mb-0 border-r border-black"
          >
            Email
          </a>
          <a
            href="tel:+84 768 647 058"
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm sm:text-lg md:text-xl block pl-2 lg:pl-3 px-3 lg:px-4 py-2 lg:py-3 leading-tight hover:line-through focus:line-through lg:mb-0 border-r border-black"
          >
            <span className="hidden md:block">+84 768 647 058</span>
            <span className="block md:hidden">Tel</span>
          </a>
          <a
            href="https://www.google.com/maps/place/Player+Roberts+Bell+Architects/@52.9888236,-0.9303382,17z/data=!3m1!4b1!4m5!3m4!1s0x4879c94b2ea00ee3:0xf9402e81b6228e50!8m2!3d52.9888236!4d-0.9281442"
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm sm:text-lg md:text-xl block leading-tight hover:line-through focus:line-through py-2 lg:py-3 pl-3 lg:pl-4 lg:pr-16 pr-8"
          >
            <span className="block pb-px">Địa chỉ</span>
          </a>
          <a
            className="text-sm sm:text-lg md:text-xl block leading-tight hover:line-through focus:line-through pl-3 lg:pl-4 py-2 lg:py-3 border-l border-black ml-auto"
            href="/journal"
          >
            Tạp chí
          </a>
        </div>
      </div>
      <div className="my-48" />
    </section>
  )
}
