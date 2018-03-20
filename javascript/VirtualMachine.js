/*************************************************************************
 * Virtual Machine
 *************************************************************************/
import { call_function, pyargs } from './core/callables'
import JSDict from './core/JSDict'
import { pyBaseException, pyBataviaError, pyNameError, pyStopIteration, pyUnboundLocalError } from './core/exceptions'
import { type, pyNone, PyObject } from './core/types'
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
                let element = document.getElementById('batavia-' + name)
                if (element === null) {
                    // If the element doesn't exist, look for a HTML element.
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
                let filename
                if (element.dataset) {
                    filename = element.dataset['filename']
                } else {
                    filename = '<input>'
                }

                // Strip all the whitespace out of the text content of
                // the script tag.
                return {
                    'bytecode': element.text.replace(/(\r\n|\n|\r)/gm, '').trim(),
                    'filename': types.pystr(filename)
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
            let frame = this.make_frame({'code': null})
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
        let vm = this
        this.dispatch_table = dis.opname.map(function(opname, opcode) {
            let operator_name

            if (opcode === dis.NOP) {
                return function() {}
            } else if (opcode in dis.unary_ops) {
                operator_name = opname.slice(6)
                switch (operator_name) {
                    case 'POSITIVE':
                        return function() {
                            let x = this.pop()
                            if (x === null) {
                                this.push(types.pyNoneType.__pos__())
                            } else if (x.__pos__) {
                                this.push(x.__pos__())
                            } else {
                                this.push(+x)
                            }
                        }
                    case 'NEGATIVE':
                        return function() {
                            let x = this.pop()
                            if (x === null) {
                                this.push(types.pyNoneType.__neg__())
                            } else if (x.__neg__) {
                                this.push(x.__neg__())
                            } else {
                                this.push(-x)
                            }
                        }
                    case 'NOT':
                        return function() {
                            let x = this.pop()
                            if (x === null) {
                                this.push(types.pyNoneType.__not__())
                            } else if (x.__not__) {
                                this.push(x.__not__())
                            } else {
                                this.push(-x)
                            }
                        }
                    case 'INVERT':
                        return function() {
                            let x = this.pop()
                            if (x === null) {
                                this.push(types.pyNoneType.__invert__())
                            } else if (x.__invert__) {
                                this.push(x.__invert__())
                            } else {
                                this.push(~x)
                            }
                        }
                    default:
                        throw pyBataviaError('Unknown unary operator ' + operator_name)
                }
            } else if (opcode in dis.binary_ops) {
                operator_name = opname.slice(7)
                switch (operator_name) {
                    case 'POWER':
                        return function() {
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__pow__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__mul__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__mod__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__add__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__sub__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__getitem__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__floordiv__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__truediv__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__lshift__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__rshift__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__and__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__xor__(items[1]))
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
                            let items = this.popn(2)
                            if (items[0] === null) {
                                this.push(types.pyNoneType.__or__(items[1]))
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
                        throw pyBataviaError('Unknown binary operator ' + operator_name)
                }
            } else if (opcode in dis.inplace_ops) {
                operator_name = opname.slice(8)
                switch (operator_name) {
                    case 'FLOOR_DIVIDE':
                        return function() {
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__ifloordiv__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__itruediv__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__iadd__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__isub__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__imul__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__imod__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__ipow__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__ilshift__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__irshift__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__iand__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__ixor__(items[1])
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
                            let items = this.popn(2)
                            let result
                            if (items[0] === null) {
                                result = types.pyNoneType.__ior__(items[1])
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
                        throw pyBataviaError('Unknown inplace operator ' + operator_name)
                }
            } else {
                // dispatch
                let bytecode_fn = vm['byte_' + opname]
                if (bytecode_fn) {
                    return bytecode_fn
                } else {
                    return function() {
                        throw pyBataviaError('Unknown opcode ' + opcode + ' (' + opname + ')')
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
            let payload = this.loader(tag)
            let code = marshal.load_pyc(this, payload.bytecode)

            // Set up sys.argv
            sys.argv = types.pylist(['batavia'])
            if (args) {
                sys.argv.extend(args)
            }

            // Run the code
            return this.run_code({'code': code})
        } catch (e) {
            if (types.isinstance(e, pyBataviaError)) {
                sys.stderr.write(`${e.__class__.__name__}: ${e.msg}\n`)
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
            let payload = this.loader(tag)
            let code = marshal.load_pyc(this, payload.bytecode)

            let callargs = new JSDict()
            for (let i = 0, l = args.length; i < l; i++) {
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
            if (types.isinstance(e, pyBataviaError)) {
                sys.stderr.write(`${e.__class__.__name__}: ${e.msg}\n`)
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
        let exception = new Exception(message)
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
        let code = kwargs.code
        let callargs = kwargs.callargs || new JSDict()
        let f_globals = kwargs.f_globals || null
        let f_locals = kwargs.f_locals || null

        if (!code.hasOwnProperty('co_unpacked_code')) {
            this.unpack_code(code)
        }

        // console.log("make_frame: code=" + code + ", callargs=" + callargs);

        if (f_globals !== null) {
            if (f_locals === null) {
                f_locals = f_globals
            }
        } else if (this.frames.length > 0) {
            f_globals = this.frame.f_globals
            f_locals = new JSDict()
        } else {
            f_globals = f_locals = new JSDict({
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
        let tb = []
        let frame, mod_name, filename, line_num

        for (let f in this.frames) {
            frame = this.frames[f]

            // Work out the current source line by taking the
            // f_lineno (the line for the start of the method)
            // and adding the line offsets from the line
            // number table.
            if (frame.f_code) {
                let lnotab = frame.f_code.co_lnotab.$val
                let byte_num = 0
                line_num = frame.f_code.co_firstlineno

                for (let idx = 1; idx < lnotab.length && byte_num < frame.f_lasti; idx += 2) {
                    byte_num += lnotab[idx - 1]
                    if (byte_num < frame.f_lasti) {
                        line_num += lnotab[idx]
                    }
                }
                mod_name = frame.f_code.co_name
                filename = frame.f_code.co_filename
            } else {
                line_num = '???'
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

            while (pos < code.co_code.$val.length) {
                let opcode_start_pos = pos

                let opcode = code.co_code.$val[pos++]

                // next opcode has 4-byte argument effectively.
                if (opcode === dis.EXTENDED_ARG) {
                    extra = code.co_code.$val[pos++] << 8
                    unpacked_code[opcode_start_pos] = {
                        'opoffset': opcode_start_pos,
                        'opcode': dis.NOP,
                        'op_method': this.dispatch_table[dis.NOP],
                        'args': [],
                        'next_pos': pos
                    }
                    continue
                }

                let intArg = code.co_code.$val[pos++] | extra
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

            code.$raw.co_unpacked_code = unpacked_code
        } else {
            // Until 3.6 Python had variable width opcodes

            let pos = 0
            let unpacked_code = []
            let args
            let extra = 0
            let lo
            let hi

            while (pos < code.co_code.$val.length) {
                let opcode_start_pos = pos

                let opcode = code.co_code.$val[pos++]

                // next opcode has 4-byte argument effectively.
                if (opcode === dis.EXTENDED_ARG) {
                    lo = code.co_code.$val[pos++]
                    hi = code.co_code.$val[pos++]
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
                    lo = code.co_code.$val[pos++]
                    hi = code.co_code.$val[pos++]
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
        let code = kwargs.code
        let f_globals = kwargs.f_globals || null
        let f_locals = kwargs.f_locals || null
        let callargs = kwargs.callargs || null
        let frame = this.make_frame({
            'code': code,
            'f_globals': f_globals,
            'f_locals': f_locals,
            'callargs': callargs
        })
        try {
            let val = this.run_frame(frame)

            // Check some invariants
            if (this.has_session) {
                if (this.frames.length > 1) {
                    throw pyBataviaError('Frames left over in session!')
                }
            } else {
                if (this.frames.length > 0) {
                    throw pyBataviaError('Frames left over!')
                }
            }
            if (this.frame && this.frame.stack.length > 0) {
                throw pyBataviaError('Data left on stack! ' + this.frame.stack)
            }
            return val
        } catch (e) {
            if (this.last_exception) {
                let trace = ['Traceback (most recent call last):']
                for (let t in this.last_exception.traceback) {
                    frame = this.last_exception.traceback[t]
                    trace.push('  File "' + frame.filename + '", line ' + frame.line + ', in ' + frame.module)
                }
                if (this.last_exception.value.__class__) {
                    if (this.last_exception.value.__str__().length > 0) {
                        trace.push(`${this.last_exception.value.__class__.__name__}: ${this.last_exception.value.__str__()}`)
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
        }
        sys.stdout.flush()
        sys.stderr.flush()
    }

    unwind_block(block) {
        let offset

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
        let op = opcode.opoffset + ': ' + opcode.byteName
        for (let arg in opcode.args) {
            op += ' ' + opcode.args[arg]
        }
        let indent = '    ' * (this.frames.length - 1)

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
        let block = this.frame.block_stack[this.frame.block_stack.length - 1]
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
            let exc = this.last_exception
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
        let why, operation

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
            let opname = dis.opname[operation.opcode] // eslint-disable-line no-unused-vars

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
                if (types.isinstance(err, pyBataviaError)) {
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
        let items = this.popn(count)
        for (let n = 0; n < 2; n++) {
            for (let i = 0; i < count; i++) {
                this.push(items[i])
            }
        }
    }

    byte_DUP_TOP_TWO() {
        let items = this.popn(2)
        this.push(items[0])
        this.push(items[1])
        this.push(items[0])
        this.push(items[1])
    }

    byte_ROT_TWO() {
        let items = this.popn(2)
        this.push(items[1])
        this.push(items[0])
    }

    byte_ROT_THREE() {
        let items = this.popn(3)
        this.push(items[2])
        this.push(items[0])
        this.push(items[1])
    }

    byte_ROT_FOUR() {
        let items = this.popn(4)
        this.push(items[3])
        this.push(items[0])
        this.push(items[1])
        this.push(items[2])
    }

    byte_LOAD_NAME(name) {
        let val = this.frame.f_locals.get(name, null)
        if (val === null) {
            val = this.frame.f_globals.get(name, null)
        }
        if (val === null) {
            val = this.frame.f_builtins[name]
            if (val === undefined) {
                val = null
            }
        }
        if (val === null) {
            throw pyNameError(`name '${name}' is not defined`)
        }
        this.push(val)
    }

    byte_STORE_NAME(name) {
        this.frame.f_locals.__setitem__(name, this.pop())
    }

    byte_DELETE_NAME(name) {
        this.frame.f_locals.pop(name)
    }

    byte_LOAD_FAST(name) {
        let val = this.frame.f_locals.get(name, null)
        if (val === null) {
            throw pyUnboundLocalError(`local variable '${name}' referenced before assignment`)
        }
        this.push(val)
    }

    byte_STORE_FAST(name) {
        this.frame.f_locals.__setitem__(name, this.pop())
    }

    byte_DELETE_FAST(name) {
        this.frame.f_locals.pop(name)
    }

    byte_STORE_GLOBAL(name) {
        this.frame.f_globals.__setitem__(name, this.pop())
    }

    byte_LOAD_GLOBAL(name) {
        let val = this.frame.f_globals.get(name, null)
        if (val === null) {
            val = this.frame.f_builtins[name]
            if (val === undefined) {
                val = null
            }
        }
        if (val === null) {
            throw pyNameError(`name '${name}' is not defined`)
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
        let items = this.popn(2)
        let result

        // "in" and "not in" operators (opnum 6 and 7) have reversed
        // operand order, so they're handled separately.
        // If the first operand is pyNone, then we need to invoke
        // the comparison method in a different way, because we can't
        // bind the operator methods to the null instance.

        if (opnum === 6) { // x in pyNone
            if (items[1] === null) {
                result = types.pyNoneType.__contains__(items[0])
            } if (items[1].__contains__) {
                result = items[1].__contains__(items[0])
            } else {
                result = (items[0] in items[1])
            }
        } else if (opnum === 7) {
            if (items[1] === null) { // x not in pyNone
                result = types.pyNoneType.__contains__(items[0]).__not__()
            } else if (items[1].__contains__) {
                result = items[1].__contains__(items[0]).__not__()
            } else {
                result = !(items[0] in items[1])
            }
        } else if (items[0] === null) {
            switch (opnum) {
                case 0: // <
                    result = types.pyNoneType.__lt__(items[1])
                    break
                case 1: // <=
                    result = types.pyNoneType.__le__(items[1])
                    break
                case 2: // ==
                    result = types.pyNoneType.__eq__(items[1])
                    break
                case 3: // !=
                    result = types.pyNoneType.__ne__(items[1])
                    break
                case 4: // >
                    result = types.pyNoneType.__gt__(items[1])
                    break
                case 5: // >=
                    result = types.pyNoneType.__ge__(items[1])
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
                    throw pyBataviaError('Unknown operator ' + opnum)
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
                    throw pyBataviaError('Unknown operator ' + opnum)
            }
        }

        this.push(result)
    }

    byte_LOAD_ATTR(attr) {
        let obj = this.pop()
        let val = obj[attr]

        // Methods retrieved from an actual Javascript object, that are
        // actual Javascript methods, need to be bound to the object.
        if (val instanceof Function) {
            if (!val.$raw) {
                val = val.bind(obj)
            }
        }
        this.push(val)
    }

    byte_STORE_ATTR(name) {
        let items = this.popn(2)
        items[1][name] = items[0]
    }

    byte_DELETE_ATTR(name) {
        let obj = this.pop()
        delete obj[name]
    }

    byte_STORE_SUBSCR() {
        let items = this.popn(3)
        if (items[1].__setitem__) {
            items[1].__setitem__(items[2], items[0])
        } else {
            items[1][items[2]] = items[0]
        }
    }

    byte_DELETE_SUBSCR() {
        let items = this.popn(2)
        if (items[0].__delitem__) {
            items[0].__delitem__(items[1])
        } else {
            delete items[0][items[1]]
        }
    }

    byte_BUILD_TUPLE(count) {
        let items = this.popn(count)
        this.push(types.pytuple(items))
    }

    byte_BUILD_LIST(count) {
        let items = this.popn(count)
        this.push(types.pylist(items))
    }

    byte_BUILD_SET(count) {
        let items = this.popn(count)
        this.push(types.pyset(items))
    }

    byte_BUILD_MAP(size) {
        if (version.later('3.5a0')) {
            let items = this.popn(size * 2)
            let dict = types.pydict()

            for (let i = 0; i < items.length; i += 2) {
                dict.__setitem__(items[i], items[i + 1])
            }

            this.push(dict)
        } else {
            this.push(types.pydict())
        }
    }

    byte_BUILD_CONST_KEY_MAP(size) {
        let keys = this.pop()
        let values = this.popn(size)
        let dict = types.pydict()

        for (let i = 0; i < values.length; i += 1) {
            dict.__setitem__(keys[i], values[i])
        }
        this.push(dict)
    }

    byte_STORE_MAP() {
        if (version.later('3.5a0')) {
            throw pyBataviaError(
                'STORE_MAP is unsupported with BATAVIA_MAGIC'
            )
        } else {
            let items = this.popn(3)
            if (items[0].__setitem__) {
                items[0].__setitem__(items[2], items[1])
            } else {
                items[0][items[2]] = items[1]
            }
            this.push(items[0])
        }
    }

    byte_UNPACK_SEQUENCE(count) {
        let seq = this.pop()

        // If the sequence item on top of the stack is iterable,
        // expand it into an array.
        if (seq.__iter__) {
            try {
                let iter = seq.__iter__()
                seq = []
                while (true) {
                    seq.push(iter.__next__())
                }
            } catch (err) {}
        }

        for (let i = seq.length; i > 0; i--) {
            this.push(seq[i - 1])
        }
    }

    byte_BUILD_SLICE(count) {
        if (count === 2 || count === 3) {
            let items = this.popn(count)
            this.push(new builtins.slice.$pyclass(...items))
        } else {
            throw pyBataviaError('Strange BUILD_SLICE count: ' + count)
        }
    }

    byte_LIST_APPEND(count) {
        let val = this.pop()
        let the_list = this.peek(count)
        the_list.push(val)
    }

    byte_SET_ADD(count) {
        let val = this.pop()
        let the_set = this.peek(count)
        the_set.add(val)
    }

    byte_MAP_ADD(count) {
        let items = this.popn(2)
        let the_map = this.peek(count)
        the_map[items[1]] = items[0]
    }

    byte_PRINT_EXPR() {
        sys.stdout.write(this.pop())
    }

    byte_PRINT_ITEM() {
        let item = this.pop()
        this.print_item(item)
    }

    byte_PRINT_ITEM_TO() {
        this.pop() // FIXME - the to value is ignored.
        let item = this.pop()
        this.print_item(item)
    }

    byte_PRINT_NEWLINE() {
        this.print_newline()
    }

    byte_PRINT_NEWLINE_TO() {
        let to = this.pop() // FIXME - this is ignored.
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
        let val = this.pop()
        if (val.__bool__ !== undefined) {
            val = val.__bool__().valueOf()
        }

        if (val) {
            this.jump(jump)
        }
    }

    byte_POP_JUMP_IF_FALSE(jump) {
        let val = this.pop()
        if (val.__bool__ !== undefined) {
            val = val.__bool__().valueOf()
        }

        if (!val) {
            this.jump(jump)
        }
    }

    byte_JUMP_IF_TRUE_OR_POP(jump) {
        let val = this.top()
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
        let val = this.top()
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
        this.push(builtins.iter.call(this, this.pop()))
    }

    byte_FOR_ITER(jump) {
        let iterobj = this.top()
        try {
            let v = iterobj.__next__()
            this.push(v)
        } catch (err) {
            if (types.isinstance(err, pyStopIteration)) {
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
        let why, value, traceback
        let exc_type = this.pop()
        if (exc_type === pyNone) {
            why = null
        } else if (exc_type === 'silenced') {
            let block = this.pop_block() // should be except-handler
            this.unwind_block(block)
            return null
        } else {
            value = this.pop()
            if (types.isinstance(value, pyBaseException)) {
                traceback = this.pop()
                this.last_exception = {
                    'exc_type': exc_type,
                    'value': value,
                    'traceback': traceback
                }
                why = 'reraise'
            } else {
                throw pyBataviaError('Confused END_FINALLY: ' + value.toString())
            }
        }
        return why
    }

    byte_POP_BLOCK() {
        this.pop_block()
    }

    byte_RAISE_VARARGS(argc) {
        let cause, exc
        if (argc === 2) {
            cause = this.pop()
            exc = this.pop()
        } else if (argc === 1) {
            exc = this.pop()
        }
        return this.do_raise(exc, cause)
    }

    do_raise(exc, cause) {
        let exc_type, val
        if (exc === undefined) { // reraise
            if (this.last_exception.exc_type === undefined) {
                return 'exception' // error
            } else {
                return 'reraise'
            }
        } else if (types.isinstance(exc, pyBaseException)) {
            // As in `throw pyValueError('foo')`
            exc_type = exc.__class__
            val = exc
        } else if (exc instanceof pyBaseException ||
                   exc === pyBaseException) {
            exc_type = exc
            val = new exc_type() // eslint-disable-line new-cap
        } else {
            return 'exception' // error
        }

        // If you reach this point, you're guaranteed that
        // val is a valid exception instance and exc_type is its class.
        // Now do a similar thing for the cause, if present.
        if (cause) {
            // if not isinstance(cause, pyBaseException):
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
        let block = this.pop_block()
        if (block.type !== 'except-handler') {
            throw pyBataviaError('popped block is not an except handler')
        }
        this.unwind_block(block)
    }

    byte_SETUP_WITH(dest) {
        let mgr = this.top()
        let res = mgr.__enter__()
        this.push_block('finally', dest)
        this.push(res)
    }

    byte_WITH_CLEANUP() {
        let exc = this.top()
        let mgr
        let val = pyNone
        let tb = pyNone
        if (exc === pyNone) {
            mgr = this.pop(1)
        } else if (exc instanceof String) {
            if (exc === 'return' || exc === 'continue') {
                mgr = this.pop(2)
            } else {
                mgr = this.pop(1)
            }
            exc = pyNone
        } else if (types.isinstance(exc, pyBaseException)) {
            val = this.peek(2)
            tb = this.peek(3)
            mgr = this.pop(6)
            this.push_at(pyNone, 3)
            let block = this.pop_block()
            this.push_block(block.type, block.handler, block.level - 1)
        } else {
            throw pyBataviaError('Confused WITH_CLEANUP')
        }
        let ret = mgr.__exit__(exc, val, tb)
        if (version.earlier('3.5a0')) {
            if (!(exc === pyNone) && ret.__bool__ !== undefined &&
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
            throw pyBataviaError(
                'Unknown opcode WITH_CLEANUP_FINISH in Python 3.4'
            )
        }
        // Assuming Python 3.5
        let ret = this.pop()
        let exc = this.pop()
        if (!(exc === pyNone) && ret.__bool__ !== undefined &&
                ret.__bool__().valueOf()) {
            this.push('silenced')
        }
    }

    byte_MAKE_FUNCTION(arg) {
        let name = this.pop()
        let code = this.pop()
        let closure = null
        let annotations = null // eslint-disable-line no-unused-vars
        let kwdefaults = null // eslint-disable-line no-unused-vars
        let defaults = null

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

        let fn = types.pyfunction(name, code, this.frame.f_globals, defaults, closure, this)
        this.push(fn)
    }

    byte_LOAD_CLOSURE(name) {
        this.push(this.frame.cells[name])
    }

    byte_MAKE_CLOSURE(argc) {
        let name = this.pop()
        let items = this.popn(2)
        let defaults = this.popn(argc)
        let fn = types.pyfunction(name, items[1], this.frame.f_globals, defaults, items[0], this)
        this.push(fn)
    }

    byte_CALL_FUNCTION(arg) {
        return this.call_function(arg, null, null)
    }

    byte_CALL_FUNCTION_VAR(arg) {
        let args = this.pop()
        return this.call_function(arg, args, null)
    }

    byte_CALL_FUNCTION_KW(arg) {
        if (!version.earlier('3.6')) {
            let kw = this.pop()
            let namedargs = new JSDict()
            for (let i = kw.length - 1; i >= 0; i--) {
                namedargs[kw[i]] = this.pop()
            }
            return this.call_function(arg - kw.length, null, namedargs)
        }
        let kwargs = this.pop()
        return this.call_function(arg, null, kwargs)
    }

    byte_CALL_FUNCTION_VAR_KW(arg) {
        if (!version.earlier('3.6')) {
            // opcode: CALL_FUNCTION_EX
            let kwargs
            if (arg & 1) {
                kwargs = this.pop()
            }
            let args = this.pop()
            return this.call_function(0, args, kwargs)
        } else {
            let items = this.popn(2)
            return this.call_function(arg, items[0], items[1])
        }
    }

    call_function(arg, args, kwargs) {
        if (!version.earlier('3.6')) {
            let namedargs = new JSDict()
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

            let retval = call_function(this, func, posargs, namedargs)
            this.push(retval)
        } else {
            let namedargs = new JSDict()
            let lenKw = Math.floor(arg / 256)
            let lenPos = arg % 256
            for (let i = 0; i < lenKw; i++) {
                let items = this.popn(2)
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

            let retval = call_function(this, func, posargs, namedargs)
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
        let v = this.pop()
        let receiver = this.top()

        try {
            if (v === pyNone ||
                    !types.isinstance(receiver, types.pygenerator)) {
                this.return_value = receiver.__next__()
            } else {
                this.return_value = receiver.send(v)
            }
        } catch (e) {
            if (types.isinstance(e, pyStopIteration)) {
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
        let items = this.popn(2)
        this.push(
            builtins.__import__.call(this, name, this.frame.f_globals, this.frame.f_locals, items[1], items[0])
        )
    }

    byte_IMPORT_STAR() {
        // TODO: this doesn't use __all__ properly.
        let mod = this.pop()
        let name
        if ('__all__' in mod) {
            for (let n = 0; n < mod.__all__.length; n++) {
                name = mod.__all__[n]
                this.frame.f_locals[name] = mod[name]
            }
        } else {
            for (name in mod) {
                if (name[0] !== '_') {
                    this.frame.f_locals[name] = mod[name]
                }
            }
        }
    }

    byte_IMPORT_FROM(name) {
        let mod = this.top()
        let val = mod[name]
        this.push(val)
    }

    // byte_EXEC_STMT() {
    //     stmt, globs, locs = this.popn(3)
    //     six.exec_(stmt, globs, locs) f
    // };

    @pyargs({
        args: ['build_attrs', 'name'],
        varargs: ['bases']
    })
    make_type(build_attrs, name, bases) {
        // Create a attrs context, and run the class function in it.
        let attrs = types.pydict()
        build_attrs.__call__([], {}, attrs)

        // Return the new type. Calling the type will construct instances.
        return type(name, bases, attrs)
    }

    byte_LOAD_BUILD_CLASS() {
        this.push(this.make_type)
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
