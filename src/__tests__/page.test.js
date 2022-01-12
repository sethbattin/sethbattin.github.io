import { parse } from "../page.mjs"
describe("page", () => {
  const testMarkdown = `
Some Markdown
=============

this file exists.
      `
  it("parses markdown", async () => {
    expect.assertions(2)
    const { markup } = await parse(testMarkdown)
    expect(markup).toMatch("<h1 id=\"some-markdown\">Some Markdown</h1>")
    expect(markup).toMatch("<p>this file exists.")
  })
  it("produces an article", async () => {
    expect.assertions(1)
    const { markup } = await parse(testMarkdown, {dates: ['2022-01-10']})
    // crude body selector
    const article = markup.split('body>\n')[1].slice(0, -2)
    expect(article).toMatchInlineSnapshot(`
"    <article itemscope itemtype=\\"https://schema.org/Article\\">
    <h1 id=\\"some-markdown\\">Some Markdown</h1>
<time datetime=\\"2022-01-10\\" itemProp=\\"datePublished\\">
  Mon Jan 10 2022
</time>
<p>this file exists.
      </p>

    </article>
  "
`) 
  })
})
