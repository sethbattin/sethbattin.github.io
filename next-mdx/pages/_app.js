import Head from 'next/head'

function App({ Component, pageProps}) {
  return (<div>
    <Head>
      <meta name="seriously" value="wtf" />
      <title>why hello</title>
      <script type="text/javascript" danergouslySetInnerHTML={{__html: `var wtf=true`}} />
    </Head>
    <Component {...pageProps} />
  </div>)
}

export default App
