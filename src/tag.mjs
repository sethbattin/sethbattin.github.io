import { marked } from "marked"

export function addLink(mdContent, link) {
  const tokens = marked.lexer(mdContent)
  const name = link.href.split('/').filter(Boolean).pop()
  const text = tokens.reduce((acc, token) => acc + token.raw, '')
  if (!Object.values(tokens.links).find(l => l.href === link.href)){
    tokens.links = {
      [name]: link,
      ...tokens.links
    }
  }
  const links = Object.entries(tokens.links).map(([key, l]) => `[${key}]: ${l.href} "${l.title}"`)
  return `${text}${links.join('\n')}\n`
}
