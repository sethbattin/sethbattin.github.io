<<<<<<< Updated upstream
# Blogging with markdown
> Alternate title: javascript free in 2023.  It should be easier than this.
> Dare I say that was the whole point; to be able to write with zero friction, 
> and for that writing to be easily converted to publishable html.

I will contradict myself almost immediately.  When computers are simple to use, it means someone somewhere spent time making all the complexity invisible.  Usually many, many people over a very long time.  I wanted a system for blogging that was easy to use, but I had not yet invested the effort to make it so.  If you are reading this, I will assume I was eventually successful.  At the time of writing I only have failures to report.

## Failures are the most useful information

To gain expertise, to learn any skill, is partly a matter of learning how to do something correctly.  But if that were the natural outcome of trying, then no learning would be required and the skill would have no value.  

The real learning is in knowing what to avoid.  I hope to list here a long set of failures that might help someone else gain skill faster than I did.

## The choices made for us

I started with the ideas I _should_ have understood well.
:
## design philosophy

Goal 0: I want to make a system where I can write markdown and produce html.
Goal 2: I want that html to be very simple, accessible, and functional
Goal 3: I want to avoid creating special-case markdown to accomplish html nuances
Goal 4: I want to build a featureful blogging platform within the above contraints.
Goal 5: I want to avoid storing metadata; markdown input, web-root output only.

### Technical methodologies:
Headings:
 - some markdown-publishing systems skip H1s in the files, e.g. github wikis
 - I want the filename to be the url, but the title to be document content
Categories:
 - use the html attribute [rel=tag] for categories based on the path convention `/tag/*`
 - implement a markedjs handler for links to inject the `rel` attribute for this path
Excerpt:
 - use a block quote
 - ....
 - profit
publish date
 - use git log dates
indexing
 - use the sitemap/rss xml for storing metadata

----
shorthand notes:

javascript and nextjs
 - i don't really care about language
 - i do care about tech, for professional reasons
mdxjs
 - prior experience
 - cookie-cutter setup 
setup
 - docs too simple; they hide what's happening
 - data collection by default WTF VERCEL
please no meta-data
 - story of techhub
 - turns out it's common for jeckle too
 - can't i just let the files store the article?
 - ffffff i'm tempted to put meta on the output side too; should be able to use SEO/RSS stuff instead
todo:
 - mdx external
 - next-mdx-remote example might do exactly that

[unused]

[/tag/yes-used]

[rel=tag]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#attr-tag "MDN: HTML attributes"
[unused]: https://google.com "an unused link to test marked.js"
[programming]: /tag/science/programming/ "Tagged as Programming under science"
