var native = function(mod) {
    mod.waggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.modules.sys.stdout.write(['Waggle ' + i + '\n']);
        }
    };

    mod.wiggle = function(count) {
        for (var i = 0; i < count; i++) {
            batavia.modules.sys.stdout.write(['Waggle ' + i + '\n']);
        }
    };

    mod.MyClass = function(count) {
        batavia.modules.sys.stdout.write(['Hello class constructor ' + count + '\n']);
    };

    mod.MyClass.prototype.doStuff = function(count) {
        batavia.modules.sys.stdout.write(['Hello class ' + count + '\n']);
    };

    mod.foobar = function(a, b, c) {
        console.log("Calling foobar: " + a + ", " + b + ", " + c);
        return 42
    }
    mod.foobar.__doc__ = "This is the foobar method"

    mod.whizbang = function(args, kwargs) {
        console.log("Whiz Bang! (" + args.length + " args)");
        console.log('arg 1: ' + args[0]);
        console.log('arg 2: ' + args[1]);
        console.log('arg 3: ' + args[2]);
        console.log('pork: ' + kwargs['pork']);
        console.log('ham: ' + kwargs['ham']);
        return kwargs['pork']
    }
    mod.whizbang.__doc__ = "This is the whizbang method"
    mod.whizbang.$pyargs = true;

    return mod;
}({});
