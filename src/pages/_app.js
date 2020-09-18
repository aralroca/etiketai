import Head from 'next/head'

import '../global-style.css'

export default function App({ Component, pageProps }) {
  const title = 'Labelai'
  const description =
    'Labelai is an online tool designed to label images, useful for training AI models.'

  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="author" content="Aral Roca" />
        <meta
          name="keywords"
          content="annotations, tool, imagenet, yolo, deep-learning, detection, recognition, image-classification, labelimg, preact, nextjs, javascript, ai, artificial-intelligence, machine-learning, images, labels"
        />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:title" content={title} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
