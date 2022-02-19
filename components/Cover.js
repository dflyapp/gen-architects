import Image from 'next/image'

import MoreDetail from './common/MoreDetail'

import IconMultiply from '../svg/icon_multiply.svg'
import IconEqual from '../svg/icon_equal.svg'
import IconQuote from '../svg/icon_quote.svg'

import BgCoverRight from '../img/bg_cover_right3.jpg'

import styles from './Cover.module.css'

export default function Cover() {
  return (
    <div className={styles.wrapperbg}>
      <div className="mx-auto">
        <div className={styles.wrapper}>
          {/* more details */}
          <div className={styles.moredetail}>
            <MoreDetail />
          </div>

          {/* left cover */}
          {/* <div className={styles.maskleft}>
            <Image src={BgCoverLeft} alt="v" />
          </div> */}

          {/* right cover */}
          <div className={styles.maskrightwrapper}>
            <div className="hidden md:block">
              <Image placeholder="blur" src={BgCoverRight} alt="office" />
            </div>
          </div>

          {/* content */}
          <div className="container mx-auto z-20 px-4 lg:px-0">
            <label className="text-white text-xl lg:text-xl">
              Chất lượng sản phẩm luôn đặt lên hàng đầu
            </label>
            <div className="flex items-start">
              <div className="pt-8 pr-4">
                <Image src={IconQuote} alt="quote" />
              </div>
              <h1 className="w-2/3 font-light text-4xl lg:text-6xl">
                <span className="text-white">
                  Chuyên trang tư vấn sức khỏe làm đẹp{' '}
                </span>
              </h1>
            </div>

            {/* badges */}
            <section className="mt-10 flex flex-wrap">
              <label className="mt-2 sm:mt-0 bg-deepblue text-white text-sm badge">
                Beauty
              </label>
              <Image src={IconMultiply} alt="multi" />
              <label className="mt-2 sm:mt-0 bg-deepblue text-white text-sm badge">
                Care
              </label>
              <Image src={IconMultiply} alt="multi" />
              <label className="mt-2 sm:mt-0 bg-deepblue text-white text-sm badge">
                Advice
              </label>
              <Image src={IconEqual} alt="equal" />
              <label className="mt-2 sm:mt-0 bg-yellow5 text-white text-sm badge">
                Unique Impact
              </label>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
