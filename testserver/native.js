var native = function(mod) {
    mod.waggle = function(count) {
        let stdout = batavia.modules.sys.stdout
        for (let i = 0; i < count; i++) {
            stdout.write.call(stdout, 'Waggle ' + i + '\n');
        }
    };

    mod.wiggle = function(count) {
        let stdout = batavia.modules.sys.stdout
        for (let i = 0; i < count; i++) {
            stdout.write.call(stdout, 'Wiggle ' + i + '\n');
        }
    };

    mod.MyClass = function(count) {
        let stdout = batavia.modules.sys.stdout
        stdout.write.call(stdout, 'Hello class constructor ' + count + '\n');
        this.mycount = count
    };
    mod.MyClass.$pytype = true

    mod.MyClass.prototype.doStuff = function(count) {
        let stdout = batavia.modules.sys.stdout
        stdout.write.call(stdout, 'Hello class ' + count + ' ' + this.mycount + ' ' + count.__add__(this.mycount) + '\n' );
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

native.submodule = function(mod) {
    console.log("Now we're in native.submodule");
    return mod;
}({});

native.submodule.other = function(mod) {
    console.log("Now we're in native.submodule.other");

    mod.some_method = function() {
        console.log("Now we're calling a submodule method");
    }
    return mod;
}({});

native.submodule.subsubmodule = function(mod) {
    console.log("Now we're in native.submodule.subsubmodule");
    return mod;
}({});

native.submodule.subsubmodule.another = function(mod) {
    console.log("Now we're in native.submodule.subsubmodule.another");

    mod.another_method = function() {
        console.log("Now we're calling a subsubmodule method");
    }
    return mod;
}({});
