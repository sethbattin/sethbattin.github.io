import { marked, Parser, Renderer } from 'marked'

function htmlDoc(headAndBody) {
  return `<!DOCTYPE html>
<html>${headAndBody}</html>`
}

function pubdate(shortDate) {
  return `
<time datetime="${shortDate}" itemProp="datePublished">
  ${(new Date(`${shortDate} 23:59:00`)).toDateString()}
</time>
`
}

const getPublishedTokens = (shortDate) =>
  marked.lexer(pubdate(shortDate))

function categoriesLink(name, href) {
  return `<a href="${href.toLowerCase()}" rel="tag">${name}</a>`
}
function categoriesLinks(categories) {
  const entries = Object.entries(categories)
  if (!entries.length) {
    return ''
  }
  const last = entries.pop()
  const prev = entries.pop()
  const lastLinks = `${prev ? `${categoriesLink(...prev)} and ` : ''}${categoriesLink(...last)}`
  const restLinks = entries.map(e => categoriesLink(...e)).join(', ')
  return `\n<span>This article was published under: ${!!restLinks ? `${restLinks}, ` : ''}${lastLinks}</span>`
}


const microdataHeading = (text, level, raw, slugger) => {
  const micro = (level === 1) ? ' itemprop="headline"' : ''
  return `<h${level} id="${slugger.slug(text, { dryrun: true })}"${micro}>${text}</h${level}>
`
}

export function article ( meta) {
  const { title, tokens, categories, publishedDate} = meta
  const publishedTokens = getPublishedTokens(publishedDate)
  let headingPos
  tokens.find(
    ({type, depth}, i) => (type === 'heading' && depth === 1) ? (headingPos = i, true) : false
  )
  tokens.splice(headingPos + 1, 0, ...publishedTokens)
  const parser = new Parser()
  parser.renderer.heading = microdataHeading
  const content = parser.parse(tokens)
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
    </address>${categoriesLinks(categories)}
    </article>
  </body>
`)
}

function homepageArticle (lengthLimit, meta) {
  const {tokens, publishedDate, title, name} = meta

  let lengthTotal = 0
  const textTokens = tokens.filter(t => {
    if (t.type !== 'paragraph') {
      return false
    }
    const under = lengthTotal < lengthLimit
    lengthTotal += t.text.length
    return under
  })
  const category = Object.keys(meta.categories).length ? Object.keys(meta.categories).pop() : 'Variety'
  return `<article>
    <h2>${title}</h2>
    ${pubdate(publishedDate)}
    <address><a rel="author" href="/seth-battin">Seth Battin</a></address>
    ${marked.parser(textTokens)}
    <a href="/${name}/">Continue reading - ${category} pg 1</a>
  </article>`
}

export function tag (meta) {
  const { title, tokens, path } = meta
  const content = marked.parser(tokens)
  //TODO: find parent/child category links
  const articles = Object.values(tokens.links).map(({title, href}) => 
    `<a href="${href}">${title}</a>`)
  return htmlDoc(`
    <head><title>Seth.How?: ${title} Article List</title></head>
    <body>
      ${content}
      <section>
        <h2>${title} Articles</h2>
        <ul>
        <li>
        ${articles.join('</li>\n<li>')}
        </li>
        </ul>
      </section>
    </body>
  `)
}


export function headline (meta) {
  return homepageArticle(1500, meta)
}

export function frontPage (meta) {
  return homepageArticle(700, meta)
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
      ${pubdate(latest.meta.publishedDate)}
    </div>
    </header>
    <nav>
      <details open>
        <summary>Contents</summary>
        <ul>
          <li><a href="/tag/science/">Science</a></li>
          <li><a href="/tag/opinion/">Opinion</a></li>
          <li><a href="/tag/society/">Society</a></li>
          <li><a href="/tag/programming/">Business</a></li>
          <li><a href="/rss.xml">Subscriptions 5¢</li>
          <li><a href="/seth-battin/" role="author">Editor</a>
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
