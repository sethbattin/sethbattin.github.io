Installation
============

This project builds web assets from markdown files, mainly a personal blog.
These instructions are mostly partially notes-to-self for posterity.  I don't
want to forget how to run my own site.

NodeJS
------
Non-browser javascript setup:
1. Install nodejs (including npm, npx, etc.)
2. Run `npm i` in the root

### Optional older nodejs:
Because the main markdown processor is ES-module code, it can fail to run on
older version of nodejs and npm.  NodeJS versions down to 12 can work as long
as they include the `--experimental-modules` flag when running node.  Because
this flag would be bothersome to type for older versions and unnecessary for
newer versions, the markdown processor library is wrapped in a runner-script
specified in the package.json file.  This script looks for the npm config
setting `xmod`.

To use this flag:
1. Set local user config with `npm config set -- xmod --experimental-modules`
2. Run the markdown process wrapper script normally `npm run mark`

Markdown
--------
Markdown processing is provided by the nodejs module [marked].  This library 
can receive markdown from stdin and return html to stdout, or specify other 
file io.  It can also operate as a javascript module.

```bash
npm run mark -i INSTALL.md
# <h1 id=installation>Installation</h1>
# ...
```



[marked]: https://marked.js.org/ "Marked - markdown processor for javascript"
