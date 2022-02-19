import Image from 'next/image'

import Button from './common/Button'
import Motran from '../img/motran.jpg'

import styles from './MoTran.module.css'

export default function Footer() {
  return (
    <section className={styles.impact}>
      <div className="container mx-auto">
        <div className="flex flex-wrap-reverse items-center">
          <div className="w-full lg:w-1/2 px-4">
            <Image placeholder="blur" src={Motran} alt="mo tran" />
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <h1 className="text-right text-dark">MỠ TRĂN</h1>

            <ul className="my-4 lg:my-12 pl-2 lg:pl-36 text-dark list-disc">
              <li>Kết hợp với waxing nóng (shop có bán) để triệt lông.</li>
              <li>Thoa mỡ trăn từ tháng thứ 4 của thai kỳ để chống rạn da.</li>

              <li>
                Thoa mỡ trăn lên mặt và massage từ 30 - 60 phút để se khít lỗ
                chân lông.
              </li>

              <li>
                Thoa mỡ trăn ngay khi bị phỏng và bôi liên tục cho đến khi lành
                hẳn.
              </li>
              <li>
                Sử dụng mỡ trăn như dầu tẩy trang để loại bỏ lớp make up, bụi
                bẩn trên mặt.
              </li>
              <li>
                Rửa sạch, lau khô, sau đó thoa đều mỡ trăn lên vùng bị nứt,
                khoảng 2 tiếng lau sạch mỡ, rồi ủ ấm vùng da đó (có thể mang vớ
                chân).
              </li>
            </ul>

            <div className="flex justify-end mb-24 lg:mb-0">
              <Button
                className="mt-4 text-white bg-lightblue hover:text-deepblue hover:border-deepblue "
                label="THÔNG TIN THÊM"
                hoverColor="#132A3E"
                onClick={() => {
                  window.open(
                    'https://www.lazada.vn/products/mo-tran-nguyen-chat-100-youngerist-mo-tran-triet-long-khong-pha-tap-chat-mo-tran-giam-ton-thuong-vet-bong-wax-long-tay-trang-han-che-moc-long-duong-da-moi-mem-min-long-mong-hon-duoi-chuot-lam-mo-vet-seo-lota-shop-i1603653270-s6895928502.html'
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
