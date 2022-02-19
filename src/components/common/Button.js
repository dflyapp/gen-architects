import Image from 'next/image'

import IconArrow from 'assets/svg/icon_arrow.svg'
import styles from './Button.module.css'

export default function Button({ label, type, onClick }) {
  return (
    <button className={styles.btn} onClick={onClick}>
      <span className="mr-2">{label}</span>
      <Image src={IconArrow} alt="arrow" />
    </button>
  )
}
