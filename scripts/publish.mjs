import { parse } from "../src/page.mjs"
import { addLink } from "../src/tag.mjs"
import assert from "assert"
import { join, relative, parse as pathparse } from "path"
import { promises as fs, constants as fsConstants } from "fs"
import { exec as _exec } from "child_process"
import { promisify } from "util"
const exec = promisify(_exec)

const [nodeBin, script, fileName] = process.argv

assert(!!fileName, "specify a markdown file to publish")

const INDEX = 'index.html'

const postFile = pathparse(relative('posts', fileName))
const outFile = join('docs', postFile.dir.replace('_private', ''), postFile.name, INDEX)
Promise.all([
  fs.readFile(fileName, 'utf-8'),
  exec(`git log --reverse --date=short --format=%ad -- ${outFile}`)
    .then(({stdout}) => stdout.split('\n').filter(Boolean))
]).then(async ([mdContent, dates]) => {
  const { markup, meta } = parse(mdContent, {dates});
  await fs.mkdir(pathparse(outFile).dir, {recursive: true})
  await fs.writeFile(outFile, markup)
  console.log(`read markdown from ${fileName} and wrote to ${outFile}.`)
  const tagUpdates = Object.keys(meta.categories).map(catName =>
    updateTagMarkdown(catName, outFile, meta.title)
  )
  const tagList = await Promise.all(tagUpdates)
  console.log(tagList)
}).catch(e => {
  console.error(e);
  process.exit(1)
})

const updateTagMarkdown = async (name, articleOut, title) => {
  const tagFile = join('tags', `${name}.md`)
  const href = articleOut.replace('docs', '').replace(INDEX, '')
  let tagFileContent = ''
  let created = false
  try {
    await fs.access(tagFile).then(async () => { 
      tagFileContent = await fs.readFile(tagFile, 'utf-8')
    })
  } catch (e) {
    tagFileContent = `# ${name}\n\n`
    created = true
  }
  const newContent = addLink(tagFileContent, { title, href })
  const updated = !created && newContent !== tagFileContent
  await fs.writeFile(tagFile, newContent, 'utf-8')

  //TODO: publish the tag file
  return { created, updated, href }
}
