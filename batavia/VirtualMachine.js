
/*************************************************************************
 * Virtual Machine
 *************************************************************************/

batavia.VirtualMachine = function(loader) {
    // Initialize the bytecode module
    batavia.modules.dis.init();

    if (loader === undefined) {
        this.loader = function(name) {
            return document.getElementById('batavia-' + name).text.replace(/(\r\n|\n|\r)/gm, "").trim();
        };
    } else {
        this.loader = loader;
    }

    // Build a table mapping opcodes to method calls
    this.build_dispatch_table();

    // The call stack of frames.
    this.frames = [];

    // The current frame.
    this.frame = null;
    this.return_value = null;
    this.last_exception = null;
    this.is_vm = true;
};


/*
 * Build a table mapping opcodes to a method to be called whenever we encounter that opcode.
 *
 * Each such method will be invoked with apply(this, args).
 */
batavia.VirtualMachine.prototype.build_dispatch_table = function() {
    var vm = this;
    this.dispatch_table = batavia.modules.dis.opname.map(function(opname, opcode) {
        var operator_name, operator;

        if (opcode in batavia.modules.dis.unary_ops) {
            operator_name = opname.slice(6);
            switch (operator_name) {
                case "POSITIVE":
                    return function() {
                        var x = this.pop();
                        if (x === null) {
                            this.push(batavia.types.NoneType.__pos__());
                        } else if (x.__pos__) {
                            this.push(x.__pos__());
                        } else {
                            this.push(+x);
                        }
                    };
                case "NEGATIVE":
                    return function() {
                        var x = this.pop();
                        if (x === null) {
                            this.push(batavia.types.NoneType.__neg__());
                        } else if (x.__neg__) {
                            this.push(x.__neg__());
                        } else {
                            this.push(-x);
                        }
                    };
                case "NOT":
                    return function() {
                        var x = this.pop();
                        if (x === null) {
                            this.push(batavia.types.NoneType.__not__());
                        } else if (x.__not__) {
                            this.push(x.__not__());
                        } else {
                            this.push(-x);
                        }
                    };
                case "INVERT":
                    return function() {
                        var x = this.pop();
                        if (x === null) {
                            this.push(batavia.types.NoneType.__invert__());
                        } else if (x.__invert__) {
                            this.push(x.__invert__());
                        } else {
                            this.push(~x);
                        }
                    };
                default:
                    throw new batavia.builtins.BataviaError("Unknown unary operator " + operator_name);
            }
        } else if (opcode in batavia.modules.dis.binary_ops) {
            operator_name = opname.slice(7);
            switch (operator_name) {
                case 'POWER':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__pow__(items[1]));
                        } else if (items[0].__pow__) {
                            this.push(items[0].__pow__(items[1]));
                        } else {
                            this.push(Math.pow(items[0], items[1]));
                        }
                    };
                case 'MULTIPLY':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__mul__(items[1]));
                        } else if (items[0].__mul__) {
                            this.push(items[0].__mul__(items[1]));
                        } else {
                            this.push(items[0] * items[1]);
                        }
                    };
                case 'MODULO':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__mod__(items[1]));
                        } else if (items[0].__mod__) {
                            this.push(items[0].__mod__(items[1]));
                        } else {
                            this.push(items[0] % items[1]);
                        }
                    };
                case 'ADD':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__add__(items[1]));
                        } else if (items[0].__add__) {
                            this.push(items[0].__add__(items[1]));
                        } else {
                            this.push(items[0] + items[1]);
                        }
                    };
                case 'SUBTRACT':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__sub__(items[1]));
                        } else if (items[0].__sub__) {
                            this.push(items[0].__sub__(items[1]));
                        } else {
                            this.push(items[0] - items[1]);
                        }
                    };
                case 'SUBSCR':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__getitem__(items[1]));
                        } else if (items[0].__getitem__) {
                            this.push(items[0].__getitem__(items[1]));
                        } else {
                            this.push(items[0][items[1]]);
                        }
                    };
                case 'FLOOR_DIVIDE':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__floordiv__(items[1]));
                        } else if (items[0].__floordiv__) {
                            this.push(items[0].__floordiv__(items[1]));
                        } else {
                            this.push(items[0] / items[1]);
                        }
                    };
                case 'TRUE_DIVIDE':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__truediv__(items[1]));
                        } else if (items[0].__truediv__) {
                            this.push(items[0].__truediv__(items[1]));
                        } else {
                            this.push(items[0] / items[1]);
                        }
                    };
                case 'LSHIFT':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__lshift__(items[1]));
                        } else if (items[0].__lshift__) {
                            this.push(items[0].__lshift__(items[1]));
                        } else {
                            this.push(items[0] << items[1]);
                        }
                    };
                case 'RSHIFT':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__rshift__(items[1]));
                        } else if (items[0].__rshift__) {
                            this.push(items[0].__rshift__(items[1]));
                        } else {
                            this.push(items[0] >> items[1]);
                        }
                    };
                case 'AND':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__and__(items[1]));
                        } else if (items[0].__and__) {
                            this.push(items[0].__and__(items[1]));
                        } else {
                            this.push(items[0] & items[1]);
                        }
                    };
                case 'XOR':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__xor__(items[1]));
                        } else if (items[0].__xor__) {
                            this.push(items[0].__xor__(items[1]));
                        } else {
                            this.push(items[0] ^ items[1]);
                        }
                    };
                case 'OR':
                    return function() {
                        var items = this.popn(2);
                        if (items[0] === null) {
                            this.push(batavia.types.NoneType.__or__(items[1]));
                        } else if (items[0].__or__) {
                            this.push(items[0].__or__(items[1]));
                        } else {
                            this.push(items[0] | items[1]);
                        }
                    };
                default:
                    throw new batavia.builtins.BataviaError("Unknown binary operator " + operator_name);
            }
        } else if (opcode in batavia.modules.dis.inplace_ops) {
            operator_name = opname.slice(8);
            switch (operator_name) {
                case 'FLOOR_DIVIDE':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__ifloordiv__(items[1]);
                        } else if (items[0].__ifloordiv__) {
                            result = items[0].__ifloordiv__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] /= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'TRUE_DIVIDE':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__itruediv__(items[1]);
                        } else if (items[0].__itruediv__) {
                            result = items[0].__itruediv__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] /= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'ADD':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__iadd__(items[1]);
                        } else if (items[0].__iadd__) {
                            result = items[0].__iadd__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] += items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'SUBTRACT':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__isub__(items[1]);
                        } else if (items[0].__isub__) {
                            result = items[0].__isub__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] -= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'MULTIPLY':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__imul__(items[1]);
                        } else if (items[0].__imul__) {
                            result = items[0].__imul__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] *= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'MODULO':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__imod__(items[1]);
                        } else if (items[0].__imod__) {
                            result = items[0].__imod__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] %= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'POWER':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__ipow__(items[1]);
                        } else if (items[0].__ipow__) {
                            result = items[0].__ipow__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] = Math.pow(items[0], items[1]);
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'LSHIFT':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__ilshift__(items[1]);
                        } else if (items[0].__ilshift__) {
                            result = items[0].__ilshift__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] <<= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'RSHIFT':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__irshift__(items[1]);
                        } else if (items[0].__irshift__) {
                            result = items[0].__irshift__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] >>= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'AND':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__iand__(items[1]);
                        } else if (items[0].__iand__) {
                            result = items[0].__iand__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] &= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'XOR':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__ixor__(items[1]);
                        } else if (items[0].__ixor__) {
                            result = items[0].__ixor__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] ^= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                case 'OR':
                    return function() {
                        var items = this.popn(2);
                        var result;
                        if (items[0] === null) {
                            result = batavia.types.NoneType.__ior__(items[1]);
                        } else if (items[0].__ior__) {
                            result = items[0].__ior__(items[1]);
                            if (result === null) {
                                result = items[0];
                            }
                        } else {
                            items[0] |= items[1];
                            result = items[0];
                        }
                        this.push(result);
                    };
                default:
                    throw new batavia.builtins.BataviaError("Unknown inplace operator " + operator_name);
            }
        } else {
            // dispatch
            var bytecode_fn = vm['byte_' + opname];
            if (bytecode_fn) {
                return bytecode_fn;
            } else {
                return function() {
                    throw new batavia.builtins.BataviaError("Unknown opcode " + opcode + " (" + opname + ")");
                };
            }
        }
    });
};

