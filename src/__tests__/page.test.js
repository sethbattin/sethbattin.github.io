import { parse } from "../page.mjs"
describe("page", () => {
  const testMarkdown = `
Some Markdown
=============

this file exists.
      `
  it("parses markdown", () => {
    const { markup } = parse(testMarkdown)
    expect(markup).toMatch("<h1 id=\"some-markdown\" itemprop=\"headline\">Some Markdown</h1>")
    expect(markup).toMatch("<p>this file exists.")
  })
  it("produces an article", () => {
    const { markup } = parse(testMarkdown, {dates: ['2022-01-10']})
    // crude body selector
    const article = markup.split('body>\n')[1].slice(0, -2)
    expect(article).toMatchInlineSnapshot(`
"    <article itemscope itemtype=\\"https://schema.org/Article\\">
    <h1 id=\\"some-markdown\\" itemprop=\\"headline\\">Some Markdown</h1>
<time datetime=\\"2022-01-10\\" itemProp=\\"datePublished\\">
  Mon Jan 10 2022
</time>
<p>this file exists.
      </p>

    <address>
      By <a href=\\"/seth-battin\\" itemprop=\\"author\\" rel=\\"author\\" itemscope itemtype=\\"https://schema.org/Person\\">
        <span itemprop=\\"name\\">Seth Battin</span>
      </a>
    </address>
    </article>
  "
`) 
  })
})
