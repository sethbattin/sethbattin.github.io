import { parse } from "../src/page.mjs"
import assert from "assert"
import { join, relative, parse as pathparse } from "path"
import { promises as fs } from "fs"
import { exec as _exec } from "child_process"
import { promisify } from "util"
const exec = promisify(_exec)

const [nodeBin, script, fileName] = process.argv

assert(!!fileName, "specify a markdown file to publish")

const postFile = pathparse(relative('posts', fileName))
const outFile = join('docs', postFile.dir.replace('_private', ''), postFile.name, "index.html")
Promise.all([
  fs.readFile(fileName, 'utf-8'),
  exec(`git log --reverse --date=short --format=%ad -- ${outFile}`)
    .then(({stdout}) => stdout.split('\n').filter(Boolean))
]).then(async ([mdContent, dates]) => {
  const { markup, meta } = parse(mdContent, {dates});
  await fs.mkdir(pathparse(outFile).dir, {recursive: true})
  await fs.writeFile(outFile, markup)
  console.log(`read markdown from ${fileName} and wrote to ${outFile}.`)
}).catch(e => {
  console.error(e);
  process.exit(1)
})
