Under Construction 2: Visual Design
===================================

Alternate title: from-scratch CSS misadventures in emulating print media; how I
learned to stop worrying and love css columns and flex-box.

> Creating an appealing look and feel for a public blog is [Fun].  Everything 
> that can go wrong does for a non-expert like me.  This is the 2nd entry in a
> 3-part series about building a website from scratch. The unpublished but
> ostensibly first entry in this series is [here: Blogging with Markdown][prev].

After [being personally attacked][next] about building a blog instead of writing
content for it, I further ~was dog-piled~ felt seen by folks noting that it was
equally likely we'd waste our time in style-sheets instead of making the platform.
So, so true.

But now being on the other side of that process, I'm happy to have spent the 
effort.  I like the look and am excited to refine it further.  This article 
will introduce additional items that I need to style, and I'm genuinely looking
forward to it.  Among those new features: the 3rd article on the home page (the
intended maximum number), block-quote-based large text blurbs, aside elements, 
and various inter-linking exercises like categories and prev/next relation links.  
Huzzah!

Motif
------

I went with a newspaper look.  Early reviews suggest that the attempt was at 
least partially successful.  I broke from web-typical and did not make line 
space between paragraphs.  Instead I added first-line indentation.  That coupled
nicely with a long-time fascination of mine: emulating [illumination].  I know
I have attempted it in the past and failed, so I was surprised at the easy 
solution in modern css using first-letter pseudo selection.

<aside>

I know illuminated manuscripts don't have a direct lineage to modern multi-media,
but I can't help but notice how similar they are.  The simple act of jazzing up
some writing with a little artistry...that's what websites are all about, right?
That it's no longer the sole domain of cloistered practitioners is wonderful.

</aside>

But the absolute best part: **COLUMNS!**.  [Css-based columns][css-columns] are
a thing, and they are amazing.  They look exactly like the theme, and they're 
surprisingly simple to control.  Elements that need to go across columns can 
do so with `column-span`.  The gap is controllable with `column-gap`.  If we 
set `column-count: auto`, we can control the width by specifying sizes in 
[`ch` css units][ch-units], so a column never has too many or too few words.  
If we combine all this with flex-box to control the overall height of the 
content, we can absolutely nail the newspaper look.

Is the look any good?  Who knows.  It was easy for me to imagine, and I like it.

Readability & Responsiveness
----------------------------

Responsive design is super-hard.  Part of the reason I want to make a blog with
simple markup is so that it can be read in a variety of conditions.  But basic
support of multiple device sizes is somehow a much bigger difficulty that just
writing HTML without a bunch of wacky javascript nonsense.

