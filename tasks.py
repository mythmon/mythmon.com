import os
from contextlib import contextmanager
from datetime import datetime

from invoke import task, run


GH_REF = 'github.com/mythmon/mythmon.com.git'
GH_TOKEN = os.environ.get('GH_TOKEN')


@contextmanager
def cd(newdir):
    print 'Entering {}/'.format(newdir)
    prevdir = os.getcwd()
    os.chdir(newdir)
    try:
        yield
    finally:
        print 'Leaving {}/'.format(newdir)
        os.chdir(prevdir)


def make_output():
    if os.path.isdir('output/.git'):
        with cd('output'):
            run('git reset --hard')
            run('git clean -fxd')
            run('git checkout gh-pages')
            run('git fetch origin')
            run('git reset --hard origin/gh-pages')
    else:
        run('rm -rf output')
        run('git clone https://{} output'.format(GH_REF))


@task(default=True)
def build():
    make_output()
    run('wok')


@task
def publish():
    if not GH_TOKEN:
        raise Exception("Probably can't push because GH_TOKEN is blank.")
    build()

    with cd('output'):
        run('git add --all .')
        run('git config user.email "travis@mythmon.com"')
        run('git config user.name "Travis Build"')
        run('git commit -am "Travis Build"')

        # Hide commands, since there will be secrets.
        cmd = 'git push https://{}@{} gh-pages:gh-pages'
        print cmd.format('********', GH_REF)
        run(cmd.format(GH_TOKEN, GH_REF), hide='both')
