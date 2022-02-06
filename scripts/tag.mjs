import assert from "assert"
import { publishTag } from "../src/tag.mjs"
import { INDEX } from "../src/settings.mjs"

const [nodeBin, script, fileName] = process.argv
const inputMessage = "specify a published tag file from docs/tag/"
assert(!!fileName, inputMessage)
assert(fileName.indexOf('docs/tag/') === 0, inputMessage)

const tagPath = fileName.replace('docs/', '').replace(INDEX, '')
const tagName = tagPath.split('/').filter(Boolean).pop()
publishTag(tagName, tagPath).then(({tagOutFile}) => {
  console.log(`published tags/${tagName}.md to ${tagOutFile}`)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
