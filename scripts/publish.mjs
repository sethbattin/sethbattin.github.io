import { parse } from "../src/page.mjs"
import { tag } from "../src/layout.mjs"
import { addLink } from "../src/tag.mjs"
import { INDEX, WEBROOT } from "../src/settings.mjs"
import { publishTag, tagFilePath } from "../src/tag.mjs"
import assert from "assert"
import { join, relative, parse as pathparse } from "path"
import { promises as fs, constants as fsConstants } from "fs"
import { exec as _exec } from "child_process"
import { promisify } from "util"
const exec = promisify(_exec)

const [nodeBin, script, fileName] = process.argv

assert(!!fileName, "specify a markdown file to publish")

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
  const rss = await addRss(outFile, meta)
}).catch(e => {
  console.error(e);
  process.exit(1)
})

const articleHref = articleOut => articleOut.replace(WEBROOT, '').replace(INDEX, '')

import xmldoc from "xmldoc"
const addRss = async (articleOut, meta) => {
  const href = articleHref(articleOut)
  const currentRss = await fs.readFile(join(WEBROOT, 'rss.xml'), 'utf-8').then(t => t.replace(/ *\n */g, ''))
  const doc = new xmldoc.XmlDocument(currentRss)
  const docString = '<?xml version="1.0"?>' + doc.toString({compressed: true})
  console.log({href, currentRss, doc, docString})
  assert(currentRss === docString, 'oh no mismatch')
}

const updateTagMarkdown = async (name, articleOut, title) => {
  const tagFile = tagFilePath(name)
  const href = articleHref(articleOut)
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
