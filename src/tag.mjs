import { marked } from "marked"
import { join } from "path"
import { promises as fs } from "fs"
import { parse } from "../src/page.mjs"
import { tag } from "../src/layout.mjs"
import { INDEX, WEBROOT } from "../src/settings.mjs"

export const tagFilePath = (name) => join('tags', `${name.toLowerCase()}.md`)

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

export const publishTag = async (name, path, verb) => {
  const tagFile = tagFilePath(name)
  const tagContents = await fs.readFile(tagFile, 'utf-8')
  const { markup, meta } = parse(tagContents, { name, path, layout: tag })
  const tagOutFile = join(WEBROOT, path, INDEX)
  await fs.mkdir(join(WEBROOT, path), {recursive: true})
  await fs.writeFile(tagOutFile, markup, 'utf-8')
  return {tagOutFile}
}
