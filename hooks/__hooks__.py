from wok.contrib.hooks import compile_sass

hooks = {
    'site.output.post': [compile_sass],
}
