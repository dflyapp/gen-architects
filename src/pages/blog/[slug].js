import Header from 'components/Header'
import Footer from 'components/Footer'

import styles from 'styles/Blog.module.css'

export default function PostPage() {
  return (
    <>
      <div className={styles.cover}>
        <div className='container mx-auto'>
          <Header />
          <h1 className='text-center'>Title</h1>
        </div>
      </div>
      <div className='container mx-auto px-4'>
        <div className='my-24 mx-auto px-4 w-full md:w-1/2 blog-content'>
          <p>content</p>
        </div>
      </div>

      {/* footer */}
      <Footer />
    </>
  )
}
