Under Construction 2: Visual Design
===================================

> Creating an appealing look and feel for a public blog is [Fun].  Everything 
> that can go wrong does for a non-expert like me.  This is the 2nd entry in a
> 3-part series about building a website from scratch.  Luckily order doesn't 
> matter for the middle one; but the article about why I want to write this 
> way is [next].  The unpublished but ostensibly first entry is about the 
> technical format, and it's [here][prev].

After [being personally attacked][next] about building a blog instead of writing
content for it, I further ~was dogpiled~ felt seen by folks noting that it was
equally likely we'd waste our time in stylesheets instead of making the platform.
So, so true.

Motiff
======

Readability & Responsiveness
============================

Responsive design is super-hard

<aisde>
Did you know that css itself can be an [tag-a11y] concern?  I sure didn't until
I tried to [look up how to accomplish it:](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection#accessibility_concerns)

> *Don't override selected text styles for purely aesthetic reasons* — users 
> can customize them to suit their needs. For people experiencing cognitive 
> concerns or who are less technologically literate, unexpected changes to 
> selection styles may hurt their understanding of the functionality.

Yeah I guess I'll leave it alone.  But given the undetrimental choice, I would
like it to match my dull color scheme.

Hamburger, hold the javascript
==============================

The amazing [`<details>` element][details-element]...it shows and hides with no
js whatsoever.  Well....almost zero

Lost art of Columns
===================

[`css` columns] is my dream.  It thinks like I want.  But boy howdy does it run
into issues with other systems.  

Tools for Techies
=================

Having realized my mistake with rem units, I resolved to fix that.  But I had
already sunk so many hours into making that article look _just so_ that I didn't
want to think about the manual effort of revising it.  Plus...you just can't.

You cannot retain a mental image of a rendered webpage and reconstruct it one
line of css at a time.  I doubt even a css master could do that, even in one 
smooth movement of typing without mistakes or wiping.  I needed a way to 
remember what it looked like before futzing with the base size, and then refer
back to that frequently.  I needed some kind of snapshot or..._regression test_.

It was a real eureka moment, when I realized that I needed visual regression.
I am a very, very longtime proponent of the concept.  I have advocated it at 
my last three professional engagements and wrote a short whitepaper about how
simple it _should_ be to accomplish.  I have endured constant naysayers telling
me how it can't be done, up to and including the day I literally built one 
during a two-day hackathon.  I won the tech award for that.

<aside>
The whitepaper lists a simple recipe for visual regression testing:
1. the ability to generate deterministic screenshots
2. A test-running system extensible enough to compare current screenshots to references
3. A report format that allows quick diagnosis of visual errors
Read more here: [vizreg-receipe]
</aside>

And yet I've never productionized one.  Well...today was the day.  If it's so
simple and easy, then let's prove it.  Maybe a simple web API, e.g. [ScreenCapture]?

Nah, not really accessible from a CLI without a ton of work; not the right idea.  
I altavista'ed for browser automation and first found [puppeteer].  I know the 
name, and we use it at my workplace.  And it sucks.  After installing multiple 
system libraries it still didn't run.  This may have been the fault of me using 
outdated WSL as a dev environment, but IMO that's still something of a dealbreaker.

Then I reminded myself of an upstart project from a plucky startup called 
MicroSoft: [playwright].  It offered wonderful qualities: demo usage that made
screenshots, another use case that hilariously does verbatim what puppeteer
tried and failed to do, and further into the docs...le pièce de résistance...

It will not only create screenshots, those screenshots can be passed directly 
to a snpshot-style assertion, and that assertion reports itself into an html
document, and that document _shows the difference_.  It's exactly what I had
been pining for over nearly a decade.  And it was relatively easy.

<aside>
Of course I committed bikeshedding in the first degree on using this tool as
well, but I am only a mortal web engineer.  Plus it automatically runs at all
my responsive design breakpoints!
</aside>

[ScreenCapture]: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture "ScreenCapture API @ MDN"
[puppeteer]: https://developers.google.com/web/tools/puppeteer/get-started "Puppeteer quick start"
[playwright]: https://playwright.dev/docs/test-snapshots "Playwright testing, visual comparisons"

[next]: /under-construction-3 "blog under construction part 3 - what audience and why bespoke"



