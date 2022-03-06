import 'styles/globals.css'
import "flickity/dist/flickity.min.css"

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
