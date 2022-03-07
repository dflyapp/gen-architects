import 'styles/globals.css'
import 'flickity/dist/flickity.min.css'

import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(async () => {
    await import('jquery')
    await import('flickity/dist/flickity.pkgd')
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
