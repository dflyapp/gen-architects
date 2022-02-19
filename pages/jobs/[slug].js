import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import marked from 'marked'
import Link from 'next/link'
import Head from 'next/head'

import RightSide from './RightSide'
import Stacks from './Stacks'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Button from '../../components/common/Button'

import styles from './Slug.module.css'

export default function PostPage({
  frontmatter: { title, date, excerpt },
  slug,
  content,
}) {
  const Info = (
    <section className="text-deepblue">
      <p className="leading-6">careers@nvg.vn</p>
      <p className="leading-6">+84 28 6256 0990</p>
    </section>
  )

  return (
    <>
      <Head>
        <title>Job: {title}</title>
        <meta name="description" content={excerpt} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className={styles.wrapper}>
        <div className="container mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 pr-0 lg:pr-2">
              <div className="bg-white p-8 rounded-md border">
                <div className="flex justify-between items-center">
                  <h1 className="text-primarydark mt-4">{title}</h1>
                  {Info}
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: marked(content) }}
                ></div>
                <div className="mt-8 flex items-center">
                  <Button className="bg-deepblue" label="SEND US YOUR CV" />
                  <div className="ml-4">{Info}</div>
                </div>

                <hr className="mt-12" />
                {/* stacks used */}
                <Stacks />
              </div>
            </div>
            <div className="w-full lg:w-4/12 pl-0 lg:pl-2 mt-8 lg:mt-0">
              <RightSide />
            </div>
          </div>
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
