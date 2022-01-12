import { parse } from "../src/page.mjs"
import assert from "assert"
import { join, relative, parse as pathparse } from "path"
import { promises as fs } from "fs"

const [nodeBin, script, fileName] = process.argv

assert(!!fileName, "specify a markdown file to publish")

const postFile = pathparse(relative('posts', fileName))
fs.readFile(fileName, 'utf-8').then(async mdContent => {
  const { markup, meta } = parse(mdContent);
  const outFile = join('docs', postFile.dir.replace('_private', ''), postFile.name, "index.html")
  await fs.mkdir(pathparse(outFile).dir, {recursive: true})
  await fs.writeFile(outFile, markup)
  console.log(`read markdown from ${fileName} and wrote to ${outFile}.`)
}).catch(e => {
  console.error(e);
  process.exit(1)
})
