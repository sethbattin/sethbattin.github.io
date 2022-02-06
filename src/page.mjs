import { promises } from 'fs'
import { marked } from 'marked'
import { article } from './layout.mjs'

const defaults = {
  layout: article
}

function nowShortDate() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

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
  const publishedDate = dates[0] || nowShortDate()
  const { text: title } = tokens.find(
    ({type, depth}) => (type === 'heading' && depth === 1)
  ) || {}
  const categories = getCategories(tokens)
  const meta = { ...options, tokens, publishedDate, title, categories }
  const markup = options.layout(meta)
  return {markup, meta}
}
