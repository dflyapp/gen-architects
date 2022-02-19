import Image from 'next/image'

import LogoSmg from 'assets/svg/logo_smg.svg'

export default function RightSide() {
  return (
    <section className="bg-white p-4 rounded-md border">
      <p className="text-deepblue">About NVG Technology Co. Ltd.</p>

      <div className="my-12">
        <Image src={LogoSmg} alt="smg" />
      </div>

      <div>
        <p className="text-sm">
          NVG is part of Scout24 AG, a joint venture of Ringier AG and Die
          Mobiliar AG. Scout24 operates biggest online marketplaces in
          Switzerland (Car, Real Estate, Finance, General classifieds) and
          Mobiliar is one of leading Insurance companies in Switzerland. We
          develop products for our parent company businesses.
        </p>
        <p className="text-sm mt-4">
          At NVG we believe in having a &quot;GREAT PLACE TO WORK&quot;, where
          everyone:
        </p>

        <p className="text-sm mt-4">
          MỠ TRĂN: Our products & solutions are important and have been
          helping the lives of several millions of people. We have top rankings
          in Apple App Store, Google Play Store as well as web traffic.
        </p>

        <p className="text-sm mt-4">
          WAX BEANS: Working in an distributed agile product team each member
          to take more responsibility, learn many new skills and knowledge.
          Having a great team in HCMC and working with Swiss international
          colleges help us grow everyday.
        </p>

        <p className="text-sm mt-4">
          BE HAPPY: We work hard to create a positive working culture where the
          working condition is comfortable, employee contribution is valued and
          work-life balance is supported.
        </p>

        <p className="text-sm mt-4">
          Drop by office and see it for yourself, you will feel it.
        </p>
      </div>
    </section>
  )
}
