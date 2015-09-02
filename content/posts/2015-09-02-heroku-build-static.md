title: Node.js static file build steps in Python Heroku apps
date: 2015-09-02
category: posts
tags: [heroku, python, node]
---

I write a lot of webapps. I like to use Python for the backend, but most
frontend tools are written in Node.js. LESS gives me nicer style sheets, Babel
lets me write next-generation JavaScript, and NPM helps manage dependencies
nicely. As a result, most of my projects are polyglots that can be difficult to
deploy.

Modern workflows have already figured this out: *Run all the tools*.  Most
READMEs I've written lately tend to look like this:

```bash
$ git clone https://github.example.com/foo/bar.git
$ cd git
$ pip install -r requirements.txt
$ npm install
$ gulp static-assets
$ python ./manage.py runserver
```

I like to deploy my projects using Heroku. They take care of the messy details
about deployment, but they don't seem to support multi-language projects easily.
There are Python and Node buildpacks, but no clear way of combining the two.

Multi Buildpack
===============

[GitHub is littered with attempts to fix this by building new buildpacks.][search]
The problem is they invariable fall out of compatibility with Heroku. I could
probably fix, but then *I'd* have to maintain them.  I use Heroku to avoid
maintaining infrastructure; custom buildpacks are one step forward, but two
steps back.

[search]: https://github.com/search?utf8=%E2%9C%93&q=heroku+buildpack+python+node&type=Repositories&ref=searchresults

Enter [Multi Buildpack][], which runs multiple buildpacks at once.

It is simple enough that it is unlike to fall out of compatibility. Heroku has a
fork of the project on their GitHub account, which implies that it will be
maintained in the future.

[Multi Buildpack]: https://github.com/heroku/heroku-buildpack-multi

To configure the buildpack, first tell Heroku you want to use it:

```bash
$ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-multi.git
```

Next, add a `.buildpacks` file to your project that lists the buildpacks to run:

<span class="codepath">./.buildpacks</span>

```text
https://github.com/heroku/heroku-buildpack-nodejs.git
https://github.com/heroku/heroku-buildpack-python.git
```

The order here is the order that the buildpacks will run in, so it can be
significant. In theory, earlier buildpacks will be available in later build
packs, which can be useful for build tools.

The Problem With Python
=======================

There's one problem: The Python buildpack moves files around, which makes it
incompatible with the way the Node buildpack installs commands. This means that
any asset compilation or minification done as a step of the Python buildpack
that depends on Node will fail.

The Python buildpack automatically detects a Django project and runs
`./manage.py collectstatic`. But the Node environment isn't available, so this
fails. No static files get built.

There is a solution: `bin/post_compile`! If present in your repository, this
script will be run at the end of the build process. Because it runs outside of
the Python buildpack, commands installed by the Node buildpack are available and
will work correctly.

This trick works with any Python webapp, but lets use a Django project as an
example. I often use [Django Pipeline][] for static asset compilation. Assets
are compiled using the command `./manage.py collectstatic`, which, when properly
configured, will call all the Node commands.

[Django Pipeline]: https://github.com/cyberdelia/django-pipeline

<span class="codepath">./bin/post_compile</span>

```bash
#!/bin/bash
export PATH=/app/.heroku/node/bin:$PATH
./manage.py collectstatic --noinput
```

Alternatively, you could call Node tools like Gulp or Webpack directly.

In the case of Django Pipeline, it is also useful to disable the Python
buildpack from running `collectstatic`, since it will fail anyways. This is done
using an environment variable:

```bash
heroku config:set DISABLE_COLLECTSTATIC 1
```

> Okay, so there is a little hack here. We still had to append the Node binary
> folder to `PATH`. Pretend you didn't see that! Or don't, because you'll need
> to do it in your script too.

That's it
=========

To recap, this approach:

1. Only uses buildpacks available from Heroku
2. Supports any sort of Python and/or Node build steps
3. Doesn't require vendoring or pre-compiling any static assets

Woot!
