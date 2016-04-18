native = function(mod) {
    mod.waggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.stdout('Waggle ' + i + '\n');
        }
    };

    return mod;
}({});
