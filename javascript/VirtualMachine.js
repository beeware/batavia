/*************************************************************************
 * Virtual Machine
 *************************************************************************/
import * as attrs from './core/attrs'
import * as callables from './core/callables'
import { BaseException, BataviaError, StopIteration } from './core/exceptions'
import { create_pyclass, PyNone, PyObject, PyType } from './core/types'
import * as version from './core/version'

import PyBlock from './core/Block'
import PyFrame from './core/Frame'

import * as builtins from './builtins'
import * as types from './types'

import { dis } from './modules/dis'
import { marshal } from './modules/marshal'
import { sys } from './modules/sys'

export default class VirtualMachine {
    constructor(args) {
        if (args.loader === undefined) {
            this.loader = function(name) {
                // Find the script element with the ID matching the
                // fully qualified module name (e.g., batavia-foo.bar.whiz)
                var element = document.getElementById('batavia-' + name)
                if (element === null) {
                    // If the element doesn't exist, look for a javascript element.
                    element = window[name]
                    if (element === undefined) {
                        return null
                    } else {
                        return {
                            'javascript': element
                        }
                    }
                }

                // Look for the filename in the data-filename
                // attribute of script tag.
                var filename
                if (element.dataset) {
                    filename = element.dataset['filename']
                } else {
                    filename = '<input>'
                }

                // Strip all the whitespace out of the text content of
                // the script tag.
                return {
                    '$pyclass': true,
                    'bytecode': element.text.replace(/(\r\n|\n|\r)/gm, '').trim(),
                    'filename': new types.PyStr(filename)
                }
            }
        } else {
            this.loader = args.loader
        }

        if (args.stdout) {
            sys.stdout = args.stdout
        }
        if (args.stderr) {
            sys.stderr = args.stderr
        }

        // Build a table mapping opcodes to method calls
        this.build_dispatch_table()

        this.return_value = null
        this.last_exception = null

        this.frames = []

        if (args.frame === null) {
            // Explicitly requested an empty frame stack
            this.frame = null
            this.has_session = false
        } else if (args.frame === undefined) {
            // No frame stack requested; initialize one as a
            var frame = this.make_frame({'code': null})
            this.push_frame(frame)
            this.has_session = true
        } else {
            this.push_frame(args.frame)
            this.has_session = true
        }
    }

