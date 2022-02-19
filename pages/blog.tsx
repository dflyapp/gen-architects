import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Post from '../components/Post'
import Header from '../components/Header'
import Footer from '../components/Footer'

import styles from '../styles/Blog.module.css'
import { sortByDate } from '../utils'

import HeroBlog from '../img/HeroBlog.jpg'

export default function Blog({ posts }: any) {
  return (
    <div>
      <Head>
        <title>Youngerist Blogs</title>
        <meta
          name="description"
          content="Những mẹo nhỏ giúp bạn chăm sóc làn da của mình tốt hơn."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.cover}>
        <div className="container mx-auto">
          <Header />
          <div className="flex flex-wrap pt-24">
            <div className="w-full md:w-1/2 px-8 md:px-0">
              <h3>Skin From Within</h3>
              <h4 className="text-accent my-4">Our natureal skincare blog</h4>
            </div>
            <div className="w-full md:w-1/2 px-8 md:px-0">
              <Image src={HeroBlog} alt="tree" />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-dark text-center mt-24">Sundaily Essentials</h3>
      <p className="text-center text-accent mt-4 w-1/2 mx-auto">
        The why, what, and how behind Sundaily gummies. Start here to get the
        101 on how we’ve made skincare way tastier than your daily moisturizer.
      </p>

      <div className="container mx-auto my-24">
        <div className="flex flex-wrap">
          {posts.map((post: any, index: any) => (
            <Post key={index} post={post} />
          ))}
        </div>
      </div>

      {/* footer */}
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
