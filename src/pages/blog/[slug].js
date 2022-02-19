/* eslint-disable @next/next/no-img-element */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import marked from 'marked'
import Link from 'next/link'
import Head from 'next/head'

import Header from '../components/Header'
import Footer from '../components/Footer'

import styles from '../../styles/Blog.module.css'

export default function PostPage({
  frontmatter: { title, date, cover_image, excerpt },
  slug,
  content,
}) {
  return (
    <>
      <Head>
        <title>Bài viết: {title}</title>
        <meta
          name="description"
          content={excerpt}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.cover}>
        <div className="container mx-auto">
          <Header />
          <div className="w-3/4 mx-auto mt-12">
            <img src={cover_image} alt="" />
          </div>
          <strong className="text-xs text-accent text-center my-8 block">
            Posted on {date}
          </strong>
          <h1 className="text-center">{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="my-24 mx-auto px-4 w-full md:w-1/2 blog-content">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
      </div>

      {/* footer */}
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  )

  const { data: frontmatter, content } = matter(markdownWithMeta)

  return {
    props: {
      frontmatter,
      slug,
      content,
    },
  }
}
