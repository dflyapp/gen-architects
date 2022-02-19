import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Gen Architects</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <div className='container mx-auto'>
        <h1 className='text-center text-darkblue'>Gen Architects</h1>
        <p className='text-center text-lightblue'>coming soon</p>
      </div>
    </div>
  )
}