    /*
     * Build a table mapping opcodes to a method to be called whenever we encounter that opcode.
     *
     * Each such method will be invoked with apply(this, args).
     */
    build_dispatch_table() {
        var vm = this
        this.dispatch_table = dis.opname.map(function(opname, opcode) {
            var operator_name

            if (opcode === dis.NOP) {
                return function() {}
            } else if (opcode in dis.unary_ops) {
                operator_name = opname.slice(6)
                switch (operator_name) {
                    case 'POSITIVE':
                        return function() {
                            var x = this.pop()
                            if (x === null) {
                                this.push(types.PyNoneType.__pos__())
                            } else if (x.__pos__) {
                                this.push(x.__pos__())
                            } else {
                                this.push(+x)
                            }
                        }
                    case 'NEGATIVE':
                        return function() {
                            var x = this.pop()
                            if (x === null) {
                                this.push(types.PyNoneType.__neg__())
                            } else if (x.__neg__) {
                                this.push(x.__neg__())
                            } else {
                                this.push(-x)
                            }
                        }
                    case 'NOT':
                        return function() {
                            var x = this.pop()
                            if (x === null) {
                                this.push(types.PyNoneType.__not__())
                            } else if (x.__not__) {
                                this.push(x.__not__())
                            } else {
                                this.push(-x)
                            }
                        }
                    case 'INVERT':
                        return function() {
                            var x = this.pop()
                            if (x === null) {
                                this.push(types.PyNoneType.__invert__())
                            } else if (x.__invert__) {
                                this.push(x.__invert__())
                            } else {
                                this.push(~x)
                            }
                        }
                    default:
                        throw new BataviaError('Unknown unary operator ' + operator_name)
                }
            } else if (opcode in dis.binary_ops) {
                operator_name = opname.slice(7)
                switch (operator_name) {
                    case 'POWER':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__pow__(items[1]))
                            } else if (items[0].__pow__) {
                                if (items[0].__pow__.__call__) {
                                    this.push(items[0].__pow__.__call__(items))
                                } else {
                                    this.push(items[0].__pow__(items[1]))
                                }
                            } else {
                                this.push(Math.pow(items[0], items[1]))
                            }
                        }
                    case 'MULTIPLY':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__mul__(items[1]))
                            } else if (items[0].__mul__) {
                                if (items[0].__mul__.__call__) {
                                    this.push(items[0].__mul__.__call__(items))
                                } else {
                                    this.push(items[0].__mul__(items[1]))
                                }
                            } else {
                                this.push(items[0] * items[1])
                            }
                        }
                    case 'MODULO':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__mod__(items[1]))
                            } else if (items[0].__mod__) {
                                if (items[0].__mod__.__call__) {
                                    this.push(items[0].__mod__.__call__(items))
                                } else {
                                    this.push(items[0].__mod__(items[1]))
                                }
                            } else {
                                this.push(items[0] % items[1])
                            }
                        }
                    case 'ADD':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__add__(items[1]))
                            } else if (items[0].__add__) {
                                if (items[0].__add__.__call__) {
                                    this.push(items[0].__add__.__call__(items))
                                } else {
                                    this.push(items[0].__add__(items[1]))
                                }
                            } else {
                                this.push(items[0] + items[1])
                            }
                        }
                    case 'SUBTRACT':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__sub__(items[1]))
                            } else if (items[0].__sub__) {
                                if (items[0].__sub__.__call__) {
                                    this.push(items[0].__sub__.__call__(items))
                                } else {
                                    this.push(items[0].__sub__(items[1]))
                                }
                            } else {
                                this.push(items[0] - items[1])
                            }
                        }
                    case 'SUBSCR':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__getitem__(items[1]))
                            } else if (items[0].__getitem__) {
                                if (items[0].__getitem__.__call__) {
                                    this.push(items[0].__getitem__.__call__(items))
                                } else {
                                    this.push(items[0].__getitem__(items[1]))
                                }
                            } else {
                                this.push(items[0][items[1]])
                            }
                        }
                    case 'FLOOR_DIVIDE':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__floordiv__(items[1]))
                            } else if (items[0].__floordiv__) {
                                if (items[0].__floordiv__.__call__) {
                                    this.push(items[0].__floordiv__.__call__(items))
                                } else {
                                    this.push(items[0].__floordiv__(items[1]))
                                }
                            } else {
                                this.push(items[0] / items[1])
                            }
                        }
                    case 'TRUE_DIVIDE':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__truediv__(items[1]))
                            } else if (items[0].__truediv__) {
                                if (items[0].__truediv__.__call__) {
                                    this.push(items[0].__truediv__.__call__(items))
                                } else {
                                    this.push(items[0].__truediv__(items[1]))
                                }
                            } else {
                                this.push(items[0] / items[1])
                            }
                        }
                    case 'LSHIFT':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__lshift__(items[1]))
                            } else if (items[0].__lshift__) {
                                if (items[0].__lshift__.__call__) {
                                    this.push(items[0].__lshift__.__call__(items))
                                } else {
                                    this.push(items[0].__lshift__(items[1]))
                                }
                            } else {
                                this.push(items[0] << items[1])
                            }
                        }
                    case 'RSHIFT':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__rshift__(items[1]))
                            } else if (items[0].__rshift__) {
                                if (items[0].__rshift__.__call__) {
                                    this.push(items[0].__rshift__.__call__(items))
                                } else {
                                    this.push(items[0].__rshift__(items[1]))
                                }
                            } else {
                                this.push(items[0] >> items[1])
                            }
                        }
                    case 'AND':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__and__(items[1]))
                            } else if (items[0].__and__) {
                                if (items[0].__and__.__call__) {
                                    this.push(items[0].__and__.__call__(items))
                                } else {
                                    this.push(items[0].__and__(items[1]))
                                }
                            } else {
                                this.push(items[0] & items[1])
                            }
                        }
                    case 'XOR':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__xor__(items[1]))
                            } else if (items[0].__xor__) {
                                if (items[0].__xor__.__call__) {
                                    this.push(items[0].__xor__.__call__(items))
                                } else {
                                    this.push(items[0].__xor__(items[1]))
                                }
                            } else {
                                this.push(items[0] ^ items[1])
                            }
                        }
                    case 'OR':
                        return function() {
                            var items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.PyNoneType.__or__(items[1]))
                            } else if (items[0].__or__) {
                                if (items[0].__or__.__call__) {
                                    this.push(items[0].__or__.__call__(items))
                                } else {
                                    this.push(items[0].__or__(items[1]))
                                }
                            } else {
                                this.push(items[0] | items[1])
                            }
                        }
                    default:
                        throw new BataviaError('Unknown binary operator ' + operator_name)
                }
            } else if (opcode in dis.inplace_ops) {
                operator_name = opname.slice(8)
                switch (operator_name) {
                    case 'FLOOR_DIVIDE':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__ifloordiv__(items[1])
                            } else if (items[0].__ifloordiv__) {
                                if (items[0].__ifloordiv__.__call__) {
                                    result = items[0].__ifloordiv__.__call__(items)
                                } else {
                                    result = items[0].__ifloordiv__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] /= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'TRUE_DIVIDE':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__itruediv__(items[1])
                            } else if (items[0].__itruediv__) {
                                if (items[0].__itruediv__.__call__) {
                                    result = items[0].__itruediv__.__call__(items)
                                } else {
                                    result = items[0].__itruediv__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] /= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'ADD':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__iadd__(items[1])
                            } else if (items[0].__iadd__) {
                                if (items[0].__iadd__.__call__) {
                                    result = items[0].__iadd__.__call__(items)
                                } else {
                                    result = items[0].__iadd__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] += items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'SUBTRACT':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__isub__(items[1])
                            } else if (items[0].__isub__) {
                                if (items[0].__isub__.__call__) {
                                    result = items[0].__isub__.__call__(items)
                                } else {
                                    result = items[0].__isub__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] -= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'MULTIPLY':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__imul__(items[1])
                            } else if (items[0].__imul__) {
                                if (items[0].__imul__.__call__) {
                                    result = items[0].__imul__.__call__(items)
                                } else {
                                    result = items[0].__imul__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] *= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'MODULO':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__imod__(items[1])
                            } else if (items[0].__imod__) {
                                if (items[0].__imod__.__call__) {
                                    result = items[0].__imod__.__call__(items)
                                } else {
                                    result = items[0].__imod__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] %= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'POWER':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__ipow__(items[1])
                            } else if (items[0].__ipow__) {
                                if (items[0].__ipow__.__call__) {
                                    result = items[0].__ipow__.__call__(items)
                                } else {
                                    result = items[0].__ipow__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] = Math.pow(items[0], items[1])
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'LSHIFT':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__ilshift__(items[1])
                            } else if (items[0].__ilshift__) {
                                if (items[0].__ilshift__.__call__) {
                                    result = items[0].__ilshift__.__call__(items)
                                } else {
                                    result = items[0].__ilshift__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] <<= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'RSHIFT':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__irshift__(items[1])
                            } else if (items[0].__irshift__) {
                                if (items[0].__irshift__.__call__) {
                                    result = items[0].__irshift__.__call__(items)
                                } else {
                                    result = items[0].__irshift__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] >>= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'AND':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__iand__(items[1])
                            } else if (items[0].__iand__) {
                                if (items[0].__iand__.__call__) {
                                    result = items[0].__iand__.__call__(items)
                                } else {
                                    result = items[0].__iand__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] &= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'XOR':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__ixor__(items[1])
                            } else if (items[0].__ixor__) {
                                if (items[0].__ixor__.__call__) {
                                    result = items[0].__ixor__.__call__(items)
                                } else {
                                    result = items[0].__ixor__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] ^= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    case 'OR':
                        return function() {
                            var items = this.popn(2)
                            var result
                            if (items[0] === null) {
                                result = types.PyNoneType.__ior__(items[1])
                            } else if (items[0].__ior__) {
                                if (items[0].__ior__.__call__) {
                                    result = items[0].__ior__.__call__(items)
                                } else {
                                    result = items[0].__ior__(items[1])
                                }
                                if (result === null) {
                                    result = items[0]
                                }
                            } else {
                                items[0] |= items[1]
                                result = items[0]
                            }
                            this.push(result)
                        }
                    default:
                        throw new BataviaError('Unknown inplace operator ' + operator_name)
                }
            } else {
                // dispatch
                var bytecode_fn = vm['byte_' + opname]
                if (bytecode_fn) {
                    return bytecode_fn
                } else {
                    return function() {
                        throw new BataviaError('Unknown opcode ' + opcode + ' (' + opname + ')')
                    }
                }
            }
        })
    }

    /*
     * The main entry point.
     *
     * Accepts a DOM id for an element containing base64 encoded bytecode.
     */
    run(tag, args) {
        try {
            var payload = this.loader(tag)
            var code = marshal.load_pyc(this, payload.bytecode)

            // Set up sys.argv
            sys.argv = new types.PyList(['batavia'])
            if (args) {
                sys.argv.extend(args)
            }

            // Run the code
            return this.run_code({'code': code})
        } catch (e) {
            if (e instanceof BataviaError) {
                sys.stderr.write(e.msg + '\n')
            } else {
                throw e
            }
        }
    }

    /*
     * An entry point for invoking functions.
     *
     * Accepts a DOM id for an element containing base64 encoded bytecode.
     */
    run_method(tag, args, kwargs, f_locals, f_globals) {
        try {
            var payload = this.loader(tag)
            var code = marshal.load_pyc(this, payload.bytecode)

            var callargs = new types.JSDict()
            for (var i = 0, l = args.length; i < l; i++) {
                callargs[code.co_varnames[i]] = args[i]
            }
            callargs.update(kwargs)

            // Run the code
            return this.run_code({
                'code': code,
                'callargs': callargs,
                'f_locals': f_locals,
                'f_globals': f_globals
            })
        } catch (e) {
            if (e instanceof BataviaError) {
                sys.stderr.write(e.msg + '\n')
            } else {
                throw e
            }
        }
    }

    /*
     */
    PyErr_Occurred() {
        return this.last_exception !== null
    }

    PyErr_SetString(Exception, message) {
        var exception = new Exception(message)
        this.last_exception = {
            'exc_type': exception.__class__,
            'value': exception,
            'traceback': this.create_traceback()
        }
    }

    /*
     * Return the value at the top of the stack, with no changes.
     */
    top() {
        return this.frame.stack[this.frame.stack.length - 1]
    }

    /*
     * Pop a value from the stack.
     *
     * Default to the top of the stack, but `i` can be a count from the top
     * instead.
     */
    pop(i) {
        if (i === undefined) {
            i = 0
        }
        return this.frame.stack.splice(this.frame.stack.length - 1 - i, 1)[0]
    }

    /*
     * Push value onto the value stack.
     */
    push(val) {
        this.frame.stack.push(val)
    }

    /*
     * Push value onto the stack, i elements behind TOS
     * push_at(val, 0) is equivalent to push(val)
     * push_at(val, 1) will result in val being second on the stack
     */
    push_at(val, i) {
        this.frame.stack.splice(this.frame.stack.length - i, 0, val)
    }

    /*
     * Pop a number of values from the value stack.
     *
     * A list of `n` values is returned, the deepest value first.
    */
    popn(n) {
        if (n) {
            return this.frame.stack.splice(this.frame.stack.length - n, n)
        } else {
            return []
        }
    }

    /*
     * Get a value `n` entries down in the stack, without changing the stack.
     */
    peek(n) {
        return this.frame.stack[this.frame.stack.length - n]
    }

    /*
     * Move the bytecode pointer to `jump`, so it will execute next.
     */
    jump(jump) {
        this.frame.f_lasti = jump
    }

    push_block(type, handler, level) {
        if (level === null || level === undefined) {
            level = this.frame.stack.length
        }
        this.frame.block_stack.push(new PyBlock(type, handler, level))
    }

    pop_block() {
        return this.frame.block_stack.pop()
    }

    make_frame(kwargs) {
        var code = kwargs.code
        var callargs = kwargs.callargs || new types.JSDict()
        var f_globals = kwargs.f_globals || null
        var f_locals = kwargs.f_locals || null

        if (code && !code.co_unpacked_code) {
            this.unpack_code(code)
        }

        // console.log("make_frame: code=" + code + ", callargs=" + callargs);

        if (f_globals !== null) {
            if (f_locals === null) {
                f_locals = f_globals
            }
        } else if (this.frames.length > 0) {
            f_globals = this.frame.f_globals
            f_locals = new types.JSDict()
        } else {
            f_globals = f_locals = new types.JSDict({
                '__builtins__': builtins,
                '__name__': '__main__',
                '__doc__': null,
                '__package__': null
            })
        }
        f_locals.update(callargs)

        return new PyFrame({
            'f_code': code,
            'f_globals': f_globals,
            'f_locals': f_locals,
            'f_back': this.frame
        })
    }

    push_frame(frame) {
        this.frames.push(frame)
        this.frame = frame
    }

    pop_frame() {
        this.frames.pop()
        if (this.frames) {
            this.frame = this.frames[this.frames.length - 1]
        } else {
            this.frame = null
        }
    }

    create_traceback() {
        var tb = []
        var frame, mod_name, filename

        for (var f in this.frames) {
            frame = this.frames[f]

            // Work out the current source line by taking the
            // f_lineno (the line for the start of the method)
            // and adding the line offsets from the line
            // number table.
            if (frame.f_code) {
                var lnotab = frame.f_code.co_lnotab.val
                var byte_num = 0
                var line_num = frame.f_code.co_firstlineno

                for (var idx = 1; idx < lnotab.length && byte_num < frame.f_lasti; idx += 2) {
                    byte_num += lnotab[idx - 1]
                    if (byte_num < frame.f_lasti) {
                        line_num += lnotab[idx]
                    }
                }
                mod_name = frame.f_code.co_name
                filename = frame.f_code.co_filename
            }
            tb.push({
                'module': mod_name,
                'filename': filename,
                'line': line_num
            })
        }
        return tb
    }

    /*
     * Annotate a Code object with a co_unpacked_code property, consisting of the bytecode
     * unpacked into operations with their respective args
     */
    unpack_code(code) {
        if (!version.earlier('3.6')) {
            // Python 3.6+, 2-byte opcodes

            let pos = 0
            let unpacked_code = []
            let args = []
            let extra = 0

            while (pos < code.co_code.val.length) {
                let opcode_start_pos = pos

                let opcode = code.co_code.val[pos++]

                // next opcode has 4-byte argument effectively.
                if (opcode === dis.EXTENDED_ARG) {
                    extra = code.co_code.val[pos++] << 8
                    unpacked_code[opcode_start_pos] = {
                        'opoffset': opcode_start_pos,
                        'opcode': dis.NOP,
                        'op_method': this.dispatch_table[dis.NOP],
                        'args': [],
                        'next_pos': pos
                    }
                    continue
                }

                let intArg = code.co_code.val[pos++] | extra
                extra = 0

                if (opcode >= dis.HAVE_ARGUMENT) {
                    if (opcode in dis.hasconst) {
                        args = [code.co_consts[intArg]]
                    } else if (opcode in dis.hasfree) {
                        if (intArg < code.co_cellvars.length) {
                            args = [code.co_cellvars[intArg]]
                        } else {
                            let var_idx = intArg - code.co_cellvars.length
                            args = [code.co_freevars[var_idx]]
                        }
                    } else if (opcode in dis.hasname) {
                        args = [code.co_names[intArg]]
                    } else if (opcode in dis.hasjrel) {
                        args = [pos + intArg]
                    } else if (opcode in dis.hasjabs) {
                        args = [intArg]
                    } else if (opcode in dis.haslocal) {
                        args = [code.co_varnames[intArg]]
                    } else {
                        args = [intArg]
                    }
                }

                unpacked_code[opcode_start_pos] = {
                    'opoffset': opcode_start_pos,
                    'opcode': opcode,
                    'op_method': this.dispatch_table[opcode],
                    'args': args,
                    'next_pos': pos
                }
            }

            code.co_unpacked_code = unpacked_code
        } else {
            // Until 3.6 Python had variable width opcodes

            let pos = 0
            let unpacked_code = []
            let args
            let extra = 0
            let lo
            let hi

            while (pos < code.co_code.val.length) {
                let opcode_start_pos = pos

                let opcode = code.co_code.val[pos++]

                // next opcode has 4-byte argument effectively.
                if (opcode === dis.EXTENDED_ARG) {
                    lo = code.co_code.val[pos++]
                    hi = code.co_code.val[pos++]
                    extra = (lo << 16) | (hi << 24)
                    // emulate NOP
                    unpacked_code[opcode_start_pos] = {
                        'opoffset': opcode_start_pos,
                        'opcode': dis.NOP,
                        'op_method': this.dispatch_table[dis.NOP],
                        'args': [],
                        'next_pos': pos
                    }
                    continue
                }

                if (opcode < dis.HAVE_ARGUMENT) {
                    args = []
                } else {
                    lo = code.co_code.val[pos++]
                    hi = code.co_code.val[pos++]
                    let intArg = lo | (hi << 8) | extra
                    extra = 0 // use extended arg if present

                    if (opcode in dis.hasconst) {
                        args = [code.co_consts[intArg]]
                    } else if (opcode in dis.hasfree) {
                        if (intArg < code.co_cellvars.length) {
                            args = [code.co_cellvars[intArg]]
                        } else {
                            let var_idx = intArg - code.co_cellvars.length
                            args = [code.co_freevars[var_idx]]
                        }
                    } else if (opcode in dis.hasname) {
                        args = [code.co_names[intArg]]
                    } else if (opcode in dis.hasjrel) {
                        args = [pos + intArg]
                    } else if (opcode in dis.hasjabs) {
                        args = [intArg]
                    } else if (opcode in dis.haslocal) {
                        args = [code.co_varnames[intArg]]
                    } else {
                        args = [intArg]
                    }
                }

                unpacked_code[opcode_start_pos] = {
                    'opoffset': opcode_start_pos,
                    'opcode': opcode,
                    'op_method': this.dispatch_table[opcode],
                    'args': args,
                    'next_pos': pos
                }
            }

            code.co_unpacked_code = unpacked_code
        }
    }

    run_code(kwargs) {
        var code = kwargs.code
        var f_globals = kwargs.f_globals || null
        var f_locals = kwargs.f_locals || null
        var callargs = kwargs.callargs || null
        var frame = this.make_frame({
            'code': code,
            'f_globals': f_globals,
            'f_locals': f_locals,
            'callargs': callargs
        })
        try {
            var val = this.run_frame(frame)

            // Check some invariants
            if (this.has_session) {
                if (this.frames.length > 1) {
                    throw new BataviaError('Frames left over in session!')
                }
            } else {
                if (this.frames.length > 0) {
                    throw new BataviaError('Frames left over!')
                }
            }
            if (this.frame && this.frame.stack.length > 0) {
                throw new BataviaError('Data left on stack! ' + this.frame.stack)
            }
            return val
        } catch (e) {
            if (this.last_exception) {
                var trace = ['Traceback (most recent call last):']
                for (var t in this.last_exception.traceback) {
                    frame = this.last_exception.traceback[t]
                    trace.push('  File "' + frame.filename + '", line ' + frame.line + ', in ' + frame.module)
                }
                if (this.last_exception.value.__class__) {
                    if (this.last_exception.value.toString().length > 0) {
                        trace.push(this.last_exception.value.__class__.__name__ + ': ' + this.last_exception.value.toString())
                    } else {
                        trace.push(this.last_exception.value.__class__.__name__)
                    }
                } else {
                    throw this.last_exception.value
                }
                sys.stderr.write(trace.join('\n') + '\n')
                this.last_exception = null
            } else {
                throw e
            }
            // throw e;
        }
        sys.stdout.flush()
        sys.stderr.flush()
    }

    unwind_block(block) {
        var offset

        if (block.type === 'except-handler') {
            offset = 3
        } else {
            offset = 0
        }

        while (this.frame.stack.length > block.level + offset) {
            this.pop()
        }

        if (block.type === 'except-handler') {
            this.popn(3)
            // we don't need to set the last_exception, as it was handled
        }
    }

    /*
     * Log arguments, block stack, and data stack for each opcode.
     */
    log(opcode) {
        var op = opcode.opoffset + ': ' + opcode.byteName
        for (var arg in opcode.args) {
            op += ' ' + opcode.args[arg]
        }
        var indent = '    ' * (this.frames.length - 1)

        console.log('  ' + indent + 'data: ' + this.frame.stack)
        console.log('  ' + indent + 'blks: ' + this.frame.block_stack)
        console.log(indent + op)
    }

    /*
     * Manage a frame's block stack.
     * Manipulate the block stack and data stack for looping,
     * exception handling, or returning.
     */
    manage_block_stack(why) {
        var block = this.frame.block_stack[this.frame.block_stack.length - 1]
        if (block.type === 'loop' && why === 'continue') {
            this.jump(this.return_value)
            why = null
            return why
        }

        this.pop_block()
        this.unwind_block(block)

        if (block.type === 'loop' && why === 'break') {
            why = null
            this.jump(block.handler)
            return why
        }

        if (why === 'exception' &&
                (block.type === 'setup-except' || block.type === 'finally')) {
            this.push_block('except-handler')
            var exc = this.last_exception
            // clear the last_exception so that we know it is handled
            this.last_exception = null
            this.push(exc.traceback)
            this.push(exc.value)
            this.push(exc.exc_type)
            // PyErr_Normalize_Exception goes here
            this.push(exc.traceback)
            this.push(exc.value)
            this.push(exc.exc_type)
            why = null
            this.jump(block.handler)
            return why
        } else if (block.type === 'finally') {
            if (why === 'return' || why === 'continue') {
                this.push(this.return_value)
            }
            this.push(why)

            why = null
            this.jump(block.handler)
            return why
        }

        return why
    }

    /*
     * Run a frame until it returns (somehow).
     *
     * Exceptions are raised, the return value is returned.
     * If the frame was halted partway through execution
     * (e.g. by yielding from a generator) then it will resume
     * from whereever it left off.
     *
     */
    run_frame(frame) {
        var why, operation

        this.push_frame(frame)

        // If there's an unhandled exception then resume
        // execution by handling it.

        if (this.last_exception) {
            why = 'exception'
            while (why && frame.block_stack.length > 0) {
                why = this.manage_block_stack(why)
            }
        }

        while (!why) {
            operation = this.frame.f_code.co_unpacked_code[this.frame.f_lasti]
            var opname = dis.opname[operation.opcode] // eslint-disable-line no-unused-vars

            // advance f_lasti to next operation. If the operation is a jump, then this
            // pointer will be overwritten during the operation's execution.
            this.frame.f_lasti = operation.next_pos

            // this.log(operation);

            // When unwinding the block stack, we need to keep track of why we
            // are doing it.
            try {
                why = operation.op_method.apply(this, operation.args)
            } catch (err) {
                // deal with exceptions encountered while executing the op.
                if (err instanceof BataviaError) {
                    // Batavia errors are a major problem; ABORT HARD
                    this.last_exception = null
                    throw err
                } else if (this.last_exception === null) {
                    this.last_exception = {
                        'exc_type': err.__class__,
                        'value': err,
                        'traceback': this.create_traceback()
                    }
                }
                why = 'exception'
            }

            // if (why === 'exception')  {
            //     TODO: ceval calls PyTraceBack_Here, not sure what that does.
            // }

            if (why === 'reraise') {
                why = 'exception'
            }

            if (why !== 'yield') {
                while (why && frame.block_stack.length > 0) {
                    // Deal with any block management we need to do.
                    why = this.manage_block_stack(why)
                }
            }
        }

        // TODO: handle generator exception state

        this.pop_frame()

        if (why === 'exception') {
            throw this.last_exception.value
        }

        return this.return_value
    }

    byte_LOAD_CONST(c) {
        this.push(c)
    }

    byte_POP_TOP() {
        this.pop()
    }

    byte_DUP_TOP() {
        this.push(this.top())
    }

    byte_DUP_TOPX(count) {
        var items = this.popn(count)
        for (var n = 0; n < 2; n++) {
            for (var i = 0; i < count; i++) {
                this.push(items[i])
            }
        }
    }

    byte_DUP_TOP_TWO() {
        var items = this.popn(2)
        this.push(items[0])
        this.push(items[1])
        this.push(items[0])
        this.push(items[1])
    }

    byte_ROT_TWO() {
        var items = this.popn(2)
        this.push(items[1])
        this.push(items[0])
    }

    byte_ROT_THREE() {
        var items = this.popn(3)
        this.push(items[2])
        this.push(items[0])
        this.push(items[1])
    }

    byte_ROT_FOUR() {
        var items = this.popn(4)
        this.push(items[3])
        this.push(items[0])
        this.push(items[1])
        this.push(items[2])
    }

    byte_LOAD_NAME(name) {
        var frame = this.frame
        var val
        if (name in frame.f_locals) {
            val = frame.f_locals[name]
        } else if (name in frame.f_globals) {
            val = frame.f_globals[name]
        } else if (name in frame.f_builtins) {
            val = frame.f_builtins[name]
        } else {
            throw new builtins.NameError("name '" + name + "' is not defined")
        }
        this.push(val)
    }

    byte_STORE_NAME(name) {
        this.frame.f_locals[name] = this.pop()
    }

    byte_DELETE_NAME(name) {
        delete this.frame.f_locals[name]
    }

    byte_LOAD_FAST(name) {
        var val
        if (name in this.frame.f_locals) {
            val = this.frame.f_locals[name]
        } else {
            throw new builtins.UnboundLocalError("local variable '" + name + "' referenced before assignment")
        }
        this.push(val)
    }

    byte_STORE_FAST(name) {
        this.frame.f_locals[name] = this.pop()
    }

    byte_DELETE_FAST(name) {
        delete this.frame.f_locals[name]
    }

    byte_STORE_GLOBAL(name) {
        this.frame.f_globals[name] = this.pop()
    }

    byte_LOAD_GLOBAL(name) {
        var val
        if (name in this.frame.f_globals) {
            val = this.frame.f_globals[name]
        } else if (name in this.frame.f_builtins) {
            val = this.frame.f_builtins[name]
            // Functions loaded from builtins need to be bound to this VM.
            if (val instanceof Function) {
                var doc = val.__doc__
                val = val.bind(this)
                val.__doc__ = doc
            }
        } else {
            throw new builtins.NameError("name '" + name + "' is not defined")
        }
        this.push(val)
    }

    byte_LOAD_DEREF(name) {
        this.push(this.frame.cells[name].get())
    }

    byte_STORE_DEREF(name) {
        this.frame.cells[name].set(this.pop())
    }

    byte_LOAD_LOCALS() {
        this.push(this.frame.f_locals)
    }

    // sliceOperator(op) {
    //     start = 0;
    //     end = null;          // we will take this to mean end
    //     // op, count = op[:-2], int(op[-1]);
    //     if count === 1:
    //         start = this.pop()
    //     elif count === 2:
    //         end = this.pop()
    //     elif count === 3:
    //         end = this.pop()
    //         start = this.pop()
    //     l = this.pop()
    //     if end is null:
    //         end = len(l)
    //     if op.startswith('STORE_'):
    //         l[start:end] = this.pop()
    //     elif op.startswith('DELETE_'):
    //         del l[start:end]
    //     else:
    //         this.push(l[start:end])
    // };

    byte_COMPARE_OP(opnum) {
        var items = this.popn(2)
        var result

        // "in" and "not in" operators (opnum 6 and 7) have reversed
        // operand order, so they're handled separately.
        // If the first operand is None, then we need to invoke
        // the comparison method in a different way, because we can't
        // bind the operator methods to the null instance.

        if (opnum === 6) { // x in None
            if (items[1] === null) {
                result = types.PyNoneType.__contains__(items[0])
            } if (items[1].__contains__) {
                result = items[1].__contains__(items[0])
            } else {
                result = (items[0] in items[1])
            }
        } else if (opnum === 7) {
            if (items[1] === null) { // x not in None
                result = types.PyNoneType.__contains__(items[0]).__not__()
            } else if (items[1].__contains__) {
                result = items[1].__contains__(items[0]).__not__()
            } else {
                result = !(items[0] in items[1])
            }
        } else if (items[0] === null) {
            switch (opnum) {
                case 0: // <
                    result = types.PyNoneType.__lt__(items[1])
                    break
                case 1: // <=
                    result = types.PyNoneType.__le__(items[1])
                    break
                case 2: // ==
                    result = types.PyNoneType.__eq__(items[1])
                    break
                case 3: // !=
                    result = types.PyNoneType.__ne__(items[1])
                    break
                case 4: // >
                    result = types.PyNoneType.__gt__(items[1])
                    break
                case 5: // >=
                    result = types.PyNoneType.__ge__(items[1])
                    break
                case 8: // is
                    result = items[1] === null
                    break
                case 9: // is not
                    result = items[1] !== null
                    break
                case 10: // exception
                    result = items[1] === null
                    break
                default:
                    throw new BataviaError('Unknown operator ' + opnum)
            }
        } else {
            switch (opnum) {
                case 0: // <
                    if (items[0].__lt__) {
                        result = items[0].__lt__(items[1])
                    } else {
                        result = items[0] < items[1]
                    }
                    break
                case 1: // <=
                    if (items[0].__le__) {
                        result = items[0].__le__(items[1])
                    } else {
                        result = items[0] <= items[1]
                    }
                    break
                case 2: // ==
                    if (items[0].__eq__) {
                        result = items[0].__eq__(items[1])
                    } else {
                        result = items[0] === items[1]
                    }
                    break
                case 3: // !=
                    if (items[0].__ne__) {
                        result = items[0].__ne__(items[1])
                    } else {
                        result = items[0] !== items[1]
                    }
                    break
                case 4: // >
                    if (items[0].__gt__) {
                        result = items[0].__gt__(items[1])
                    } else {
                        result = items[0] > items[1]
                    }
                    break
                case 5: // >=
                    if (items[0].__ge__) {
                        result = items[0].__ge__(items[1])
                    } else {
                        result = items[0] >= items[1]
                    }
                    break
                case 8: // is
                    result = items[0] === items[1]
                    break
                case 9: // is not
                    result = items[0] !== items[1]
                    break
                case 10: // exception match
                    result = types.issubclass(items[0], items[1])
                    break
                default:
                    throw new BataviaError('Unknown operator ' + opnum)
            }
        }

        this.push(result)
    }

    byte_LOAD_ATTR(attr) {
        let obj = this.pop()
        let val = attrs.getattr(obj, attr)
        this.push(val)
    }

    byte_STORE_ATTR(name) {
        let items = this.popn(2)
        attrs.setattr(items[1], name, items[0])
    }

    byte_DELETE_ATTR(name) {
        let obj = this.pop()
        attrs.delattr(obj, name)
    }

    byte_STORE_SUBSCR() {
        var items = this.popn(3)
        if (items[1].__setitem__) {
            items[1].__setitem__(items[2], items[0])
        } else {
            items[1][items[2]] = items[0]
        }
    }

    byte_DELETE_SUBSCR() {
        var items = this.popn(2)
        if (items[0].__delitem__) {
            items[0].__delitem__(items[1])
        } else {
            delete items[0][items[1]]
        }
    }

    byte_BUILD_TUPLE(count) {
        var items = this.popn(count)
        this.push(new types.PyTuple(items))
    }

    byte_BUILD_LIST(count) {
        var items = this.popn(count)
        this.push(new types.PyList(items))
    }

    byte_BUILD_SET(count) {
        var items = this.popn(count)
        this.push(new types.PySet(items))
    }

    byte_BUILD_MAP(size) {
        if (version.later('3.5a0')) {
            var items = this.popn(size * 2)
            var dict = new types.PyDict()

            for (var i = 0; i < items.length; i += 2) {
                dict.__setitem__(items[i], items[i + 1])
            }

            this.push(dict)
        } else {
            this.push(new types.PyDict())
        }
    }

    byte_BUILD_CONST_KEY_MAP(size) {
        var keys = this.pop()
        var values = this.popn(size)
        var dict = new types.PyDict()

        for (var i = 0; i < values.length; i += 1) {
            dict.__setitem__(keys[i], values[i])
        }
        this.push(dict)
    }

    byte_STORE_MAP() {
        if (version.later('3.5a0')) {
            throw new BataviaError(
                'STORE_MAP is unsupported with BATAVIA_MAGIC'
            )
        } else {
            var items = this.popn(3)
            if (items[0].__setitem__) {
                items[0].__setitem__(items[2], items[1])
            } else {
                items[0][items[2]] = items[1]
            }
            this.push(items[0])
        }
    }

    byte_UNPACK_SEQUENCE(count) {
        var seq = this.pop()

        // If the sequence item on top of the stack is iterable,
        // expand it into an array.
        if (seq.__iter__) {
            try {
                var iter = seq.__iter__()
                seq = []
                while (true) {
                    seq.push(iter.__next__())
                }
            } catch (err) {}
        }

        for (var i = seq.length; i > 0; i--) {
            this.push(seq[i - 1])
        }
    }

    byte_BUILD_SLICE(count) {
        if (count === 2 || count === 3) {
            var items = this.popn(count)
            this.push(builtins.slice(items))
        } else {
            throw new BataviaError('Strange BUILD_SLICE count: ' + count)
        }
    }

    byte_LIST_APPEND(count) {
        var val = this.pop()
        var the_list = this.peek(count)
        the_list.push(val)
    }

    byte_SET_ADD(count) {
        var val = this.pop()
        var the_set = this.peek(count)
        the_set.add(val)
    }

    byte_MAP_ADD(count) {
        var items = this.popn(2)
        var the_map = this.peek(count)
        the_map[items[1]] = items[0]
    }

    byte_PRINT_EXPR() {
        sys.stdout.write(this.pop())
    }

    byte_PRINT_ITEM() {
        var item = this.pop()
        this.print_item(item)
    }

    byte_PRINT_ITEM_TO() {
        this.pop() // FIXME - the to value is ignored.
        var item = this.pop()
        this.print_item(item)
    }

    byte_PRINT_NEWLINE() {
        this.print_newline()
    }

    byte_PRINT_NEWLINE_TO() {
        var to = this.pop() // FIXME - this is ignored.
        this.print_newline(to)
    }

    print_item(item, to) {
        // if (to === undefined) {
        //     to = sys.stdout; // FIXME - the to value is ignored.
        // }
        sys.stdout.write(item)
    }

    print_newline(to) {
        // if (to === undefined) {
        //     to = sys.stdout; // FIXME - the to value is ignored.
        // }
        sys.stdout.write('')
    }

    byte_JUMP_FORWARD(jump) {
        this.jump(jump)
    }

    byte_JUMP_ABSOLUTE(jump) {
        this.jump(jump)
    }

    byte_POP_JUMP_IF_TRUE(jump) {
        var val = this.pop()
        if (val.__bool__ !== undefined) {
            val = val.__bool__().valueOf()
        }

        if (val) {
            this.jump(jump)
        }
    }

    byte_POP_JUMP_IF_FALSE(jump) {
        var val = this.pop()
        if (val.__bool__ !== undefined) {
            val = val.__bool__().valueOf()
        }

        if (!val) {
            this.jump(jump)
        }
    }

    byte_JUMP_IF_TRUE_OR_POP(jump) {
        var val = this.top()
        if (val.__bool__ !== undefined) {
            val = val.__bool__().valueOf()
        }

        if (val) {
            this.jump(jump)
        } else {
            this.pop()
        }
    }

    byte_JUMP_IF_FALSE_OR_POP(jump) {
        var val = this.top()
        if (val.__bool__ !== undefined) {
            val = val.__bool__().valueOf()
        }

        if (!val) {
            this.jump(jump)
        } else {
            this.pop()
        }
    }

    byte_SETUP_LOOP(dest) {
        this.push_block('loop', dest)
    }

    byte_GET_ITER() {
        this.push(builtins.iter(this.pop()))
    }

    byte_FOR_ITER(jump) {
        var iterobj = this.top()
        try {
            var v = iterobj.__next__()
            this.push(v)
        } catch (err) {
            if (err instanceof builtins.StopIteration) {
                this.pop()
                this.jump(jump)
            } else {
                throw err
            }
        }
    }

    byte_BREAK_LOOP() {
        return 'break'
    }

    byte_CONTINUE_LOOP(dest) {
        // This is a trick with the return value.
        // While unrolling blocks, continue and return both have to preserve
        // state as the finally blocks are executed.  For continue, it's
        // where to jump to, for return, it's the value to return.  It gets
        // pushed on the stack for both, so continue puts the jump destination
        // into return_value.
        this.return_value = dest
        return 'continue'
    }

    byte_SETUP_EXCEPT(dest) {
        this.push_block('setup-except', dest)
    }

    byte_SETUP_FINALLY(dest) {
        this.push_block('finally', dest)
    }

    byte_END_FINALLY() {
        var why, value, traceback
        var exc_type = this.pop()
        if (exc_type === PyNone) {
            why = null
        } else if (exc_type === 'silenced') {
            var block = this.pop_block() // should be except-handler
            this.unwind_block(block)
            return null
        } else {
            value = this.pop()
            if (value instanceof BaseException) {
                traceback = this.pop()
                this.last_exception = {
                    'exc_type': exc_type,
                    'value': value,
                    'traceback': traceback
                }
                why = 'reraise'
            } else {
                throw new BataviaError('Confused END_FINALLY: ' + value.toString())
            }
        }
        return why
    }

    byte_POP_BLOCK() {
        this.pop_block()
    }

    byte_RAISE_VARARGS(argc) {
        var cause, exc
        if (argc === 2) {
            cause = this.pop()
            exc = this.pop()
        } else if (argc === 1) {
            exc = this.pop()
        }
        return this.do_raise(exc, cause)
    }

    do_raise(exc, cause) {
        var exc_type, val
        if (exc === undefined) { // reraise
            if (this.last_exception.exc_type === undefined) {
                return 'exception' // error
            } else {
                return 'reraise'
            }
        } else if (exc instanceof BaseException) {
            // As in `throw ValueError('foo')`
            exc_type = exc.__class__
            val = exc
        } else if (exc.prototype instanceof BaseException ||
                   exc === BaseException) {
            exc_type = exc
            val = new exc_type() // eslint-disable-line new-cap
        } else {
            return 'exception' // error
        }

        // If you reach this point, you're guaranteed that
        // val is a valid exception instance and exc_type is its class.
        // Now do a similar thing for the cause, if present.
        if (cause) {
            // if not isinstance(cause, BaseException):
            //     return 'exception' // error

            val.__cause__ = cause
        }

        this.last_exception = {
            'exc_type': exc_type,
            'value': val,
            'traceback': this.create_traceback()
        }
        return 'exception'
    }

    byte_POP_EXCEPT() {
        var block = this.pop_block()
        if (block.type !== 'except-handler') {
            throw new BataviaError('popped block is not an except handler')
        }
        this.unwind_block(block)
    }

    byte_SETUP_WITH(dest) {
        var mgr = this.top()
        var res = callables.call_method(mgr, '__enter__', [])
        this.push_block('finally', dest)
        this.push(res)
    }

    byte_WITH_CLEANUP() {
        var exc = this.top()
        var mgr
        var val = PyNone
        var tb = PyNone
        if (exc instanceof types.PyNoneType) {
            mgr = this.pop(1)
        } else if (exc instanceof String) {
            if (exc === 'return' || exc === 'continue') {
                mgr = this.pop(2)
            } else {
                mgr = this.pop(1)
            }
            exc = PyNone
        } else if (exc.prototype instanceof BaseException) {
            val = this.peek(2)
            tb = this.peek(3)
            mgr = this.pop(6)
            this.push_at(PyNone, 3)
            var block = this.pop_block()
            this.push_block(block.type, block.handler, block.level - 1)
        } else {
            throw new BataviaError('Confused WITH_CLEANUP')
        }
        var ret = callables.call_method(mgr, '__exit__', [exc, val, tb])
        if (version.earlier('3.5a0')) {
            if (!(exc instanceof types.PyNoneType) && ret.__bool__ !== undefined &&
                    ret.__bool__().valueOf()) {
                this.push('silenced')
            }
        } else {
            // Assuming Python 3.5
            this.push(exc)
            this.push(ret)
        }
    }

    byte_WITH_CLEANUP_FINISH() {
        if (version.earlier('3.5a0')) {
            throw new BataviaError(
                'Unknown opcode WITH_CLEANUP_FINISH in Python 3.4'
            )
        }
        // Assuming Python 3.5
        var ret = this.pop()
        var exc = this.pop()
        if (!(exc instanceof types.PyNoneType) && ret.__bool__ !== undefined &&
                ret.__bool__().valueOf()) {
            this.push('silenced')
        }
    }

    byte_MAKE_FUNCTION(arg) {
        var name = this.pop()
        var code = this.pop()
        var closure = null
        var annotations = null // eslint-disable-line no-unused-vars
        var kwdefaults = null // eslint-disable-line no-unused-vars
        var defaults = null

        if (!version.earlier('3.6')) {
            if (arg & 8) {
                closure = this.pop()
            }
            if (arg & 4) {
                // XXX unused
                annotations = this.pop()
            }
            if (arg & 2) {
                // XXX unused
                kwdefaults = this.pop()
            }
            if (arg & 1) {
                defaults = this.pop()
            }
        } else {
            defaults = this.popn(arg)
        }

        var fn = new types.PyFunction(name, code, this.frame.f_globals, defaults, closure, this)
        this.push(fn)
    }

    byte_LOAD_CLOSURE(name) {
        this.push(this.frame.cells[name])
    }

    byte_MAKE_CLOSURE(argc) {
        var name = this.pop()
        var items = this.popn(2)
        var defaults = this.popn(argc)
        var fn = new types.PyFunction(name, items[1], this.frame.f_globals, defaults, items[0], this)
        this.push(fn)
    }

    byte_CALL_FUNCTION(arg) {
        return this.call_function(arg, null, null)
    }

    byte_CALL_FUNCTION_VAR(arg) {
        var args = this.pop()
        return this.call_function(arg, args, null)
    }

    byte_CALL_FUNCTION_KW(arg) {
        if (!version.earlier('3.6')) {
            var kw = this.pop()
            var namedargs = new types.JSDict()
            for (let i = kw.length - 1; i >= 0; i--) {
                namedargs[kw[i]] = this.pop()
            }
            return this.call_function(arg - kw.length, null, namedargs)
        }
        var kwargs = this.pop()
        return this.call_function(arg, null, kwargs)
    }

    byte_CALL_FUNCTION_VAR_KW(arg) {
        if (!version.earlier('3.6')) {
            // opcode: CALL_FUNCTION_EX
            var kwargs
            if (arg & 1) {
                kwargs = this.pop()
            }
            var args = this.pop()
            return this.call_function(0, args, kwargs)
        } else {
            var items = this.popn(2)
            return this.call_function(arg, items[0], items[1])
        }
    }

    call_function(arg, args, kwargs) {
        let self
        if (!version.earlier('3.6')) {
            let namedargs = new types.JSDict()
            let lenPos = arg
            if (kwargs) {
                for (let kv of kwargs.items()) {
                    namedargs[kv[0]] = kv[1]
                }
            }
            let posargs = this.popn(lenPos)
            if (args) {
                for (let elem of args) {
                    posargs.push(elem)
                }
            }
            let func = this.pop()

            // If this is a type function (i.e., an object constructor), self
            // is the type, not the virtual machine.
            if (func instanceof PyType) {
                self = func
            } else {
                self = this
            }

            let retval = callables.call_function(self, func, posargs, namedargs)
            this.push(retval)
        } else {
            let namedargs = new types.JSDict()
            let lenKw = Math.floor(arg / 256)
            let lenPos = arg % 256
            for (var i = 0; i < lenKw; i++) {
                var items = this.popn(2)
                namedargs[items[0]] = items[1]
            }
            if (kwargs) {
                for (let kv of kwargs.items()) {
                    namedargs[kv[0]] = kv[1]
                }
            }
            let posargs = this.popn(lenPos)
            if (args) {
                for (let elem of args) {
                    posargs.push(elem)
                }
            }
            let func = this.pop()

            // If this is a type function (i.e., an object constructor), self
            // is the type, not the virtual machine.
            if (func instanceof PyType) {
                self = func
            } else {
                self = this
            }

            let retval = callables.call_function(self, func, posargs, namedargs)
            this.push(retval)
        }
    }

    byte_RETURN_VALUE() {
        this.return_value = this.pop()
        if (this.frame.generator) {
            this.frame.generator.finished = true
        }
        return 'return'
    }

    byte_YIELD_VALUE() {
        this.return_value = this.pop()
        return 'yield'
    }

    byte_GET_YIELD_FROM_ITER() {
        // This should first check if TOS is a coroutine and if so
        // only allow another coroutine to 'yield from' it
        // otherwise replace TOS with iter(TOS)
        // For now, coroutines are not supported in Batavia, so this will do
        return this.byte_GET_ITER()
    }

    byte_YIELD_FROM() {
        var v = this.pop()
        var receiver = this.top()

        try {
            if (types.isinstance(v, types.PyNoneType) ||
                    !types.isinstance(receiver, types.PyGenerator)) {
                this.return_value = callables.call_method(receiver, '__next__', [])
            } else {
                this.return_value = receiver.send(v)
            }
        } catch (e) {
            if (e instanceof StopIteration) {
                this.pop()
                this.push(e.value)
                return
            } else {
                throw e
            }
        }
        if (!version.earlier('3.6')) {
            this.jump(this.frame.f_lasti - 2)
        } else {
            this.jump(this.frame.f_lasti - 1)
        }
        return 'yield'
    }

    byte_IMPORT_NAME(name) {
        var items = this.popn(2)
        this.push(
            builtins.__import__.apply(
                this,
                [
                    [name, this.frame.f_globals, this.frame.f_locals, items[1], items[0]],
                    null
                ]
            )
        )
    }

    byte_IMPORT_STAR() {
        // TODO: this doesn't use __all__ properly.
        var mod = this.pop()
        var name
        if ('__all__' in mod) {
            for (var n = 0; n < mod.__all__.length; n++) {
                name = mod.__all__[n]
                this.frame.f_locals[name] = attrs.getattr(mod, name)
            }
        } else {
            for (name in mod) {
                if (name[0] !== '_') {
                    this.frame.f_locals[name] = attrs.getattr(mod, name)
                }
            }
        }
    }

    byte_IMPORT_FROM(name) {
        var mod = this.top()
        var val = attrs.getattr(mod, name)
        this.push(val)
    }

    // byte_EXEC_STMT() {
    //     stmt, globs, locs = this.popn(3)
    //     six.exec_(stmt, globs, locs) f
    // };

    make_class(vm) {
        return function(build_locals, name, bases) {
            // let bases = kwargs.bases || args.slice(2, args.length)
            // let metaclass = kwargs.metaclass || args[3];
            // let kwds = kwargs.kwds || args[4] || [];

            // Create a locals context, and run the class function in it.
            let locals = new types.PyDict()
            build_locals.__call__.apply(vm, [[], [], locals])

            // Now construct the class, based on the constructed local context.
            // The *Javascript* constructor isn't the same as the *Python*
            // constructor. The Javascript constructor just sets up the object.
            // The Python __init__ invocation is done outside the constructor, as part
            // of the __call__ that invokes the constructor.

            let pyclass = class extends PyObject {}
            create_pyclass(pyclass, name, bases)

            // Copy in all the attributes that were created
            // as part of object construction.
            for (let attr in locals) {
                if (locals.hasOwnProperty(attr)) {
                    pyclass[attr] = locals[attr]
                    pyclass.prototype[attr] = locals[attr]
                }
            }

            // Return the class. Calling the type will construct instances.
            return pyclass.__class__
        }
    }

    byte_LOAD_BUILD_CLASS() {
        var pytype = this.make_class(this)
        this.push(pytype)
    }

    byte_STORE_LOCALS() {
        this.frame.f_locals = this.pop()
    }

    byte_SET_LINENO(lineno) {
        this.frame.f_lineno = lineno
    }

    byte_EXTENDED_ARG(extra) {
    }
}