/*
 * The main entry point.
 *
 * Accepts a DOM id for an element containing base64 encoded bytecode.
 */
batavia.VirtualMachine.prototype.run = function(tag, args) {
    try {
        var payload = this.loader(tag);
        var code = batavia.modules.marshal.load_pyc(this, payload);

        // Set up sys.argv
        batavia.modules.sys.argv = new batavia.types.List(['batavia']);
        if (args) {
            batavia.modules.sys.argv.extend(args);
        }

        // Run the code
        return this.run_code({'code': code});

    } catch (e) {
        if (e instanceof batavia.builtins.BataviaError) {
            console.log(e.msg);
        } else {
            throw e;
        }
    }
};

/*
 * An entry point for invoking functions.
 *
 * Accepts a DOM id for an element containing base64 encoded bytecode.
 */
batavia.VirtualMachine.prototype.run_method = function(tag, args, kwargs, f_locals, f_globals) {
    try {
        var payload = this.loader(tag);
        var code = batavia.modules.marshal.load_pyc(this, payload);

        var callargs = new batavia.types.Dict();
        for (var i = 0, l = args.length; i < l; i++) {
            callargs[code.co_varnames[i]] = args[i];
        }
        callargs.update(kwargs);

        // Run the code
        return this.run_code({
            'code': code,
            'callargs': callargs,
            'f_locals': f_locals,
            'f_globals': f_globals
        });

    } catch (e) {
        if (e instanceof batavia.builtins.BataviaError) {
            console.log(e.msg);
        } else {
            throw e;
        }
    }
};

/*
 */
batavia.VirtualMachine.prototype.PyErr_Occurred = function() {
    return this.last_exception !== null;
};

batavia.VirtualMachine.prototype.PyErr_SetString = function(exc, message) {
    var exception = new exc(message);
    this.last_exception = {
        'exc_type': exception.constructor,
        'value': exception,
        'traceback': this.create_traceback()
    };
};

/*
 * Return the value at the top of the stack, with no changes.
 */
batavia.VirtualMachine.prototype.top = function() {
    return this.frame.stack[this.frame.stack.length - 1];
};

/*
 * Pop a value from the stack.
 *
 * Default to the top of the stack, but `i` can be a count from the top
 * instead.
 */
batavia.VirtualMachine.prototype.pop = function(i) {
    if (i === undefined) {
        i = 0;
    }
    return this.frame.stack.splice(this.frame.stack.length - 1 - i, 1)[0];
};

/*
 * Push value onto the value stack.
 */
batavia.VirtualMachine.prototype.push = function(val) {
    this.frame.stack.push(val);
};

/*
 * Pop a number of values from the value stack.
 *
 * A list of `n` values is returned, the deepest value first.
*/
batavia.VirtualMachine.prototype.popn = function(n) {
    if (n) {
        return this.frame.stack.splice(this.frame.stack.length - n, n);
    } else {
        return [];
    }
};

/*
 * Get a value `n` entries down in the stack, without changing the stack.
 */
batavia.VirtualMachine.prototype.peek = function(n) {
    return this.frame.stack[this.frame.stack.length - n];
};

/*
 * Move the bytecode pointer to `jump`, so it will execute next.
 */
batavia.VirtualMachine.prototype.jump = function(jump) {
    this.frame.f_lasti = jump;
};

