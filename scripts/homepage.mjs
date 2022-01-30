import { parse, home } from "../src/page.mjs"
import fs from "fs"
import { exec as _exec } from "child_process"
import { promisify } from "util"
const exec = promisify(_exec)

const gitFileDates = async (outFile) => 
  exec(`git log --reverse --date=short --format=%ad -- ${outFile}`)
    .then(({stdout}) => stdout.split('\n').filter(Boolean))


postDates().then(async publishDates => {
console.log(publishDates)
  const loads = publishDates.map(async ({name, post, dates}, i) => {
    const markdown = await fs.promises.readFile(post, 'utf-8')
    const limit = i === 0 ? 500 : 200;
    //TODO: use `layout` here to control the result
    return parse(markdown, { dates, limit })
  }, [])
  // get snippits
  const [latest, second, third, ...others] = await Promise.all(loads)
  // put snippets into index template
  // TODO: put the different markup results directly into a doc
  const homepageMarkup = home(latest, second, third)
  // write html
  console.log(homepageMarkup)
})

async function postDates () {
  const files = await fs.promises.readdir('docs', {withFileTypes: true})
  const dirs = files
    .filter(dirent => dirent.isDirectory())

  const sources = (await Promise.all(
    dirs.map(async d => {
      const post = `posts/${d.name}.md`
      return await fs.promises.stat(post)
        .then((f) => f.isFile() ? {name: d.name, post } : null)
        .catch((e) => null)
    })
  )).filter(Boolean)
  
  const publishDates = (await Promise.all(
    sources.map(async s => {
      const dates = await gitFileDates(`docs/${s.name}/index.html`)
      return {
        ...s,
        dates
      }
    })
  )).sort((a, b) => {
    // produce ascending order; a more recent date is "less"
    const ad = a.dates[0], bd = b.dates[0];
    if (ad && bd){
      if (ad === bd) {
        return 0
      }
      return ad > bd ? -1 : 1
    } else if (ad) {
      return -1
    } else if (bd) {
      return 1
    }
    return 0
  })

  return publishDates
}
