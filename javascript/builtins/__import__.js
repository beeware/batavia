import { BataviaError, ImportError, SystemError } from '../core/exceptions'
import { PyNone } from '../core/types'

import * as modules from '../modules'
import * as stdlib from '../stdlib'
import { PyInt, PyModule } from '../types'

export default function __import__(args, kwargs) {
    // console.log("IMPORT", args[0], args[1], args[4]);
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }

    // The root module is the top level namespace (the first
    // element in the dotted namespace. The leaf module is
    // the last element.
    var root_module, leaf_module
    var code, frame, payload, n

    // "import builtins" can be shortcut
    if (args[0] === 'builtins' && args[4].int32() === 0) {
        root_module = require('../builtins')
        leaf_module = root_module
    } else {
        // Pull apart the requested name.
        var level = args[4].int32()
        var path

        if (level === 0) {
            path = args[0].split('.')
        } else {
            var import_path
            var context = args[1].__name__.split('.')

            // Adjust level to deal with imports inside a __init__.py file
            if (args[1].__file__.endswith('__init__.py')) {
                level = level - 1
            }

            if (context.length < level) {
                throw new SystemError("Parent module '' not loaded, cannot perform relative import")
            } else {
                context = context.slice(0, context.length - level)
            }

            var a
            if (args[0] !== '') {
                import_path = args[0].split('.')
                path = new Array(context.length + import_path.length)

                for (a = 0; a < context.length; a++) {
                    path[a] = context[a]
                }

                for (a = 0; a < import_path.length; a++) {
                    path[a + context.length] = import_path[a]
                }
            } else {
                path = context
            }
        }

        var name = path[0]

        // Now try the import.
        // Try native modules first
        root_module = modules[name]
        leaf_module = root_module

        // Check if there is a stdlib (pyc) module.
        if (root_module === undefined) {
            payload = stdlib[name]
            if (payload) {
                root_module = new PyModule(name, null, name)
                leaf_module = root_module
                modules.sys.modules[name] = root_module

                code = modules.marshal.load_pyc(this, payload)
                // Convert code object to module
                // args[1].__name__ = args[0]
                frame = this.make_frame({
                    'code': code,
                    'f_globals': root_module,
                    'f_locals': root_module
                })
                this.run_frame(frame)
            }

            // If there still isn't a module, try loading one from the DOM.
            if (root_module === undefined) {
                root_module = modules.sys.modules[name]
                leaf_module = root_module
                if (root_module === undefined) {
                    payload = this.loader(name)
                    if (payload === null) {
                        throw new ImportError("No module name '" + name + "'")
                    } else if (payload.javascript) {
                        root_module = payload.javascript
                        leaf_module = root_module
                        modules.sys.modules[name] = root_module
                    } else {
                        // console.log('LOAD ' + name);
                        code = modules.marshal.load_pyc(this, payload.bytecode)

                        root_module = new PyModule(name, payload.filename, name)
                        leaf_module = root_module
                        modules.sys.modules[name] = root_module

                        // Convert code object to module
                        frame = this.make_frame({
                            'code': code,
                            'f_globals': root_module,
                            'f_locals': root_module
                        })
                        this.run_frame(frame)
                    }
                }
            }

            for (n = 1; n < path.length; n++) {
                name = path.slice(0, n + 1).join('.')

                var new_module = modules.sys.modules[name]
                var pkg
                if (new_module === undefined) {
                    payload = this.loader(name)
                    if (payload === null) {
                        throw new ImportError("No module name '" + name + "'")
                    } else if (payload.javascript) {
                        new_module = payload.javascript
                        leaf_module[path[n]] = new_module
                        leaf_module = new_module
                        modules.sys.modules[name] = leaf_module
                    } else {
                        code = modules.marshal.load_pyc(this, payload.bytecode)

                        if (payload.filename.endswith('__init__.py')) {
                            pkg = path.slice(0, n).join('.')
                        } else {
                            pkg = name
                        }

                        new_module = new PyModule(name, payload.filename, pkg)
                        leaf_module[path[n]] = new_module
                        leaf_module = new_module
                        modules.sys.modules[name] = leaf_module

                        // Convert code object to module
                        frame = this.make_frame({
                            'code': code,
                            'f_globals': leaf_module,
                            'f_locals': leaf_module
                        })
                        this.run_frame(frame)
                    }
                } else {
                    leaf_module = new_module
                }
            }
        }
    }

    // Finally, do any procesing required if the import
    // is a "from ..." statement. This will yield the
    // final module to be imported.
    var module
    if (args[3] === PyNone) {
        // import <mod>
        module = root_module
    } else if (args[3][0] === '*') {
        // from <mod> import *
        module = new PyModule(leaf_module.__name__, leaf_module.__file__, leaf_module.__package__)
        for (name in leaf_module) {
            if (leaf_module.hasOwnProperty(name)) {
                module[name] = leaf_module[name]
            }
        }
    } else {
        // from <mod> import <name>, <name>
        module = new PyModule(leaf_module.__name__, leaf_module.__file__, leaf_module.__package__)
        for (var sn = 0; sn < args[3].length; sn++) {
            name = args[3][sn]
            if (leaf_module[name] === undefined) {
                __import__.apply(this, [[leaf_module.__name__ + '.' + name, this.frame.f_globals, null, PyNone, new PyInt(0)], null])
            }
            module[name] = leaf_module[name]
        }
    }
    return module
}