batavia.VirtualMachine.prototype.push_block = function(type, handler, level) {
    if (level === null) {
        level = this.frame.stack.length;
    }
    this.frame.block_stack.push(new batavia.core.Block(type, handler, level));
};

batavia.VirtualMachine.prototype.pop_block = function() {
    return this.frame.block_stack.pop();
};

batavia.VirtualMachine.prototype.make_frame = function(kwargs) {
    var code = kwargs.code;
    var callargs = kwargs.callargs || {};
    var f_globals = kwargs.f_globals || null;
    var f_locals = kwargs.f_locals || null;

    if (!code.co_unpacked_code) {
        this.unpack_code(code);
    }

    // console.log("make_frame: code=" + code + ", callargs=" + callargs);

    if (f_globals !== null) {
        if (f_locals === null) {
            f_locals = f_globals;
        }
    } else if (this.frames.length > 0) {
        f_globals = this.frame.f_globals;
        f_locals = new batavia.types.Dict();
    } else {
        f_globals = f_locals = new batavia.types.Dict({
            '__builtins__': batavia.builtins,
            '__name__': '__main__',
            '__doc__': null,
            '__package__': null,
        });
    }
    f_locals.update(callargs);

    frame = new batavia.core.Frame({
        'f_code': code,
        'f_globals': f_globals,
        'f_locals': f_locals,
        'f_back': this.frame
    });
    return frame;
};

batavia.VirtualMachine.prototype.push_frame = function(frame) {
    this.frames.push(frame);
    this.frame = frame;
};

batavia.VirtualMachine.prototype.pop_frame = function() {
    this.frames.pop();
    if (this.frames) {
        this.frame = this.frames[this.frames.length - 1];
    } else {
        this.frame = null;
    }
};

batavia.VirtualMachine.prototype.create_traceback = function() {
    var tb = [];
    var frame;

    for (var f in this.frames) {
        frame = this.frames[f];

        // Work out the current source line by taking the
        // f_lineno (the line for the start of the method)
        // and adding the line offsets from the line
        // number table.
        var lnotab = frame.f_code.co_lnotab;
        var byte_num = 0;
        var line_num = frame.f_code.co_firstlineno;

        var byte_incr, line_incr;
        for (var idx = 1; idx < lnotab.length, byte_num < frame.f_lasti; idx += 2) {
            byte_num += lnotab.charCodeAt(idx - 1);
            if (byte_num < frame.f_lasti) {
                line_num += lnotab.charCodeAt(idx);
            }
        }

        tb.push({
            'module': frame.f_code.co_name,
            'filename': frame.f_code.co_filename,
            'line': line_num
        });
    }
    return tb;
};

/*
 * Annotate a Code object with a co_unpacked_code property, consisting of the bytecode
 * unpacked into operations with their respective args
 */
batavia.VirtualMachine.prototype.unpack_code = function(code) {
    var pos = 0;
    var unpacked_code = [];
    var args;

    while (pos < code.co_code.length) {
        var opcode_start_pos = pos;

        var opcode = code.co_code[pos++];

        if (opcode < batavia.modules.dis.HAVE_ARGUMENT) {
            args = [];
        } else {
            var lo = code.co_code[pos++];
            var hi = code.co_code[pos++];
            var intArg = lo + (hi << 8);

            if (opcode in batavia.modules.dis.hasconst) {
                args = [code.co_consts[intArg]];
            } else if (opcode in batavia.modules.dis.hasfree) {
                if (intArg < code.co_cellvars.length) {
                    args = [code.co_cellvars[intArg]];
                } else {
                    var_idx = intArg - code.co_cellvars.length;
                    args = [code.co_freevars[var_idx]];
                }
            } else if (opcode in batavia.modules.dis.hasname) {
                args = [code.co_names[intArg]];
            } else if (opcode in batavia.modules.dis.hasjrel) {
                args = [pos + intArg];
            } else if (opcode in batavia.modules.dis.hasjabs) {
                args = [intArg];
            } else if (opcode in batavia.modules.dis.haslocal) {
                args = [code.co_varnames[intArg]];
            } else {
                args = [intArg];
            }
        }

        unpacked_code[opcode_start_pos] = {
            'opoffset': opcode_start_pos,
            'opcode': opcode,
            'op_method': this.dispatch_table[opcode],
            'args': args,
            'next_pos': pos
        };
    }

    code.co_unpacked_code = unpacked_code;
};

batavia.VirtualMachine.prototype.run_code = function(kwargs) {
    var code = kwargs.code;
    var f_globals = kwargs.f_globals || null;
    var f_locals = kwargs.f_locals || null;
    var callargs = kwargs.callargs || null;
    var frame = this.make_frame({
        'code': code,
        'f_globals': f_globals,
        'f_locals': f_locals,
        'callargs': callargs
    });
    try {
        var val = this.run_frame(frame);

        // Check some invariants
        if (this.frames.length > 0) {
            throw new batavia.builtins.BataviaError("Frames left over!");
        }
        if (this.frame && this.frame.stack.length > 0) {
            throw new batavia.builtins.BataviaError("Data left on stack! " + this.frame.stack);
        }
        return val;
    } catch (e) {
        if (this.last_exception) {
            trace = ['Traceback (most recent call last):'];
            var frame;
            for (var t in this.last_exception.traceback) {
                frame = this.last_exception.traceback[t];
                trace.push('  File "' + frame.filename + '", line ' + frame.line + ', in ' + frame.module);
            }
            trace.push(this.last_exception.value.toString());
            console.log(trace.join('\n'));
            this.last_exception = null;
        } else {
            throw e;
        }
    }
};

batavia.VirtualMachine.prototype.unwind_block = function(block) {
    if (block.type === 'except-handler') {
        offset = 3;
    } else {
        offset = 0;
    }

    while (this.frame.stack.length > block.level + offset) {
        this.pop();
    }

    if (block.type === 'except-handler') {
        exc = this.popn(3);
        this.last_exception = {
            'exc_type': exc[2],
            'value': exc[1],
            'traceback': exc[0]
        };
    }
};

