import { promises } from 'fs'
const { readFile } = promises
import { marked } from 'marked'

function layout( htmlBody, meta) {
  const { title } = meta
  return `<html>
  <head>
    <title>Seth.how Blog${title && ` | ${title}`}</title>
  </head>
  <body>
    ${htmlBody}
  </body>
</html>`
}


// load a file and return { markup: string, meta: object}
export async function page(filename, options) {
  const mdContent = await readFile(filename, 'utf-8')
  const tokens = marked.lexer(mdContent)
  const content = marked.parser(tokens)
  return {markup: layout(content, {title: filename}), meta: {tokens}}
}
