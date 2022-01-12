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
    ${htmlBody}
  </body>
</html>`
}


// load a file and return { markup: string, meta: object}
export async function parse(filename, options) {
  const mdContent = await readFile(filename, 'utf-8')
  const tokens = marked.lexer(mdContent)
  const heading = tokens.find(({type, depth}) => type === 'heading' && depth === 1)
  const content = marked.parser(tokens)
  return {markup: layout(content, {title: heading.text}), meta: {tokens}}
}