/*
 * Parse 1 - 3 bytes of bytecode into
 * an instruction and optionally arguments.
 */
batavia.VirtualMachine.prototype.parse_byte_and_args = function() {
    var operation = {
        'opoffset': this.frame.f_lasti,
        'opcode': this.frame.f_code.co_code[this.frame.f_lasti],
        'args': []
    };
    var dis = batavia.modules.dis;
    this.frame.f_lasti += 1;
    if (operation.opcode >= dis.HAVE_ARGUMENT) {
        var arg = this.frame.f_code.co_code.slice(this.frame.f_lasti, this.frame.f_lasti + 2);
        this.frame.f_lasti += 2;
        var intArg = arg[0] + (arg[1] << 8);
        if (operation.opcode in dis.hasconst) {
            operation.args = [this.frame.f_code.co_consts[intArg]];
        } else if (operation.opcode in dis.hasfree) {
            if (intArg < this.frame.f_code.co_cellvars.length) {
                operation.args = [this.frame.f_code.co_cellvars[intArg]];
            } else {
                var_idx = intArg - this.frame.f_code.co_cellvars.length;
                operation.args = [this.frame.f_code.co_freevars[var_idx]];
            }
        } else if (operation.opcode in dis.hasname) {
            operation.args = [this.frame.f_code.co_names[intArg]];
        } else if (operation.opcode in dis.hasjrel) {
            operation.args = [this.frame.f_lasti + intArg];
        } else if (operation.opcode in dis.hasjabs) {
            operation.args = [intArg];
        } else if (operation.opcode in dis.haslocal) {
            operation.args = [this.frame.f_code.co_varnames[intArg]];
        } else {
            operation.args = [intArg];
        }
    }

    return operation;
};

/*
 * Log arguments, block stack, and data stack for each opcode.
 */
batavia.VirtualMachine.prototype.log = function(opcode) {
    var op = opcode.opoffset + ': ' + opcode.byteName;
    for (var arg in opcode.args) {
        op += ' ' + opcode.args[arg];
    }
    var indent = "    " * (this.frames.length - 1);

    console.log("  " + indent + "data: " + this.frame.stack);
    console.log("  " + indent + "blks: " + this.frame.block_stack);
    console.log(indent + op);
};

/*
 * Manage a frame's block stack.
 * Manipulate the block stack and data stack for looping,
 * exception handling, or returning.
 */
batavia.VirtualMachine.prototype.manage_block_stack = function(why) {
    assert(why !== 'yield');

    var block = this.frame.block_stack[this.frame.block_stack.length - 1];
    if (block.type === 'loop' && why === 'continue') {
        this.jump(this.return_value);
        why = null;
        return why;
    }

    this.pop_block();
    this.unwind_block(block);

    if (block.type === 'loop' && why === 'break') {
        why = null;
        this.jump(block.handler);
        return why;
    }

    if (why === 'exception' &&
            (block.type === 'setup-except' || block.type === 'finally')) {
        this.push_block('except-handler');
        var exc = this.last_exception;
        this.push(exc.traceback);
        this.push(exc.value);
        this.push(exc.exc_type);
        // PyErr_Normalize_Exception goes here
        this.push(exc.traceback);
        this.push(exc.value);
        this.push(exc.exc_type);
        why = null;
        this.jump(block.handler);
        return why;
    } else if (block.type === 'finally') {
        if (why === 'return' || why === 'continue') {
            this.push(this.return_value);
        }
        this.push(why);

        why = null;
        this.jump(block.handler);
        return why;
    }

    return why;
};
/*
 * Run a frame until it returns (somehow).
 *
 * Exceptions are raised, the return value is returned.
 *
 */
batavia.VirtualMachine.prototype.run_frame = function(frame) {
    var why, operation;

    this.push_frame(frame);
    while (true) {
        operation = this.frame.f_code.co_unpacked_code[this.frame.f_lasti];
        var opname = batavia.modules.dis.opname[operation.opcode];

        // advance f_lasti to next operation. If the operation is a jump, then this
        // pointer will be overwritten during the operation's execution.
        this.frame.f_lasti = operation.next_pos;

        // this.log(operation);

        // When unwinding the block stack, we need to keep track of why we
        // are doing it.
        try {
            why = operation.op_method.apply(this, operation.args);
        } catch (err) {
            // deal with exceptions encountered while executing the op.
            if (err instanceof batavia.builtins.BataviaError) {
                // Batavia errors are a major problem; ABORT HARD
                this.last_exception = null;
                throw err;
            } else if (this.last_exception === null) {
                this.last_exception = {
                    'exc_type': err.constructor,
                    'value': err,
                    'traceback': this.create_traceback()
                };
            }
            why = 'exception';
        }

        if (why === 'exception')  {
            // TODO: ceval calls PyTraceBack_Here, not sure what that does.
        }

        if (why === 'reraise') {
            why = 'exception';
        }

        if (why !== 'yield') {
            while (why && frame.block_stack.length > 0) {
                // Deal with any block management we need to do.
                why = this.manage_block_stack(why);
            }
        }

        if (why) {
            break;
        }
    }

    // TODO: handle generator exception state

    this.pop_frame();

    if (why === 'exception') {
        throw this.last_exception;
    }

    return this.return_value;
};

batavia.VirtualMachine.prototype.byte_LOAD_CONST = function(c) {
    this.push(c);
};

batavia.VirtualMachine.prototype.byte_POP_TOP = function() {
    this.pop();
};

batavia.VirtualMachine.prototype.byte_DUP_TOP = function() {
    this.push(this.top());
};

batavia.VirtualMachine.prototype.byte_DUP_TOPX = function(count) {
    var items = this.popn(count);
    for (var n = 0; n < 2; n++) {
        for (var i = 0; i < count; i++) {
            this.push(items[i]);
        }
    }
};

