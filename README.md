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
- [ ] private submodule for drafts
- [ ] css & layout
- [ ] use tagged releases instead of branch deploys?
- [ ] spelling, grammer, and readability checker?
- [ ] add a tagging system


- DNS/hosting - solved circa March 2021
- nextjs/mdx - started shortly after, but abandoned.  Giant pain in butt.
- markdown MVP - start late in 2021...so late it's 2022 as I type this - complete Jan 1 2022 :party:
- css & layout start ~ Jan 11th
- private drafts start ~ Jan 11th

How it works
------------

This is a git repository, it's used for github-io which is Github's hosting. I
further pointed it at an external domain via google's DNS registration.

Anything in /docs is public on the internet at the address specified in the 
CNAME file.

This repository holds the raw content and the published content.
