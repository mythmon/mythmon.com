import os
from contextlib import contextmanager
from datetime import datetime

from fabric.api import local
from fabric.context_managers import hide


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
            local('git reset --hard')
            local('git clean -fxd')
            local('git checkout gh-pages')
            local('git fetch origin')
            local('git reset --hard origin/gh-pages')
    else:
        local('rm -rf output')
        local('git clone https://{} output'.format(GH_REF))


def build():
    make_output()
    local('wok')


def publish():
    if not GH_TOKEN:
        raise Exception("Probably can't push because GH_TOKEN is blank.")
    build()

    with cd('output'):
        local('git add --all .')
        local('git config user.email "travis@mythmon.com"')
        local('git config user.name "Travis Build"')
        local('git commit -am "Travis Build"')

        # Hide commands, since there will be secrets.
        with hide('running'):
            cmd = 'git push https://{}@{} gh-pages:gh-pages'
            print cmd.format('********', GH_REF)
            local('echo ' + cmd.format(GH_TOKEN, GH_REF))
