import { promises } from 'fs'
const { readFile } = promises
import { marked } from 'marked'

function layout( htmlBody, meta) {
  const { title } = meta
  return `<html>
  <head>
    <title>Seth.how Blog${title && ` | ${title}`}</title>
    <link type="text/css" rel="stylesheet" href="/main.css" />
  </head>
  <body>
    <article itemscope itemtype="https://schema.org/Article">
    ${htmlBody}
    <address>
      By <a href="/seth-battin" itemprop="author" rel="author" itemscope itemtype="https://schema.org/Person">
        <span itemprop="name">Seth Battin</span>
      </a>
    </address>
    </article>
  </body>
</html>`
}

export const microdataHeading = (text, level, raw, slugger) => {
  const micro = (level === 1) ? ' itemprop="headline"' : ''
  return `<h${level} id="${slugger.slug(text, { dryrun: true })}"${micro}>${text}</h${level}>
`
}

marked.use({renderer: { heading: microdataHeading }})

// parse markdown and return { markup: string, meta: object}
export function parse(mdContent, options = { }) {
  const tokens = marked.lexer(mdContent)
  const dates = options.dates || []
  const shortDate = dates[0] || nowShortDate()
  const publishedTokens = getPublishedTokens(shortDate)
  tokens.splice(1, 0, ...publishedTokens)
  const heading = tokens.find(({type, depth}) => type === 'heading' && depth === 1)
  const content = marked.parser(tokens)
  return {markup: layout(content, {title: heading.text}), meta: {tokens}}
}

function nowShortDate() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const getPublishedTokens = (shortDate) => 
  marked.lexer(`
<time datetime="${shortDate}" itemProp="datePublished">
  ${(new Date(`${shortDate} 23:59:00`)).toDateString()}
</time>
`)

