import { marked } from 'marked'

function htmlDoc(headAndBody) {
  return `<!DOCTYPE html>
<html>${headAndBody}</html>`
}

export function article ( meta) {
  const { title, tokens } = meta
  const content = marked.parser(tokens)
  return htmlDoc(`
  <head>
    <title>Seth.how Blog${title && ` | ${title}`}</title>
    <link type="text/css" rel="stylesheet" href="/main.css" />
  </head>
  <body>
    <article itemscope itemtype="https://schema.org/Article">
    ${content}
    <address>
      By <a href="/seth-battin" itemprop="author" rel="author" itemscope itemtype="https://schema.org/Person">
        <span itemprop="name">Seth Battin</span>
      </a>
    </address>
    </article>
  </body>
`)
}

export function headline (meta) {
  const {tokens, publishedDate, title} = meta

//console.log(tokens.slice(0,5))
  let lengthTotal = 0
  const lengthLimit = 1500
  const textTokens = tokens.filter(t => {
    if (t.type !== 'paragraph') {
      return false
    }
    lengthTotal += t.text.length
    return lengthTotal < lengthLimit
  })

  //TODO: tags
  const category = 'Variety'
  return `<article>
    <h2>${title}</h2>
    <time datetime="${publishedDate}">${publishedDate}</time>
    <address><a rel="author" href="/seth-battin">Seth Battin</a></address>
    ${marked.parser(textTokens)}
    <a href="/eventual-canonical-link/">Continue reading - ${category} pg 1</a>
  </article>`
}

export function frontPage (meta) {
  return `I am on the front page ${JSON.stringify(meta).slice(0, meta && meta.options && meta.options.length || 200)}`
}

export function homepage (latest, second, third) {
  const out = htmlDoc(`
  <head>
    <title>Seth.how Blog</title>
    <link type="text/css" rel="stylesheet" href="/main.css" />
  </head>
  <body
    onload="document.querySelector('nav details').open=window.matchMedia('(min-width: 540px)').matches"
  >
    <header class="site-title">
    <h1>Seth.how? Blog</h1>
    <!-- get rid of this styling div; it sucks; use flexbox for direct child elements -->
    <div class="ticker d-f f-ai-e f-jc-sb">
      <p>The most available domain for almost regular updates.</p>
      <time datetime="2023-01-13">Thursday, January 13th 2022</time>
    </div>
    </header>
    <nav>
      <details open>
        <summary>Contents</summary>
        <ul>
          <li>in the final</li>
          <li>this section will</li>
          <li>contain links to</li>
          <li>important pages</li>
          <li>and categories.</li>
          <li><a href="/seth-battin/" role="author">For example</a>
        </ul>
      </details>
    </nav>
    <main>
    ${latest.markup}
    ${second.markup}
    ${!!third ? third.markup : ''}
    </main>
  </body>
`)
  return out;
}
