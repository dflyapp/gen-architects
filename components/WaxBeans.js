import Image from 'next/image'

import Button from './common/Button'
import styles from './WaxBeans.module.css'

import Wax from '../img/wax.webp'

export default function LearnAndGrow() {
  return (
    <div className={styles.wrapper}>
      <section className="container mx-auto">
        <div className="flex flex-wrap items-center py-12">
          <div className="w-full lg:w-1/2 px-4">
            <div className="px-4">
              <h1 className="text-white">WAX BEANS</h1>
              <ul className="my-12 pl-4 text-white list-disc">
                <li>Công dụng: Wax lông toàn thân</li>
                <li>Loại da: Mọi loại da</li>

                <li>
                  Màu: Orange (cam), chamomile (hoa cúc), strawberry (dâu tây),
                  rose (hoa hồng), honey (vàng mật ong), tea tree (trà xanh),
                  lavender (hoa oải hương).
                </li>

                <li>Mỗi đơn hàng shop tặng kèm 1 que gỗ.</li>
                <li>Đóng gói: Bịch 100g</li>
                <li>
                  Thành phần từ tự nhiên: Colophonium (Rosin), Glyceryl
                  Rosinate, Ethylene/VA Copolymer, Paraffin, Glyceryl
                  Hydrogenate, Methyl Hydrogenated Rosinate, Hydrogenated
                  Coconut Oil, C30-45 Alkyl Methicone.
                </li>
              </ul>
              <Button
                className="mt-4 text-white bg-lightblue hover:text-deepblue hover:border-deepblue "
                label="THÔNG TIN THÊM"
                hoverColor="#132A3E"
                onClick={() => {
                  window.open(
                    'https://www.lazada.vn/products/sap-thom-wax-long-youngerist-bich-100g-sap-wax-long-cao-cap-do-bam-long-tot-dung-cho-spa-hat-dau-sap-tay-long-chuyen-nghiep-hard-wax-beans-deo-wax-sach-hang-tot-loai-xin-tu-wax-long-tai-nha-i1652417627-s7292006234.html'
                  )
                }}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4 mt-12 lg:mt-0">
            <Image placeholder="blur" src={Wax} alt="wax" />
          </div>
        </div>
      </section>
    </div>
  )
}
