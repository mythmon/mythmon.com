title: Using https:// for GitHub with Multi Factor Authentication
date: 2015-10-12
category: posts
tags: [github, config, mfa]
---

One way to authenticate with GitHub is using SSH. Your remote URLs look like
`git@github.com:mythmon/mythmon.com`  This means you get to re-use all your SSH
tools to deal with authentication. Agents, key pass phrases and forwarding are
all great tools.

The down side to all this is that *you have to use all your SSH tools to deal
with authentication*. That's actually kind of annoying for automation and
day-to-day sanity.

Another option to authenticate with GitHub is to use HTTPS URLs and use HTTP
basic authentication. For this, you use remote URLs like
`https://github.com/mythmon/mythmon.com`. The main advantage of this is that
the URL is useful even without authentication. You can pull from this URL
without authorizing (assuming you are working public repos). This means
automation and tooling need fewer secrets, which is great.

HTTPS URLs are also a great way to teach people, since they have a lower barrier
of entry. Anyone can type in a user name and password. Explaining SSH so that
that a newbie can get started using GitHub is no fun.

# Tricks to make HTTPS easier

Typing in usernames and passwords every time is really annoying though. There
are also some other issues to work out. Here is what I've discovered to make
things even better:

## Savings passwords

Most desktop environments have a way to store secrets. I use Gnome Keyring.[^1]
Git knows how to tie into secret-storage systems like this, but it needs some
help first. In `/usr/share/git/credentials` there are several directories with
tools to hook up Git to several secret-storage systems. For me there is
`gnome-keyring`, `netrc`, `osxkeychain`, and `wincred`. To set them up, invoke
`make` in the appropriate directory. If all goes well, the credential helper
will be built, and git will start remembering passwords for you. Yay!

> This assumes that you are using one of these secret storage mechanisms. If you
> aren't, I assume you're the kind of person that could either set one up, or
> read through git-credential-gnome-keyring (it's only 400 lines), and adapt
> it to use whatever secret store you want.

[^1]:
    Yes, yes, Gnome is sort of a dirty word to some people. But really,
    Gnome Keyring is quite lightweight. Its dependencies (on Arch) are `gcr`,
    and `libcap-ng`. It doesn't pull in the entire Gnome ecosystem (at least,
    it shouldn't).

    If you use KDE, I can't help you.


## Hub defaults

[Hub][] sets up SSH remotes by default. This makes sense, since it is preferred
in the community, but it rubs me the wrong way. This can be easily remedied with

```
git config --global hub.protocol https
```

[Hub]: https://github.com/github/hub

## Multi Factor Authentication

The biggest problem with this scheme is dealing with MFA (aka 2fa, 2 factor
authentication). The HTTP basic authentication system used here means your URLs
are actually transformed into something like
`https://mythmon:s3kr3t@github.com/mythmon/mythmon.com`. The username and
password are included right in the URL.

There is no place in this scheme for a MFA code. So we cheat. GitHub supports
using "personal access tokens" for authentication. These are long hexadecimal
strings. They easily revocable, and can be scoped to only certain permissions.
Because of this, GitHub will treat them as username, password, and MFA code all
in one.

To get one, follow these steps

1. Go to the [Tokens page of your GitHub settings][tokens]
2. Click "Generate a new token" in the upper right
3. Give it a description. I use "for git+https".
4. Choose permissions to give it. You probably want `repo` and `gist`.[^2]
5. Click "Generate Token"
6. Immediately use the token.

[^2]:
    Did you know that Gists are actually backed by git? They all have URLs on
    the right side that you can use to clone them, edit offline and push back
    to. Much nicer than using the online editor for heavy tasks.

After you leave the page, GitHub *will never show you that token again*.  You
shouldn't need it either. You should put it in a secret store somewhere (like
Gnome Keyring). Don't try and memorize it or write it down somewhere.  These
tokens are for robots.

For the purposes of this guide, paste it into the *username* field when you try
and `git push` and get prompted to log in. If you have set up the credential
helpers above, Git will remember the URL and never bug you again. Git will make
a URL like
`https://583881ef025fc1b2efa66fea5a10c9984b655ddd@github.com/mythmon/mythmon.com`.

> Be careful when copy/pasting that token. The webpage tends to put extra spaces
> on either side of the token for me, so make sure to only get the hex
> characters.

[tokens]: https://github.com/settings/tokens

## Automation

The tokens from above are also great for automation. If you need to, say,
[automatically push to GitHub from Travis-CI][blog-automation], you can (in a
secure way) give Travis-CI a remote URL that includes a Personal access token.
Then the automation can push, and you don't have to deal with SSH keys. You can
also easily revoke the token later in case something goes wrong.

Don't re-use these tokens. Use one for pushing via HTTPS on your laptop. Use a
different one for each automation task you have. Use a different one on
different computers. They are easy to generate, so go wild.

Also remember to occasionally clean out old unused tokens.

[blog-automation]: /posts/2014-09-01-github-pages-travis.html
