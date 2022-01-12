Seth Battin personal blog
=========================
I like to wax rheotircal; this is where I write it down.

I also like to program computers, so I'll make my own publisher here.  It's 
a work-in-progress.

All endeavors are susceptible to distraction and delay.  This readme is my 
scratch pad to avoid bikeshedding the core function of writing.

TODO
----
- [x] DNS, hosting, updating, etc.
- [x] Produce html from markdown
- [ ] Derrive publish and update dates from version control
- [ ] Create a good global layout
- [ ] SEO, analytics, and whatnot
- [ ] inter-linking pages like a real blog CMS
- [ ] image hosting?
- [ ] cool 2nd-buffer tool for deciding when to publish a draft document
- [ ] MDX stuff for frontmatter-or-whatever-you-call-it
- [ ] nextjs because it does all of the above jobs
- [x] private submodule for drafts
- [x] css & layout
- [ ] use tagged releases instead of branch deploys?
- [ ] spelling, grammer, and readability checker?
- [ ] add a tagging system
- [ ] create a "showworthy" feature list


- DNS/hosting - solved circa March 2021
- nextjs/mdx - started shortly after, but abandoned.  Giant pain in butt.
- markdown MVP - start late in 2021...so late it's 2022 as I type this - complete Jan 1 2022 :party:
- private drafts start ~ Jan 11th - easy but uses submodules; blog about that
- css & layout start ~ Jan 11th


How it works
------------

This is a git repository, it's used for github-io which is Github's hosting. I
further pointed it at an external domain via google's DNS registration.

Anything in /docs is public on the internet at the address specified in the 
CNAME file.

This repository holds the raw content and the published content.  I also keep 
some draft content in a git submodule that is not a public repo; not every-
thing that i type needs to be published.


Epic: show-worthiness
---------------------

### features
- [ ] index page
- [ ] about & contact & other non-articles
- [ ] footer (disclaimer, cookies)
- [ ] rss (as a cookie alternative)
- [ ] date & author
- [ ] basic images (its own featureset for non-basic)
- [ ] analytics
- [ ] seo stuff (robots, sitemap)
- [ ] micro-/structured-data for embedding
- [ ] spellcheck

### design
- [ ] refine the illumination
- [ ] dark mode
- [ ] color scheme
