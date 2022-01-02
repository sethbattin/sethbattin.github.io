import { page } from "./publish.mjs"

const filename = 'posts/starting.md'

console.log("trying", {filename})

page(filename).then(result => {
  console.log({result})
}).catch(e => {
  console.error(e)
})
