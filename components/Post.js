/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Post({ post }) {
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={`/blog/${post.slug}`}>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 cursor-pointer">
        <img src={post.frontmatter.cover_image} alt="" />

        <strong className="text-sm text-dark mt-4">
          Posted on {post.frontmatter.date}
        </strong>

        <h4 className="mt-4">{post.frontmatter.title}</h4>
        <p className="mt-4 text-accent">{post.frontmatter.excerpt}</p>
      </div>
    </Link>
  )
}
