import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { sortByDate } from '../utils'

import Head from 'next/head'
import { Element } from 'react-scroll'

import Header from '../components/Header'
import Cover from '../components/Cover'
import MoTran from '../components/MoTran'
import WaxBeans from '../components/WaxBeans'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home(posts: any) {
  console.log('home', posts)
  return (
    <div>
      <Head>
        <title>Youngerist - Chuyên trang làm đẹp</title>
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

export async function getStaticProps() {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'))

  // Get slug and frontmatter from posts
  const posts = files.map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '')

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )

    const { data: frontmatter } = matter(markdownWithMeta)

    return {
      slug,
      frontmatter,
    }
  })

  return {
    props: {
      posts: posts.sort(sortByDate),
    },
  }
}
