import Script from 'next/script'

import 'styles/globals.css'
import 'flickity/dist/flickity.min.css'

import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(async () => {
    await import('jquery')
    await import('flickity/dist/flickity.pkgd')
  }, [])
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-P2Z499R4XQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-P2Z499R4XQ');
  `}
      </Script>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