batavia.VirtualMachine.prototype.byte_DUP_TOP_TWO = function() {
    var items = this.popn(2);
    this.push(items[0]);
    this.push(items[1]);
    this.push(items[0]);
    this.push(items[1]);
};

batavia.VirtualMachine.prototype.byte_ROT_TWO = function() {
    var items = this.popn(2);
    this.push(items[1]);
    this.push(items[0]);
};

batavia.VirtualMachine.prototype.byte_ROT_THREE = function() {
    var items = this.popn(3);
    this.push(items[2]);
    this.push(items[0]);
    this.push(items[1]);
};

batavia.VirtualMachine.prototype.byte_ROT_FOUR = function() {
    var items = this.popn(4);
    this.push(items[3]);
    this.push(items[0]);
    this.push(items[1]);
    this.push(items[2]);
};

batavia.VirtualMachine.prototype.byte_LOAD_NAME = function(name) {
    var frame = this.frame;
    var val;
    if (name in frame.f_locals) {
        val = frame.f_locals[name];
    } else if (name in frame.f_globals) {
        val = frame.f_globals[name];
    } else if (name in frame.f_builtins) {
        val = frame.f_builtins[name];
    } else {
        throw new batavia.builtins.NameError("name '" + name + "' is not defined");
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_STORE_NAME = function(name) {
    this.frame.f_locals[name] = this.pop();
};

batavia.VirtualMachine.prototype.byte_DELETE_NAME = function(name) {
    delete this.frame.f_locals[name];
};

batavia.VirtualMachine.prototype.byte_LOAD_FAST = function(name) {
    var val;
    if (name in this.frame.f_locals) {
        val = this.frame.f_locals[name];
    } else {
        throw new batavia.builtins.NameError("local variable '" + name + "' referenced before assignment");
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_STORE_FAST = function(name) {
    this.frame.f_locals[name] = this.pop();
};

batavia.VirtualMachine.prototype.byte_DELETE_FAST = function(name) {
    delete this.frame.f_locals[name];
};

batavia.VirtualMachine.prototype.byte_STORE_GLOBAL = function(name) {
    this.frame.f_globals[name] = this.pop();
};

batavia.VirtualMachine.prototype.byte_LOAD_GLOBAL = function(name) {
    var val;
    if (name in this.frame.f_globals) {
        val = this.frame.f_globals[name];
    } else if (name in this.frame.f_builtins) {
        val = this.frame.f_builtins[name];
    } else {
        throw new batavia.builtins.NameError("name '" + name + "' is not defined");
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_LOAD_DEREF = function(name) {
    this.push(this.frame.cells[name].get());
};

batavia.VirtualMachine.prototype.byte_STORE_DEREF = function(name) {
    this.frame.cells[name].set(this.pop());
};

batavia.VirtualMachine.prototype.byte_LOAD_LOCALS = function() {
    this.push(this.frame.f_locals);
};

// batavia.VirtualMachine.prototype.sliceOperator = function(op) {
//     start = 0;
//     end = null;          // we will take this to mean end
//     // op, count = op[:-2], int(op[-1]);
//     if count == 1:
//         start = this.pop()
//     elif count == 2:
//         end = this.pop()
//     elif count == 3:
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

batavia.VirtualMachine.prototype.byte_COMPARE_OP = function(opnum) {
    var items = this.popn(2);
    var result;

    // "in" and "not in" operators (opnum 6 and 7) have reversed
    // operand order, so they're handled separately.
    // If the first operand is None, then we need to invoke
    // the comparison method in a different way, because we can't
    // bind the operator methods to the null instance.

    if (opnum === 6) {  // x in None
        if (items[1] === null) {
            result = batavia.types.NoneType.__contains__(items[0]);
        } if (items[1].__contains__) {
            result = items[1].__contains__(items[0]);
        } else {
            result = items[0] in items[1];
        }
    } else if (opnum === 7) {
        if (items[1] === null) {  // x not in None
            result = !batavia.types.NoneType.__contains__(items[0]);
        } else if (items[1].__contains__) {
            result = !items[1].__contains__(items[0]);
        } else {
            result = !(items[0] in items[1]);
        }
    } else if (items[0] === null) {
        switch(opnum) {
            case 0:  // <
                result = batavia.types.NoneType.__lt__(items[1]);
                break;
            case 1:  // <=
                result = batavia.types.NoneType.__le__(items[1]);
                break;
            case 2:  // ==
                result = batavia.types.NoneType.__eq__(items[1]);
                break;
            case 3:  // !=
                result = batavia.types.NoneType.__ne__(items[1]);
                break;
            case 4:  // >
                result = batavia.types.NoneType.__gt__(items[1]);
                break;
            case 5:  // >=
                result = batavia.types.NoneType.__ge__(items[1]);
                break;
            case 8:  // is
                result = items[1] === null;
                break;
            case 9:  // is not
                result = items[1] !== null;
                break;
            case 10:  // exception
                result = items[1] === null;
                break;
            default:
                throw new batavia.builtins.BataviaError('Unknown operator ' + opnum);
        }
    } else {
        switch(opnum) {
            case 0:  // <
                if (items[0].__lt__) {
                    result = items[0].__lt__(items[1]);
                } else {
                    result = items[0] < items[1];
                }
                break;
            case 1:  // <=
                if (items[0].__le__) {
                    result = items[0].__le__(items[1]);
                } else {
                    result = items[0] <= items[1];
                }
                break;
            case 2:  // ==
                if (items[0].__eq__) {
                    result = items[0].__eq__(items[1]);
                } else {
                    result = items[0] == items[1];
                }
                break;
            case 3:  // !=
                if (items[0].__ne__) {
                    result = items[0].__ne__(items[1]);
                } else {
                    result = items[0] != items[1];
                }
                break;
            case 4:  // >
                if (items[0].__gt__) {
                    result = items[0].__gt__(items[1]);
                } else {
                    result = items[0] > items[1];
                }
                break;
            case 5:  // >=
                if (items[0].__ge__) {
                    result = items[0].__ge__(items[1]);
                } else {
                    result = items[0] >= items[1];
                }
                break;
            case 8:  // is
                result = items[0] === items[1];
                break;
            case 9:  // is not
                result = items[0] !== items[1];
                break;
            case 10:  // exception match
                if (items[1] instanceof Array) {
                    result = false;
                    for (var i in items[1]) {
                        if (items[0] === items[1][i]) {
                            result = true;
                            break;
                        }
                    }
                } else {
                    result = items[0] === items[1];
                }
                break;
            default:
                throw new batavia.builtins.BataviaError('Unknown operator ' + opnum);
        }
    }

    this.push(result);
};

batavia.VirtualMachine.prototype.byte_LOAD_ATTR = function(attr) {
    var obj = this.pop();
    var val = obj[attr];
    if (val instanceof batavia.types.Function) {
        // If this is a Python function, we need to know the current
        // context - if it's an attribute of an object (rather than
        // a module) we need to upgrade the Function to a Method.
        if (!(obj instanceof batavia.types.Module)) {
            val = new batavia.types.Method(obj, val);
        }
    } else if (val instanceof Function) {
        // If this is a native Javascript function, wrap the function
        // so that the Python calling convention is used. If it's a
        // class, wrap it in a method that uses the Python calling
        // convention, but instantiates the object rather than just
        // proxying the call.
        if (val.prototype && Object.keys(val.prototype).length > 0) {
            // Python class
            val = function(fn) {
                return function(args, kwargs) {
                    var obj = Object.create(fn.prototype);
                    fn.apply(obj, args);
                    return obj;
                };
            }(val);
        } else {
            // Native javascript method
            val = function(fn) {
                return function(args, kwargs) {
                    return fn.apply(obj, args);
                };
            }(val);
        }
    }
    this.push(val);
};

batavia.VirtualMachine.prototype.byte_STORE_ATTR = function(name) {
    var items = this.popn(2);
    if (items[1].__setattr__ == undefined) {
        items[1][name] = items[0];
    } else {
        items[1].__setattr__(name, items[0]);
    }
};

batavia.VirtualMachine.prototype.byte_DELETE_ATTR = function(name) {
    var obj = this.pop();
    delete obj[name];
};

batavia.VirtualMachine.prototype.byte_STORE_SUBSCR = function() {
    var items = this.popn(3);
    items[1][items[2]] = items[0];
};

batavia.VirtualMachine.prototype.byte_DELETE_SUBSCR = function() {
    var items = this.popn(2);
    delete items[1][items[0]];
};

batavia.VirtualMachine.prototype.byte_BUILD_TUPLE = function(count) {
    var items = this.popn(count);
    this.push(new batavia.types.Tuple(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_LIST = function(count) {
    var items = this.popn(count);
    this.push(new batavia.types.List(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_SET = function(count) {
    var items = this.popn(count);
    this.push(new batavia.types.Set(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_MAP = function(size) {
    switch (batavia.BATAVIA_MAGIC) {
        case batavia.BATAVIA_MAGIC_35:
            var items = this.popn(size * 2);
            var obj = {};

            for (var i = 0; i < items.length; i += 2) {
                obj[items[i]] = items[i + 1];
            }

            this.push(new batavia.types.Dict(obj));

            return;

        case batavia.BATAVIA_MAGIC_34:
            this.push(new batavia.types.Dict());

            return;

        default:
            throw new batavia.builtins.BataviaError(
                "Unsupported BATAVIA_MAGIC. Possibly using unsupported Python versionStrange"
            );
    }
};

batavia.VirtualMachine.prototype.byte_STORE_MAP = function() {
    switch (batavia.BATAVIA_MAGIC) {
        case batavia.BATAVIA_MAGIC_35:
            throw new batavia.builtins.BataviaError(
                "STORE_MAP is unsupported with BATAVIA_MAGIC"
            );

        case batavia.BATAVIA_MAGIC_34:
            var items = this.popn(3);
            items[0][items[2]] = items[1];
            this.push(items[0]);

            return;

        default:
            throw new batavia.builtins.BataviaError(
                "Unsupported BATAVIA_MAGIC. Possibly using unsupported Python versionStrange"
            );
    }
};

batavia.VirtualMachine.prototype.byte_UNPACK_SEQUENCE = function(count) {
    var seq = this.pop();

    // If the sequence item on top of the stack is iterable,
    // expand it into an array.
    if (seq.__iter__) {
        try {
            var iter = seq.__iter__();
            seq = [];
            while (true) {
                seq.push(iter.__next__());
            }
        } catch (err) {}
    }

    for (var i = seq.length; i > 0; i--) {
        this.push(seq[i - 1]);
    }
};

batavia.VirtualMachine.prototype.byte_BUILD_SLICE = function(count) {
    if (count === 2 || count === 3) {
        items = this.popn(count);
        this.push(batavia.builtins.slice(items));
    } else {
        throw new batavia.builtins.BataviaError("Strange BUILD_SLICE count: " + count);
    }
};

batavia.VirtualMachine.prototype.byte_LIST_APPEND = function(count) {
    var val = this.pop();
    var the_list = this.peek(count);
    the_list.push(val);
};

batavia.VirtualMachine.prototype.byte_SET_ADD = function(count) {
    var val = this.pop();
    var the_set = this.peek(count);
    the_set.add(val);
};

batavia.VirtualMachine.prototype.byte_MAP_ADD = function(count) {
    var items = this.popn(2);
    var the_map = this.peek(count);
    the_map[items[1]] = items[0];
};

batavia.VirtualMachine.prototype.byte_PRINT_EXPR = function() {
    batavia.stdout(this.pop());
};

batavia.VirtualMachine.prototype.byte_PRINT_ITEM = function() {
    var item = this.pop();
    this.print_item(item);
};

batavia.VirtualMachine.prototype.byte_PRINT_ITEM_TO = function() {
    var to = this.pop();  // FIXME - this is ignored.
    var item = this.pop();
    this.print_item(item);
};

batavia.VirtualMachine.prototype.byte_PRINT_NEWLINE = function() {
    this.print_newline();
};

batavia.VirtualMachine.prototype.byte_PRINT_NEWLINE_TO = function() {
    var to = this.pop();  // FIXME - this is ignored.
    this.print_newline(to);
};

batavia.VirtualMachine.prototype.print_item = function(item, to) {
    if (to === undefined) {
        // to = sys.stdout;  // FIXME - this is ignored.
    }
    batavia.stdout(item);
};

batavia.VirtualMachine.prototype.print_newline = function(to) {
    if (to === undefined) {
        // to = sys.stdout;  // FIXME - this is ignored.
    }
    batavia.stdout("");
};

batavia.VirtualMachine.prototype.byte_JUMP_FORWARD = function(jump) {
    this.jump(jump);
};

batavia.VirtualMachine.prototype.byte_JUMP_ABSOLUTE = function(jump) {
    this.jump(jump);
};

batavia.VirtualMachine.prototype.byte_POP_JUMP_IF_TRUE = function(jump) {
    var val = this.pop();
    if (val.__bool__()) {
        this.jump(jump);
    }
};

batavia.VirtualMachine.prototype.byte_POP_JUMP_IF_FALSE = function(jump) {
    var val = this.pop();
    if (!val.__bool__()) {
        this.jump(jump);
    }
};

batavia.VirtualMachine.prototype.byte_JUMP_IF_TRUE_OR_POP = function(jump) {
    var val = this.top();
    if (val.__bool__()) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

batavia.VirtualMachine.prototype.byte_JUMP_IF_FALSE_OR_POP = function(jump) {
    var val = this.top();
    if (!val.__bool__()) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

batavia.VirtualMachine.prototype.byte_SETUP_LOOP = function(dest) {
    this.push_block('loop', dest);
};

batavia.VirtualMachine.prototype.byte_GET_ITER = function() {
    this.push(batavia.builtins.iter([this.pop()], null));
};

batavia.VirtualMachine.prototype.byte_FOR_ITER = function(jump) {
    var iterobj = this.top();
    try {
        var v = iterobj.__next__();
        this.push(v);
    } catch (err) {
        if (err instanceof batavia.builtins.StopIteration) {
            this.pop();
            this.jump(jump);
        } else {
            throw err;
        }
    }
};

batavia.VirtualMachine.prototype.byte_BREAK_LOOP = function() {
    return 'break';
};

batavia.VirtualMachine.prototype.byte_CONTINUE_LOOP = function(dest) {
    // This is a trick with the return value.
    // While unrolling blocks, continue and return both have to preserve
    // state as the finally blocks are executed.  For continue, it's
    // where to jump to, for return, it's the value to return.  It gets
    // pushed on the stack for both, so continue puts the jump destination
    // into return_value.
    this.return_value = dest;
    return 'continue';
};

batavia.VirtualMachine.prototype.byte_SETUP_EXCEPT = function(dest) {
    this.push_block('setup-except', dest);
};

batavia.VirtualMachine.prototype.byte_SETUP_FINALLY = function(dest) {
    this.push_block('finally', dest);
};

batavia.VirtualMachine.prototype.byte_END_FINALLY = function() {
    var exc_type = this.pop();
    if (exc_type === null) {
        why = null;
    } else {
        value = this.pop();
        if (value instanceof batavia.builtins.BaseException) {
            traceback = this.pop();
            this.last_exception = {
                'exc_type': exc_type,
                'value': value,
                'traceback': traceback
            };
            why = 'reraise';
        } else {
            throw new batavia.builtins.BataviaError("Confused END_FINALLY");
        }
    }
    return why;
};

batavia.VirtualMachine.prototype.byte_POP_BLOCK = function() {
    this.pop_block();
};

batavia.VirtualMachine.prototype.byte_RAISE_VARARGS = function(argc) {
    var cause, exc;
    if (argc == 2) {
        cause = this.pop();
        exc = this.pop();
    } else if (argc == 1) {
        exc = this.pop();
    }
    return this.do_raise(exc, cause);
};

batavia.VirtualMachine.prototype.do_raise = function(exc, cause) {
    if (exc === undefined) {  // reraise
        if (this.last_exception.exc_type === undefined) {
            return 'exception';      // error
        } else {
            return 'reraise';
        }
    } else if (exc instanceof batavia.builtins.BaseException) {
        // As in `throw ValueError('foo')`
        exc_type = exc.constructor;
        val = exc;
    } else {
        return 'exception';  // error
    }

    // If you reach this point, you're guaranteed that
    // val is a valid exception instance and exc_type is its class.
    // Now do a similar thing for the cause, if present.
    if (cause) {
        // if not isinstance(cause, BaseException):
        //     return 'exception'  // error

        val.__cause__ = cause;
    }

    this.last_exception = {
        'exc_type': exc_type,
        'value': val,
        'traceback': this.create_traceback()
    };
    return 'exception';
};

batavia.VirtualMachine.prototype.byte_POP_EXCEPT = function() {
    var block = this.pop_block();
    if (block.type !== 'except-handler') {
        throw new batavia.exception.BataviaError("popped block is not an except handler");
    }
    this.unwind_block(block);
};

// batavia.VirtualMachine.prototype.byte_SETUP_WITH = function(dest) {
//         ctxmgr = this.pop()
//         this.push(ctxmgr.__exit__)
//         ctxmgr_obj = ctxmgr.__enter__()
//         if PY2:
//             this.push_block('with', dest)
//         elif PY3:
//             this.push_block('finally', dest)
//         this.push(ctxmgr_obj)
// }
// batavia.VirtualMachine.prototype.byte_WITH_CLEANUP = function {
//         // The code here does some weird stack manipulation: the exit function
//         // is buried in the stack, and where depends on what's on top of it.
//         // Pull out the exit function, and leave the rest in place.
//         v = w = null
//         u = this.top()
//         if u is null:
//             exit_func = this.pop(1)
//         elif isinstance(u, str):
//             if u in ('return', 'continue'):
//                 exit_func = this.pop(2)
//             else:
//                 exit_func = this.pop(1)
//             u = null
//         elif issubclass(u, BaseException):
//             if PY2:
//                 w, v, u = this.popn(3)
//                 exit_func = this.pop()
//                 this.push(w, v, u)
//             elif PY3:
//                 w, v, u = this.popn(3)
//                 tp, exc, tb = this.popn(3)
//                 exit_func = this.pop()
//                 this.push(tp, exc, tb)
//                 this.push(null)
//                 this.push(w, v, u)
//                 block = this.pop_block()
//                 assert block.type == 'except-handler'
//                 this.push_block(block.type, block.handler, block.level-1)
//         else:       // pragma: no cover
//             throw "Confused WITH_CLEANUP")
//         exit_ret = exit_func(u, v, w)
//         err = (u is not null) and bool(exit_ret)
//         if err:
//             // An error occurred, and was suppressed
//             if PY2:
//                 this.popn(3)
//                 this.push(null)
//             elif PY3:
//                 this.push('silenced')

//     #// Functions
// }

batavia.VirtualMachine.prototype.byte_MAKE_FUNCTION = function(argc) {
    var name = this.pop();
    var code = this.pop();
    var defaults = this.popn(argc);
    var fn = new batavia.types.Function(name, code, this.frame.f_globals, defaults, null, this);
    this.push(fn);
};

batavia.VirtualMachine.prototype.byte_LOAD_CLOSURE = function(name) {
    this.push(this.frame.cells[name]);
};

batavia.VirtualMachine.prototype.byte_MAKE_CLOSURE = function(argc) {
    var name = this.pop();
    var items = this.popn(2);
    var defaults = this.popn(argc);
    var fn = new batavia.types.Function(name, items[1], this.frame.f_globals, defaults, items[0], this);
    this.push(fn);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION = function(arg) {
    return this.call_function(arg, null, null);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_VAR = function(arg) {
    var args = this.pop();
    return this.call_function(arg, args, null);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_KW = function(arg) {
    var kwargs = this.pop();
    return this.call_function(arg, null, kwargs);
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_VAR_KW = function(arg) {
    var items = this.popn(2);
    return this.call_function(arg, items[0], items[1]);
};

batavia.VirtualMachine.prototype.call_function = function(arg, args, kwargs) {
    //@arg is based on
    //https://docs.python.org/3/library/dis.html#opcode-CALL_FUNCTION
    var lenKw = Math.floor(arg / 256);
    var lenPos = arg % 256;
    var namedargs = new batavia.types.Dict();
    for (var i = 0; i < lenKw; i++) {
        var items = this.popn(2);
        namedargs[items[0]] = items[1];
    }
    if (kwargs) {
        namedargs.update(kwargs);
    }
    var posargs = this.popn(lenPos);
    if (args) {
        posargs = posargs.concat(args);
    }

    var func = this.pop();
    // frame = this.frame
    var retval = batavia.run_callable(this, func, posargs, namedargs);
    this.push(retval);
};

batavia.VirtualMachine.prototype.byte_RETURN_VALUE = function() {
    this.return_value = this.pop();
    if (this.frame.generator) {
        this.frame.generator.finished = true;
    }
    return "return";
};

// batavia.VirtualMachine.prototype.byte_YIELD_VALUE = function {
//         this.return_value = this.pop()
//         return "yield"
// }
// batavia.VirtualMachine.prototype.byte_YIELD_FROM = function {
//         u = this.pop()
//         x = this.top()

//         try:
//             if not isinstance(x, Generator) or u is null:
//                 // Call next on iterators.
//                 retval = next(x)
//             else:
//                 retval = x.send(u)
//             this.return_value = retval
//         except StopIteration as e:
//             this.pop()
//             this.push(e.value)
//         else:
//             // YIELD_FROM decrements f_lasti, so that it will be called
//             // repeatedly until a StopIteration is raised.
//             this.jump(this.frame.f_lasti - 1)
//             // Returning "yield" prevents the block stack cleanup code
//             // from executing, suspending the frame in its current state.
//             return "yield"

//     #// Importing
// }

batavia.VirtualMachine.prototype.byte_IMPORT_NAME = function(name) {
    var items = this.popn(2);
    this.push(
        batavia.builtins.__import__.apply(this, [[name, this.frame.f_globals, null, items[1], items[0]], null])
    );
};

batavia.VirtualMachine.prototype.byte_IMPORT_STAR = function() {
    // TODO: this doesn't use __all__ properly.
    var mod = this.pop();
    if ('__all__' in mod) {
        for (var n = 0; n < mod.__all__.length; n++) {
            var name = mod.__all__[n];
            this.frame.f_locals[name] = mod[name];
        }
    } else {
        for (var attr in mod) {
            if (attr[0] !== '_') {
                this.frame.f_locals[attr] = mod[attr];
            }
        }
    }
};

batavia.VirtualMachine.prototype.byte_IMPORT_FROM = function(name) {
    var mod = this.top();
    this.push(mod[name]);
};

// batavia.VirtualMachine.prototype.byte_EXEC_STMT = function() {
//     stmt, globs, locs = this.popn(3)
//     six.exec_(stmt, globs, locs) f
// };

batavia.VirtualMachine.prototype.byte_LOAD_BUILD_CLASS = function() {
    var make_class = batavia.make_class.bind(this);
    make_class.__python__ = true;
    this.push(make_class);
};

batavia.VirtualMachine.prototype.byte_STORE_LOCALS = function() {
    this.frame.f_locals = this.pop();
};

batavia.VirtualMachine.prototype.byte_SET_LINENO = function(lineno) {
    this.frame.f_lineno = lineno;
};
