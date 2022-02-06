import { promises } from 'fs'
import { marked } from 'marked'
import { article, pubdate } from './layout.mjs'

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
  marked.lexer(pubdate(shortDate))

/**
 * use the marked internal `tokens.links` to find tags based on url convention.
 * For nested tags, create parent links as well
 */
const getCategories = (tokens) =>
  Object.values(tokens.links).reduce((acc, link) => {
    const list = (link.href.indexOf('/tag/') !== 0) ? [] :
      link.href.split('/').filter(s => !!s && s !== 'tag')
    const links = list.reduce((acc2, l) => {
      return {
        [l]: `/tag/${[...Object.keys(acc2), l].join('/')}/`,
        ...acc2,
      }
    }, {})
    return {
      ...acc,
      ...links,
    }
  }, {})


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
  const categories = getCategories(tokens)
  console.log({categories})
  const meta = { ...options, tokens, publishedDate: shortDate, title: heading.text, categories }
  const markup = options.layout(meta)
  return {markup, meta}
}
