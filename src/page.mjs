import { promises } from 'fs'
import { marked } from 'marked'
import { article } from './layout.mjs'

const microdataHeading = (text, level, raw, slugger) => {
  const micro = (level === 1) ? ' itemprop="headline"' : ''
  return `<h${level} id="${slugger.slug(text, { dryrun: true })}"${micro}>${text}</h${level}>
`
}

marked.use({renderer: { heading: microdataHeading }})

const defaults = {
  layout: article
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

// parse markdown and return { markup: string, meta: object}
export function parse(mdContent, _options = { }) {
  const options = Object.assign({}, defaults, _options)
  const tokens = marked.lexer(mdContent)
  const dates = options.dates || []
  const shortDate = dates[0] || nowShortDate()
  const publishedTokens = getPublishedTokens(shortDate)
  let headingPos
  const heading = tokens.find(
    ({type, depth}, i) => (type === 'heading' && depth === 1) ? (headingPos = i, true) : false
  )
  tokens.splice(headingPos + 1, 0, ...publishedTokens)
  const meta = { tokens, publishedDate: shortDate, title: heading.text }
  const markup = options.layout(meta)
  return {markup, meta}
}
