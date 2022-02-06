import { parse } from "../src/page.mjs"
import { frontPage, headline, homepage} from "../src/layout.mjs"
import fs from "fs"
import { postDates } from "../src/docs.mjs"

postDates().then(async publishDates => {
  const loads = publishDates.map(async ({name, post, dates}, i) => {
    if (i > 2) { return Promise.resolve() }
    const markdown = await fs.promises.readFile(post, 'utf-8')
    const layout = i === 0 ? headline : frontPage
    return parse(markdown, { dates, layout, name })
  }, [])
  // get snippits
  const [latest, second, third, ...others] = await Promise.all(loads)
  // put snippets into index template
  const homepageMarkup = homepage(latest, second, third)  // write html
  await fs.promises.writeFile('docs/index.html', homepageMarkup)
})

