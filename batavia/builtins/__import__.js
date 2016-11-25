var None = require('../core').None;
var exceptions = require('../core').exceptions;
var types = require('../types');

var __import__ = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError("Batavia calling convention not used.");
    }

    // First, check for builtins
    var module;

    if (args[0] == "builtins") {
        module = require('../builtins');
    }

    // Second, try native modules
    if (module === undefined) {
        var modules = require('../modules');
        module = modules[args[0]];
    }

    // If there's no native module, try for a pre-loaded module.
    if (module === undefined) {
        var sys = require('../modules/sys');
        module = sys.modules[args[0]];
    }
    // Check if there is a stdlib (pyc) module.
    if (module === undefined) {
        var stdlib = require('../stdlib');
        var payload = stdlib[args[0]];
        if (payload) {
            var code = modules.marshal.load_pyc(this, payload);
            // Convert code object to module
            args[1].__name__ = args[0]
            var frame = this.make_frame({
                'code': code,
                'f_globals': args[1]
            });
            this.run_frame(frame);

            module = new types.Module(name, frame.f_locals);
            modules.sys.modules[name] = module;
        }
    }

    // If there still isn't a module, try loading one from the DOM.
    if (module === undefined) {
        // Load requested module
        var name_parts = args[0].split('.');
        var name = name_parts[0];
        try {
            var root_module = modules.sys.modules[name];
            var payload, code, frame;
            if (root_module === undefined) {
                payload = this.loader(name);
                code = modules.marshal.load_pyc(this, payload);

                // Convert code object to module
                frame = this.make_frame({
                    'code': code,
                    'f_globals': new types.JSDict({
                        '__builtins__': require('../builtins'),
                        '__name__': name,
                        '__doc__': null,
                        '__package__': null,
                    }),  // args[1],
                    'f_locals': null  // #new types.JSDict(),
                });
                this.run_frame(frame);

                root_module = new types.Module(name, frame.f_locals);
                modules.sys.modules[name] = root_module;
            }

            var sub_module = root_module;
            for (var n = 1; n < name_parts.length; n++) {
                name = name_parts.slice(0, n + 1).join('.');

                var new_sub = modules.sys.modules[name];
                if (new_sub === undefined) {
                    payload = this.loader(name);
                    code = modules.marshal.load_pyc(this, payload);

                    // Convert code object to module
                    frame = this.make_frame({
                        'code': code,
                        'f_globals': new types.JSDict({
                            '__builtins__': require('../builtins'),
                            '__name__': name,
                            '__doc__': null,
                            '__package__': sub_module,
                        }),  // args[1],
                        'f_locals': null  //new types.JSDict(),
                    });
                    this.run_frame(frame);

                    new_sub = new types.Module(name, frame.f_locals);
                    sub_module[name_parts[n]] = new_sub;
                    sub_module = new_sub;
                    modules.sys.modules[name] = sub_module;
                } else {
                    sub_module = new_sub;
                }
            }

            if (args[3] === None) {
                // import <mod>
                module = root_module;
            } else if (args[3][0] === "*") {
                // from <mod> import *
                module = new types.Module(sub_module.__name__);
                for (name in sub_module) {
                    if (sub_module.hasOwnProperty(name)) {
                        module[name] = sub_module[name];
                    }
                }
            } else {
                // from <mod> import <name>, <name>
                module = new types.Module(sub_module.__name__);
                for (var sn = 0; sn < args[3].length; sn++) {
                    name = args[3][sn];
                    if (sub_module[name] === undefined) {
                        __import__.apply(this, [[sub_module.__name__ + '.' + name, this.frame.f_globals, null, None, null], null]);
                    }
                    module[name] = sub_module[name];
                }
            }
        } catch (err) {
            // Native module. Look for a name in the global
            // (window) namespace.
            var root_module = window[name];
            modules.sys.modules[name] = root_module;

            var sub_module = root_module;
            for (var n = 1; n < name_parts.length; n++) {
                name = name_parts.slice(0, n + 1).join('.');
                sub_module = sub_module[name_parts[n]];
                modules.sys.modules[name] = sub_module;
            }

            if (args[3] === None) {
                // import <mod>
                module = root_module;
            } else if (args[3][0] === "*") {
                // from <mod> import *
                module = {};
                for (name in sub_module) {
                    if (sub_module.hasOwnProperty(name)) {
                        module[name] = sub_module[name];
                    }
                }
            } else {
                // from <mod> import <name>, <name>
                module = {};
                for (var nn = 0; nn < args[3].length; nn++) {
                    name = args[3][nn];
                    module[name] = sub_module[name];
                }
            }
        }
    }
    return module;
}

module.exports = __import__;
