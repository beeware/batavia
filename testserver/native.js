native = function(mod) {
    mod.waggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.stdout('Waggle ' + i + '\n');
        }
    };

    mod.wiggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.stdout('Waggle ' + i + '\n');
        }
    };

    mod.MyClass = function(count) {
        batavia.stdout('Hello class constructor ' + count + '\n');
    };

    mod.MyClass.prototype.doStuff = function(count) {
        batavia.stdout('Hello class ' + count + '\n');
    };

    return mod;
}({});