For similar reasons as to why [I don't want javascript on this blog][js-free], 
I also don't want to use css builders.  It feels like the kind of project 
overhead that I don't want to take on.  But I have to admit that writing all 
the width breakpoints by hand kind of sucks.  The only repreive came from the
fact that the markup is so simple there just aren't that many things to style.

<aside class="big">

Did you know that css itself can be an [tag-a11y] concern?  Specifically if you
override the normal look of interactions, it can throw off users who are not 
comfortable with operating a website.  I sure didn't know that until I looked up
[how to make text selection black and white][css-pseudo-selection].

> *Don't override selected text styles for purely aesthetic reasons* — users 
> can customize them to suit their needs. For people experiencing cognitive 
> concerns or who are less technologically literate, unexpected changes to 
> selection styles may hurt their understanding of the functionality.

Yeah I guess I'll leave it alone.  But given the undetrimental choice, I would
like it to match my dull color scheme.

</aside>

Hamburger, hold the javascript
------------------------------

If I'm aiming for simple and accessible, then I can't do the sadly typical thing
for mobile websites and display completely different markup in one scenario 
versus another.  One place where that happens frequently is the site menu.  It
collapses into a top-edge little icon that expands to show a list of links.  The
desktop menu is relatively obvious or simple, but completely disimilar.

Is it possible to use one set of markup but achieve the effect anyway?  And avoid
special rendering via javascript?

Yes it is possible!  The amazing [`<details>` element][details-element] shows 
and hides with no js whatsoever.  (Well...almost zero.)  More detail about that
will come in what I intend to be my first really deep-diving technical article's 
subject.  I think I could make re-usable library and a minor splash republishing
on one of the technical public blogs.

Suffice to say: my css here was quite clunky, but I was able to make it happen.
It was curiously difficult to find the three-lines icon without loading some
goofy font-based library or whatever.  But the attempt sent me a long, enjoyable
goose chase involving [various unicode and ascii art][box-drawing-characters].

This was supposed to be a failblog
----------------------------------

I assure you, the css was a major struggle.  I published an article first, then 
the home page, so all my styles were basically broken when I ported the content
over.  And then I had to retroactively add specificity, which sucks.  And the
breakpoints were pretty horrible to deal with.  I loosely knew I _should_ use
rem units for text, but I didn't really understand why, and I foolishly set the 
base size for headings instead of readable plain text.  Big :facepalm: on that.  

Overall, I spent hours and hours and hours, and I did not produce very much.

But in spite of all that, in retrospect it just wasn't that bad.  I got it where 
I wanted it to be.  There's some kind of personal lesson here about not expecting 
failure, maybe.  I definitely believe in the edict of not depicting a technical 
task as impossible to do well, because I think it sets a bad tone.  Someone who 
believes something will suck no matter what will not even attempt to do a good 
job.  And some folks avoid tasks entirely if they aren't guaranteed to be 100% 
successful. That's no good; struggle is valuable.  Even if i had learned nothing,
I would still feel proud of having built something that I wasn't certain I could.

For my CSS, I put my head down and got through it.  And that worked.  This isn't 
some blasé neurotypical motivational speech, by the way.  I know how useless 
that is; I perpetually struggle to accomplish simple tasks, even when i have a 
full understanding and skill set required for it.  I am simply marveling at the 
fact that even though it took me far longer that I might have guessed (adult-adhd
symptom two for a single paragraph), I worked on it, and now I get to be happy
with the results.  That's pretty cool, in my opinion.

Though I guess I did apply one productivity hack for non-visual software engineers 
like me: [TDD].

Tools for Techies
-----------------

Having realized a mistake with rem units, I resolved to fix that.  But I had 
already sunk so many hours into making that article look _just so_ that I didn't 
want to think about the manual effort of revising it.

Plus...you just can't.  No one can.  A person cannot retain a mental image of 
a rendered web page and reconstruct it one line of css at a time.  I doubt even 
a css master could do that, even in one smooth movement of typing without 
mistakes or wiping.  A human design implementer needs a way to remember what a
page looked like before futzing with the base size, and then refer back to that 
frequently.  They need some kind of snapshot or..._regression test_.  **OMG.**

It was a real eureka moment, when I realized that I needed visual regression.
I am a very, very longtime proponent of the concept.  I have advocated it at 
my last three professional engagements and wrote a short white-paper about how
simple it _should_ be to accomplish.  I have endured constant naysayers telling
me how it can't be done, up to and including the day I literally built one 
during a two-day hackathon.  I won the tech award for that.

<aside>

The white-paper lists a simple recipe for visual regression testing:

1. the ability to generate deterministic screenshots
2. A test-running system extensible enough to compare current screenshots to references
3. A report format that allows quick diagnosis of visual errors

Read more here: [vizreg-recipe]

</aside>

And yet I've never productionized one.  Well...today was the day.  If it's so
simple and easy, then let's prove it.  Maybe a simple web API, e.g. [ScreenCapture]?
Nah, that turned out to be not really accessible from a CLI without a ton of 
work; not the right idea.  

I altavista'ed for browser automation and first found [puppeteer].  I know the 
name, and we use it at my workplace.  And it sucks.  After installing multiple 
system libraries it still didn't run.  This may have been the fault of me using 
outdated WSL as a dev environment, but IMO that's still something of a deal-breaker.

Then I reminded myself of an plucky project from a young upstart company called 
MicroSoft: [playwright].  It offered wonderful qualities: demo usage that made
screenshots, another use case that hilariously does verbatim what puppeteer
tried and failed to do, and further into the docs...le pièce de résistance...

It will not only create screenshots, those screenshots can be passed directly 
to a snapshot-style assertion, and that assertion reports itself into an HTML
document, and that document _shows the difference_.  It's exactly what I had
been pining for over nearly a decade.  And it was relatively easy in a nice 
package.  My recipe was outdated before I had ever used it.

Of course I committed bike-shedding in the first degree on using this tool as
well, but I am only a mortal web engineer.  I added miles and miles of special
config setup so I could test my rem units.  But at the end: it automatically 
runs at all my responsive design breakpoints!

Big gulps, huh?
---------------

I'm not sure how to wrap this one up.  I can say that I'm feeling pretty decent
between the discovery of a simple visual regression testing solution and my 
lingering sense of accomplishment.  If you'd like to comment on my web styling
chops, send me a note.  Maybe that contact info will exist on the blog by the
time you read this.

<a href="./ice_art_full.jpg">
<img src="./ice_art.jpg" alt="a tower built from dyed ice blocks" title="I definitely _have_ style; having does not denote calibur." width=250 height=350 />
</a>


[Fun]: https://dwarffortresswiki.org/index.php/DF2014:Losing "Losing is Fun - Dwarf Fortress wiki"
[illumination]: https://en.wikipedia.org/wiki/Illuminated_manuscript "Illuminated manuscripts - Wikipedia"
[css-pseudo-selection]: https://developer.mozilla.org/en-US/docs/Web/CSS/::selection#accessibility_concerns "CSS ::selection pseudo element accessibility concerns - MDN Web Docs"
[css-columns]: https://developer.mozilla.org/en-US/docs/Web/CSS/columns "CSS columns - MDN Web Docs"
[ch-units]: https://developer.mozilla.org/en-US/docs/Web/CSS/length "CSS length - MDN Web Docs"
[js-free]: /javascript-free-in-2023/ "Javascript-free in 2023"
[details-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details "Details Element - MDN Web Docs"
[box-drawing-characters]: https://en.wikipedia.org/wiki/Box-drawing_character "Box-drawing characters - Wikipedia"
[TDD]: https://en.wikipedia.org/wiki/Test-driven_development "Test-driven development - Wikipedia"
[vizreg-recipe]: /visual-regression-design/ "Design pattern for a visual regression testing system"
[ScreenCapture]: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture "ScreenCapture API - MDN Web Docs"
[puppeteer]: https://developers.google.com/web/tools/puppeteer/get-started "Puppeteer quick start"
[playwright]: https://playwright.dev/docs/test-snapshots "Playwright testing, visual comparisons"
[tag-a11y]: /tag/science/programming/accessibility/ "Accessibility"

[next]: /under-construction-3/ "blog under construction part 3 - what audience and why bespoke"
[prev]: /blogging-with/markdown/ "Blogging with markdown"


