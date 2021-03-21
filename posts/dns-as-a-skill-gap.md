# DNS is not my expertise
Add it to my very long list of non-skills.  Luckily TDD, experimentation, and research _are_ in my skillset.

Kickstarting my writing efforts, once I decided about naming and services, required me to _actually_ combine google domains with github pages.  I [threw some shade](/starting) on my previous hosting solution for being bad, but I may have unfairly discounted one good aspect of their service.  When I bought that registration and objectively bad hosting, I knew that if I put files into my folder on the shared server then DNS would resolve requests to them.  And I had a reasonable understanding of what it meant for an http request to arrive on a server, and how my files would react to such a request.

What I never understood, apparently, is what it actually means to set up DNS.  This makes sense in retrospect because I never had to set it up or actually understand it.  For one thing, I didn't even pretend to mess with subdomains or aliases or debugging.  And if I'm being honest, I had no idea what I was reading in google domain's very simple, clean DNS.  Although they had inline help and common-language descriptions, that may have only served to make things seem easier than they were.  

Also negative was that it warned that changes might take a long time, multiple hours perhaps, to propogate.  That meant that I had to try things and wait.  Bad for my attention span (no one likes waiting), bad for my lifestyle (no guarantee I'll be able to follow up), and most of all bad for having any clue whether I had done things correctly or not.  Luckily I had a pretty simple test: visit the blog subdomain and see if it resolved.

Needless to say, my test kept failing long after the TTL could possibly be the culprit.

## Configuring Wrongly

I started with not knowing what DNS records I was adding or why, or how github would interact with them.  Github gave different instructions based on different ways to use a custom domain, and google had no knowledge of what I was intending to accomplish.  I guessed wrongly several times.  But some persistence paid off.  Here is the list of things I screwed up:

I tried using [github pages DNS servers][github pages ips] as my apex domain.  I'm not sure I know all the reasons this was wrong, except that `A/apex` records are aptly named: they're for the _top_ domain.  I was using a subdomain because I wanted to do more than blog on the host, and I didn't want to figure out how to host a path like `/blog`.  I'll put that on my list to figure out later.

I tried using a CNAME to point to an IP.  Again, not how it works.  CNAME is short for canonical-name, and it means associating one domain with another domain.  No IPs involved.

I tried setting up both, one apex to github's IPs and one CNAME to the default domain for a page.  I'm not sure if this was broken or not, but it was not sensible.  I read in github's docs that you use _either_ apex or cname, but not both.  I wanted the latter.

So finally I settled on the correct configuration.  blog.seth.how CNAME sethbattin.github.io.  And it still didn't work.

## I blame google's UI

Immediately prior to writing this, I resumed debugging using the tidbits I had picked up during previous attempts.  Mainly using the linux utility `dig` and reading the output.  Aside: I think that's the 3rd time in this blog post where I would have samed myself some time by reading more carefully rather than skimming.  I am taking that as a lesson for myself.

Googling let me to a handful of unhelpful stack overflows.  Turns out there are lots of fools out there failing to congfigure DNS correct, but there are too many ways to screw it up for the SO effect to work.  That, and too many commercial solutions wanting to take my money to solve my problem _without_ explaining the underlaying configuration.  I associate that behavior with enterprise software sales, and I strongly dislike it exactly because it stops me from learning.

I found a few articles that explained my `dig` results, unfortunately they only confirmed that I was definitely still not configured correctly.  `NOERROR` was the result.  But nothing was wrong; there was simply no answer.  On a whim I clicked on the export button in google's UI.  I started reading in detail, researching fields of the bind file format on wikipedia.  How time-to-live is defined (21600 is 6 hours worth of seconds, so that explains the warning I griped about earlier).  "Oh look at that" I thought, "that's why there's a period at the end of stuff!"  (It's the difference between full domains and relatives.  e.g. `www` would be relative to the apex, whereas the apex would be `example.com.`.  Good to know.

And there I saw it.  blog.seth.how.seth.how.

I have no way of knowing whether this was some kind of convention for registrar UIs, but I doubt it.  And in fact, I'm quite certain that the UI displayed this exact text "blog.seth.how.".  In other words, it was showing me a full domain with full domain conventions.  But under the hood it was a relative domain.  

Another lesson for me: be skeptical of even the UI.  God knows I understand how those go wrong on websites.

On the bright side, my test passes now.  Back to building something to build my html.
