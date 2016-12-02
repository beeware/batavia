var native = function(mod) {
    mod.waggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.modules.sys.stdout.write('Waggle ' + i + '\n');
        }
    };

    mod.wiggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.modules.sys.stdout.write('Waggle ' + i + '\n');
        }
    };

    mod.MyClass = function(count) {
        batavia.modules.sys.stdout.write('Hello class constructor ' + count + '\n');
    };

    mod.MyClass.prototype.doStuff = function(count) {
        batavia.modules.sys.stdout.write('Hello class ' + count + '\n');
    };

    return mod;
}({});
