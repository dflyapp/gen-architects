import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { sortByDate } from '../utils'

import Head from 'next/head'
import { Element } from 'react-scroll'

import Header from 'components/Header'
import Cover from 'components/Cover'
import MoTran from 'components/MoTran'
import WaxBeans from 'components/WaxBeans'
import Contact from 'components/Contact'
import Footer from 'components/Footer'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Gen Architects</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="container mx-auto">
        <Header />
      </div>

      <Cover />

      <Element name="moTran">
        <MoTran />
      </Element>

      <Element name="waxBeans">
        <WaxBeans />
      </Element>

      <Element name="contact">
        <Contact />
      </Element>

      <Footer />
    </div>
  )
}
