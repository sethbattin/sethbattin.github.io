# Under Construction part 1: Blogging with markdown

> Alternate title: javascript free in 2023.  It should be easier than this.
> Dare I say that was the whole point; to be able to write with zero friction,
> and for that writing to be easily converted to publishable html.  But
> boy-howdy did it take some effort to get up to speed.

<aside>This is the first-in-order, third-in-publishing article of a multipart
series about building a blog.  The <a href="/css-misadventures/" rel="next">
next article is about css</a>.</aside>

This article mostly aims to collect and recollect my thoughts about writing on
the internet.  How I want to exercise and enjoy the task.  To answer that "how"
question in a single word: "simple".  I want it to be as easy as sitting down
([lol just focus, what's the problem][adult-adhd]), typing words, and [pushing
"publish"][publish-scripts].  I think that goal is entirely feasible for a blog
system to provide, for it to both have the benefit of being functional *AND* not
obstruct me with high-effort, painful chores.

But as a software expert I know that when computers are simple to use, it means
someone somewhere spent time making all the complexity invisible.  Usually many,
many people over a very long time.  I wanted a system for blogging that was
easy, but I had not yet invested the effort to make it so.  If you are reading
this, I will assume I was eventually successful.

As usual I will try to avoid burying the lede; spoilers, the title is correct.
I chose to type into text files using a format called [markdown].  It is
readable without any post-processing whatsoever.  Because it's text.  Its
formatting conventions make it somewhat aesthetic too; headings look important,
lists look like lists, and it even makes [hypertext] look interactive.  And
finally it can be transformed into HTML-proper easily.  Great, perfect choice!

In markdown's case "easily" is an [exercise typically left to the
reader][quizzing is not helping].  Since I didn't care to literally implement
the specification from scratch, I instead [stood on the shoulders of
giants][using-libraries] and
assembled a system from preexisting software.  [More details
below](#implementation-details), or read on for more treatise on the philosophy
of the open internet.

## HTML and the web

The basic idea of connecting computers together over long distances, the premise
of the internet, started simply enough.  Scientists sharing their research on
opposite ends of the globe.  Also mega-militaries were trying to eek out a
marginal pyrrhic victory in a war that would destroy all life, but they've
always done that.  The science folks just wanted to send their simple computer
files back and forth; to share their data and writing.  They created software to
send this information, and early builders in silicon valley created mass-appeal
document viewing applications called "browsers" that could render a simple
format called HTML.

HTML stands for "hyper-text markup language".  The "hyper" here is in the
mathematical sense of the word.  Like a hyper-cube is conceptually similar to a
cube but with more dimensions, hypertext is text with more dimensions.  And text
started with only one: you read in a line from start to finish.  Maybe you skip
forward or back or repeat, but that's still just one axis you're moving along.
On the web, you can start reading something, then choose to follow a link
somewhere else.

If you're not yet facsinated by that idea of non-linear reading and ideas, you
clearly didn't read enough [choose your own adventure] books as a child.  They
were marvelous games in book form.  This idea dates back almost a century,
albeit with convoluted technique, machinery, and great effort by authors. In the
modern world we have it at our fingertips any time we want.  And so does anyone
who cares to read it.

I can write here, I can interlink my various writing, and if someone finds any
particular article they can find the rest of them.  That's the magic of the
internet: shit's both free and awesome.

## Complexity and Capitalism

As good ideas are wont to do, they were the subject of desire for more goodness.
In the case of web content, we wanted more graphics, fancier typefaces, video,
endless cool new stuff.  We also wanted the standards to make sense and be
useful because good ideas are rarely perfect right out of the gate and typically
need refinement.  tl;dr we attached new motivations to the original simple
ideas.

Every time you add new goals to a system, it gets more complex.  And the new
goals conflicted with the original design goals, and simplicity lost its spot as
an important feature.  c'est la vie.

There were also disagreements.  Different folks holding different ideas about
what is most important; nothing^ more sinister than that.  They resolved their
conflicts in a generally wholesome way, with different parties trying different
things at the same time.  We learned which worked best experimentally; that's
still good science even if not traditionally rigorous.  (^ There were also legit
bad actors actively trying to ruin things, but let's ignore that for brevity's
sake.)

<aside class="small">Just kidding let's talk about it.

In the early internet days, there were interests that literally tried to stop
the web from existing.  Not everybody was happy for things to be free,
especially if free was in direct competition with something they would like to
continue to profit from.  The most notable example was [microsoft's anti-trust
judgement][us-v-microsoft].  They tried to avoid fair competition, and got a
corporate slap that seems mythically impossible in the modern environment of the
United States.

Those court proceedings revealed something else.  Microsoft's imfamously rumored
internal coporate strategy of EEE, "[embrace, extend, extinguish]" was also found
to be a fact.  They literally built internet explorer to actively ruin the
internet.  You always knew it in your heart; now you know it's reality.  You
thought you hated that company for its crappy OS updates that Apple now does their
best to "innovate" in exactly the same terrible way.  Turns out you should hate
it for the same reason as ever: [rampant greed is bad for everyone,
actually][exceptional-billionaires].

They've really turned their act around lately.  They love the internet now; it
helps them sell cloud hosting for military applications much more easily.  They
technically host this blog too, since it's a github page :shrug:.
</aside>

## Tech to the rescue

Ok so being a grown-up sucks, even for ideas as great as the internet.  Can't we
get back to that simpler time when it was just marquee text and flashing, tiled
background images?  Or at least putting text and pictures on a website without
learning 30 years of technology history?

Yes.  Markdown was explicitly designed to bridge the gulf between text and HTML.
Instead of convoluted mark-"up", take all that minutia and turn it into
something simple to express.  This is what all "technology" aims to do.  For
markdown, that means giving folks a way to make the majority of HTML trivial to
write.  It leaves open the ability to fall back to increased complexity (through
the simple act of allowing HTML to be written verbatim), but adds the option to
express simple parts simply.  Perfect; exactly what I was looking for.

Unfortunately markdown is quite literally a concept rather than a tool or even a
plan.  It was a set of rules for how to transform specific simple bits of text
into specific simple parts of HTML.  But it was not perfect or even complete,
and it rapidly gained adoption among many folks who realized its limitations and
wanted to change it with more features.  Deja vu, eh?

But even if markdown is now also deviated from its simple roots, it's still a
really nice idea.  And like the internet, I want to keep up the spirit of the
idea even if the practice has completely spiralled out of control.  Anyway,
here's me attempting to use it.  That's what this article is really about.

## Failures as a learning exercise

To gain expertise, to learn any skill, is partly a matter of learning how to do
something correctly.  But if that were the natural outcome of trying, then no
learning would be required and the skill would have no value.

The real learning is in knowing what to avoid.  I hope to list here a long set
of failures that might help someone else gain skill faster than I did.

Failure 1: [building from scratch].  This is so common it's a joke.  At least I
went in with my eyes open.  That didn't save me from re-learning the hard lesson
that it definitely makes sense to just get a wpengine account or whatever.
Life's too short.

Failure 2: Violate all known best practices.  I don't know why I didn't like
anything I had seen from pre-existing markdown blogging systems.  I just didn't.
I did learn in a lot of cases why those unsavory choices were made.  Hubris is a
hell of a drug.  My system is marginally better for goign through this pain IMO,
but I can't honestly say it was a "good" choice to make.

Failure 3: Skip complexity of easily available systems, then attempt to handle
unbelievable complexity of tools that permit doing it manually.  Good lord...
markdown tech is not straightforward.  Neither is nodejs, and I have literally
worked in that language every day for the last half decade.  Computers might
have been a mistake altogether.

Failure 4: [css].  I'm not sure I need to elaborate here; suffice to say that
not every idea from the early internet was a winner.

## design philosophy

It wasn't all bad.  I had a pretty good notion in mind about what I wanted:
There are things I can't yet do, but I've covered a high fraction of those goals
so far.

Goal 0: I want to make a system where I can write markdown and produce html.
Goal 2: I want that html to be very simple, accessible, and functional
Goal 3: I want to avoid creating special-case markdown to accomplish html nuances
Goal 4: I want to build a featureful blogging platform within the above contraints.
Goal 5: I want to avoid storing metadata; markdown input, web-root output only.

I also retain some high-level goals like respect for readers, especially their
privacy.  I also don't want to require an iphone or even youtube-bandwith.
That's also the spirit of the web, so sayeth I.

## Implementation Details

Alrighty....took me long enough to get down here.  Here's how it works.  By the
way you can also just [read the instructions][publish-scripts] and the rest of
the code at any time.  I keep some article drafts private, but the code and
published articles are public, yet again in the spirit of the internet.

- No database except git and the filesystem
- posts are markdown files with no frontmatter (because I hate it).
- markdown processing is just custom enough to extract meta-data that
  frontmatter probably should be providing; otherwise vanilla
- file names are document titles and URLs; heading tags (including h1s!) are not
  off-limits like some other markdown systems
- publish dates are based on commits in the public directory.  automatic errata
  marking coming soon (not very soon).
- the only metadata is the rss file, and that's still internet-spirit published
  artifact.  Categories are the same, though they have markdown source
  descriptions.  Still simple.
- I add images to the public folder, which works just like a public web folder
  like God intended.  gfs-support coming soon (never).
- I use block quotes, asides, and links for their best bloggy purpose within the
  html spec.  They cover a lot of use cases, check out [the rel
  attribute][rel=tag] - i use it for categories links.
- Zero^^ javascript by default.  I put a silly inline-onclick to load a twitter
  embed.  Big kudos to twitter^^^ for making the embed work script-free!
- there is a css file.  _One._  4k selectors should be enould for anyone.
- goofy stuff to produce the teasers on the homepage, but that was good fun.


---

( ^^ There's a media-query detector for the mobile hamburger menu's open-state;
it's an aside-tag!  Zero duplicate markup and still opens and closes!  Still
planning a whole article about that awesome creation.)

( ^^^ If Elon ruins that I'll have to pick a different pet billionaire for whom
to be an apologist.)


## Rejected tactics

I mean I tried a lot of things on this journey, but in particular:

- gatsby, hugo, and other markdown blogging systems (frontmatter is bad even if
  github renders it properly now)
- nextjs - super overkill, and setting up MDX was not fun or easy.  I'll figure
  it out soon (....maybe).
- vercel et al.  They collect usage stats on an opt-out basis?  jfc folks.
- no google analytics.  It'd be cool to know that i'm being read, but not cool
  enough to track folks.  Plus I can make a cool joke about cookies on this site
  being a problem for the user to deal with.  No PII for me.


[tag-opinion]: /tag/opinion/ "There's a lot of non-fact in here"
[tag-society]: /tag/society/ "Yeah this is the world we live in"
[tag-science-prog]: /tag/science/programming "always.  always."
[adult-adhd]: /focus-time/ "The endless pursuit of the ability to accomplish
anything whatsoever"
[publish-scripts]: https://github.com/sethbattin/sethbattin.github.io/blob/main/INSTALL.md#publishing "publishing instructions to myself for this blog"
[quizzing is not helping]: /quizzing-is-not-helping/ "An article about how
colleagues need help and answers, not further struggle for their own good"
[markdown]: https://en.wikipedia.org/wiki/Markdown "Wikipedia: Markdown"
[using-libraries]: /homemade-anti-heroes "Building from scratch is educational
but not erudite"
[choose your own adventure]: https://en.wikipedia.org/wiki/Hypertext_fiction "Wikipedia: hypertext fiction"
[us-v-microsoft]: https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp. "Wikipedia: United States v. Microsoft Corp"
[embrace, extend, extinguish]: https://en.wikipedia.org/wiki/Embrace,_extend,_and_extinguish "Wikipedia: embrace, extend, and extinguish"
[exceptional-billionaires]: /expectional-billionaires/ "Wealth hording and if it's ever ok (it's not)"
[building-from-scratch]: /under-construction-3/ "Programming a blog system instead of just using one like a rational person would do"
[css]: /css-misadventures/ "Ever written CSS before?  If so I'm sorry, but no one can ever take away the strength we gained from our struggle"
[rel=tag]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#attr-tag "MDN: HTML attributes"
[unused]: https://google.com "an unused link to test marked.js"
[programming]: /tag/science/programming/ "Tagged as Programming under science"
