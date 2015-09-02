title: Node.js static file build steps in Python Heroku apps
date: 2015-09-02
category: posts
tags: [heroku, python, node]
---

Python webapps are pretty cool. Most frontend tools end up getting written in
Node.js. Things like Less for nicer style sheets, Babel to write modern JS
today, or NPM to manage front-end dependencies. The result is a lot of webapps
are polyglots that require more than just Python or Node.

In most workflows, this seems to be largely figured out. Just run all the tools.
Most READMEs I've seen lately have a box something like this

```bash
$ git clone https://github.example.com/foo/bar.git
$ cd git
$ pip install -r requirements.txt
$ npm install
$ gulp static-assets
$ python ./manage.py runserver
```

Unfortunately, Heroku doesn't seem to have gotten this memo. There is a Python
buildpack, and a Node buildpack, but no clear way of combining the two.

Multi Buildpack
===============

[GitHub is littered with attempts to fix this by building new buildpacks.][search]
The problem with the versions of this I looked at is they invariable fall out of
compatibility with Heroku. I could probably fix them up to work, but then *I'd*
have to maintain them. Not maintaining infrastructure like this is the reason I
use Heroku, so this seems like one step forward, one step back.

[search]: https://github.com/search?utf8=%E2%9C%93&q=heroku+buildpack+python+node&type=Repositories&ref=searchresults

Enter [Multi Buildpack][], which combines multiple Heroku buildpacks in a
pretty sane way. It is a very 'thin' buildpack, so there isn't much to fall out
of compatibility. I also assume that because Heroku has a fork of it, it will
stay up to date anyways. It combines buildpacks, so it can combine the official
Python and Node buildpacks. That means that it probably won't break randomly in
the future.

[Multi Buildpack]: https://github.com/heroku/heroku-buildpack-multi

To configure the buildpack, first tell Heroku you want to use it

```bash
$ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-multi.git
```

And then add a `.buildpacks` file to your repository, so the multi buildpack knows
what to do.

<span class="codepath">./.buildpacks</span>

```text
https://github.com/heroku/heroku-buildpack-nodejs.git
https://github.com/heroku/heroku-buildpack-python.git
```

The order here is the order that the buildpacks will run in, so it can be
significant. In theory, earlier buildpacks will be available in later build
packs, which can be useful for build tools.

Actually running it all
=======================

Unfortunately, in practice this doesn't totally work. Both buildpacks run. Both
Python and Node environments are available at runtime. However, due to hilarity
involving symlinks, relative paths, and moving files, the Python buildpack works
in a way that makes the Node environment unavailable.

The Python buildpack automatically detects a Django project and runs
`./manage.py collectstatic`. This is a pretty neat trick, that makes most
Django development work nicely. But the Node environment isn't available, so
this fails, and we are back to square one. No static files get built.

The solution lies in `bin/post_compile`. If there is an executable at that
path, Heroku will run it at the end of the build process. Since it runs after
the Python buildpack has undone the silly path tricks, the Node environment
will work. It is still required to fiddle with PATHs a little to make it all
work, but work it does!

This trick will work with any Python webapp. In the Django projects I do this
trick with, we use [Django Pipeline][]. All the static asset compilation
happens through a `manage.py collectstatic` command. This calls out to the Node
tools, so the build step relies on Node. Calling Node tools like Gulp or
Webpack would also work nicely, if that's how you roll.

[Django Pipeline]: https://github.com/cyberdelia/django-pipeline

<span class="codepath">./bin/post_compile</span>

```bash
#!/bin/bash
export PATH=/app/.heroku/node/bin:$PATH
./manage.py collectstatic --noinput
```

Finally, it is useful to tell the Python buildpack to stop trying to run
`collectstatic` itself, since it will fail anyways.

```bash
heroku config:set DISABLE_COLLECTSTATIC 1
```

That's it
=========

To recap, this approach

1. Only uses buildpacks available from Heroku
2. Supports any sort of Python and Node build steps.
3. Doesn't required vendoring or pre-compiling any static assets.
4. Only has a little `PATH` hack.

Woot!
