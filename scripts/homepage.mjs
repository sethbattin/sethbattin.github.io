import fs from "fs"
import { exec as _exec } from "child_process"
import { promisify } from "util"
const exec = promisify(_exec)

const gitFileDates = async (outFile) => 
  exec(`git log --reverse --date=short --format=%ad -- ${outFile}`)
    .then(({stdout}) => stdout.split('\n').filter(Boolean))


postDates().then(publishDates => {
console.log(publishDates)i
  // get snippets
  // put snippets into index template
  // write html
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
