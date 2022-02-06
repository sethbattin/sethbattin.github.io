import { parse } from "../src/page.mjs"
import { tag } from "../src/layout.mjs"
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
const WEBROOT = 'docs'

const postFile = pathparse(relative('posts', fileName))
const outFile = join(WEBROOT, postFile.dir.replace('_private', ''), postFile.name, INDEX)
Promise.all([
  fs.readFile(fileName, 'utf-8'),
  exec(`git log --reverse --date=short --format=%ad -- ${outFile}`)
    .then(({stdout}) => stdout.split('\n').filter(Boolean))
]).then(async ([mdContent, dates]) => {
  const { markup, meta } = parse(mdContent, {dates});
  await fs.mkdir(pathparse(outFile).dir, {recursive: true})
  await fs.writeFile(outFile, markup)
  console.log(`read markdown from ${fileName} and wrote to ${outFile}.`)
  const tagUpdates = Object.entries(meta.categories).map(([catName, path]) =>
    updateTagMarkdown(catName, outFile, meta.title).then(
      ({href, updated, created}) => 
        (updated || created ) ?
          publishTag(catName, path). then(async ({tagOutFile}) => ({ 
            catName, 
            change: created ? 'created' : 'updated', 
            tagOutFile
          })) :
          Promise.resolve({catName, change: null})
    )
  )
  const tagList = await Promise.all(tagUpdates)
  tagList.forEach(tag => {
    console.log(tag.change ? 
      `${tag.change} markdown in tags/${tag.catName}.md and wrote markdup to ${tag.tagOutFile}.` :
      `no change to tags/${tag.catName}.md`
    )
  })
}).catch(e => {
  console.error(e);
  process.exit(1)
})

const tagFilePath = (name) => join('tags', `${name}.md`)

const updateTagMarkdown = async (name, articleOut, title) => {
  const tagFile = tagFilePath(name)
  const href = articleOut.replace(WEBROOT, '').replace(INDEX, '')
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

  return { created, updated, href }
}

const publishTag = async (name, path, verb) => {
  const tagFile = tagFilePath(name)
  const tagContents = await fs.readFile(tagFile, 'utf-8')
  const { markup, meta } = parse(tagContents, { name, path, layout: tag })
  const tagOutFile = join(WEBROOT, path, INDEX)
  await fs.mkdir(join(WEBROOT, path), {recursive: true})
  await fs.writeFile(tagOutFile, markup, 'utf-8')
  return {tagOutFile}
}
