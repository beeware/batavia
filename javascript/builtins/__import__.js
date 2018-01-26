import { BataviaError, ImportError, SystemError } from '../core/exceptions'
import { PyNone } from '../core/types'

import * as modules from '../modules'
import * as stdlib from '../stdlib'
import { PyInt, PyModule } from '../types'

export default function __import__(name, globals, locals, fromlist, level) {
    // console.log("IMPORT", name, globals, level);

    // The root module is the top level namespace (the first
    // element in the dotted namespace. The leaf module is
    // the last element.
    let root_module, leaf_module
    let code, frame, payload, n

    // "import builtins" can be shortcut
    if (name === 'builtins' && level.int32() === 0) {
        root_module = require('../builtins')
        leaf_module = root_module
    } else {
        // Pull apart the requested name.
        level = level.int32()
        let path

        if (level === 0) {
            path = name.split('.')
        } else {
            let import_path
            let context = globals.__name__.split('.')

            // Adjust level to deal with imports inside a __init__.py file
            if (globals.__file__.endswith('__init__.py')) {
                level = level - 1
            }

            if (context.length < level) {
                throw new SystemError("Parent module '' not loaded, cannot perform relative import")
            } else {
                context = context.slice(0, context.length - level)
            }

            let a
            if (name !== '') {
                import_path = name.split('.')
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

        let name_part = path[0]

        // Now try the import.
        // Try native modules first
        root_module = modules[name_part]
        leaf_module = root_module

        // Check if there is a stdlib (pyc) module.
        if (root_module === undefined) {
            payload = stdlib[name_part]
            if (payload) {
                root_module = new PyModule(name, null, name)
                leaf_module = root_module
                modules.sys.modules[name] = root_module

                code = modules.marshal.load_pyc(this, payload)
                // Convert code object to module
                // globals.__name__ = name
                frame = this.make_frame({
                    'code': code,
                    'f_globals': root_module,
                    'f_locals': root_module
                })
                this.run_frame(frame)
            }

            // If there still isn't a module, try loading one from the DOM.
            if (root_module === undefined) {
                root_module = modules.sys.modules[name_part]
                leaf_module = root_module
                if (root_module === undefined) {
                    payload = this.loader(name_part)
                    if (payload === null) {
                        throw new ImportError("No module name '" + name_part + "'")
                    } else if (payload.javascript) {
                        root_module = payload.javascript
                        leaf_module = root_module
                        modules.sys.modules[name_part] = root_module
                    } else {
                        // console.log('LOAD ' + name_part);
                        code = modules.marshal.load_pyc(this, payload.bytecode)

                        root_module = new PyModule(name_part, payload.filename, name_part)
                        leaf_module = root_module
                        modules.sys.modules[name_part] = root_module

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
                name_part = path.slice(0, n + 1).join('.')

                let new_module = modules.sys.modules[name_part]
                let pkg
                if (new_module === undefined) {
                    payload = this.loader(name_part)
                    if (payload === null) {
                        throw new ImportError("No module name '" + name_part + "'")
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
                            pkg = name_part
                        }

                        new_module = new PyModule(name_part, payload.filename, pkg)
                        leaf_module[path[n]] = new_module
                        leaf_module = new_module
                        modules.sys.modules[name_part] = leaf_module

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
    let module
    if (fromlist === PyNone) {
        // import <mod>
        module = root_module
    } else if (fromlist[0] === '*') {
        // from <mod> import *
        module = new PyModule(leaf_module.__name__, leaf_module.__file__, leaf_module.__package__)
        for (let name_part in leaf_module) {
            if (leaf_module.hasOwnProperty(name_part)) {
                module[name_part] = leaf_module[name_part]
            }
        }
    } else {
        // from <mod> import <name>, <name>
        module = new PyModule(leaf_module.__name__, leaf_module.__file__, leaf_module.__package__)
        for (let sn = 0; sn < fromlist.length; sn++) {
            let name_part = fromlist[sn]
            if (leaf_module[name_part] === undefined) {
                __import__.call(this, leaf_module.__name__ + '.' + name_part, this.frame.f_globals, null, PyNone, new PyInt(0))
            }
            module[name_part] = leaf_module[name_part]
        }
    }
    return module
}

__import__.__name__ = '__import__'
__import__.__doc__ = `__import__(name, globals=None, locals=None, fromlist=(), level=0) -> module

Import a module. Because this function is meant for use by the Python
interpreter and not for general use it is better to use
importlib.import_module() to programmatically import a module.

The globals argument is only used to determine the context;
they are not modified.  The locals argument is unused.  The fromlist
should be a list of names to emulate \`\`from name import ...'', or an
empty list to emulate \`\`import name''.
When importing a module from a package, note that __import__('A.B', ...)
returns package A when fromlist is empty, but its submodule B when
fromlist is not empty.  Level is used to determine whether to perform
absolute or relative imports. 0 is absolute while a positive number
is the number of parent directories to search relative to the current module.`
__import__.$pyargs = {
    args: ['name'],
    default_args: ['globals', 'locals', 'fromlist', 'level']
}
