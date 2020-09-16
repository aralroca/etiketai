import Head from 'next/head'

import '../global-style.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Labelai</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
