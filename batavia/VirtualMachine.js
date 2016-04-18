
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
};

batavia.VirtualMachine.Py_Ellipsis = {};

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
            operator = batavia.operators[operator_name];
            return function() {
                var x = this.pop();
                this.push(operator(x));
            };
        } else if (opcode in batavia.modules.dis.binary_ops) {
            operator_name = opname.slice(7);
            operator = batavia.operators[operator_name];
            return function() {
                var items = this.popn(2);
                this.push(operator(items[0], items[1]));
            };
        } else if (opcode in batavia.modules.dis.inplace_ops) {
            operator_name = opname.slice(8);
            operator = batavia.operators[operator_name];
            return function() {
                var items = this.popn(2);
                this.push(operator(items[0], items[1]));
            };
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
        batavia.modules.sys.argv = new batavia.core.List(['batavia']);
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

        var callargs = new batavia.core.Dict();
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
    exception = exc(message);
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
        f_locals = new batavia.core.Dict();
    } else {
        f_globals = f_locals = new batavia.core.Dict({
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
    this.push(batavia.comparisons[opnum](items[0], items[1]));
};

batavia.VirtualMachine.prototype.byte_LOAD_ATTR = function(attr) {
    var obj = this.pop();
    var val = obj[attr];
    if (val instanceof batavia.core.Function) {
        // If this is a Python function, we need to know the current
        // context - if it's an attribute of an object (rather than
        // a module) we need to upgrade the Function to a Method.
        if (!(obj instanceof batavia.core.Module)) {
            val = new batavia.core.Method(obj, val);
        }
    } else if (val instanceof Function) {
        // If this is a native Javascript function, wrap the function
        // so that the Python calling convention is used.
        var is_class = false;
        for (var a in val.prototype) {
            if (val.prototype.hasOwnProperty(a)) {
                is_class = true;
                break;
            }
        }
        if (is_class) {
            val = function(fn) {
                return function(args, kwargs) {
                    var obj = Object.create(fn.prototype);
                    fn.apply(obj, args);
                    return obj;
                };
            }(val);
        } else {
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
    items[1][name] = items[0];
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
    this.push(new batavia.core.Tuple(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_LIST = function(count) {
    var items = this.popn(count);
    this.push(new batavia.core.List(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_SET = function(count) {
    var items = this.popn(count);
    this.push(new batavia.core.Set(items));
};

batavia.VirtualMachine.prototype.byte_BUILD_MAP = function(size) {
    this.push(new batavia.core.Dict());
};

batavia.VirtualMachine.prototype.byte_STORE_MAP = function() {
    var items = this.popn(3);
    items[0][items[2]] = items[1];
    this.push(items[0]);
};

batavia.VirtualMachine.prototype.byte_UNPACK_SEQUENCE = function(count) {
    var seq = this.pop();
    if (seq.__next__) {
        try {
            while (true) {
                this.push(seq.__next__());
            }
        } catch (err) {}
    } else {
        for (var i = seq.length; i-- ; ) {
            this.push(seq[i]);
        }
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
    if (val) {
        this.jump(jump);
    }
};

batavia.VirtualMachine.prototype.byte_POP_JUMP_IF_FALSE = function(jump) {
    var val = this.pop();
    if (!val) {
        this.jump(jump);
    }
};

batavia.VirtualMachine.prototype.byte_JUMP_IF_TRUE_OR_POP = function(jump) {
    var val = this.top();
    if (val) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

batavia.VirtualMachine.prototype.byte_JUMP_IF_FALSE_OR_POP = function(jump) {
    var val = this.top();
    if (!val) {
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
    var fn = new batavia.core.Function(name, code, this.frame.f_globals, defaults, null, this);
    this.push(fn);
};

batavia.VirtualMachine.prototype.byte_LOAD_CLOSURE = function(name) {
    this.push(this.frame.cells[name]);
};

batavia.VirtualMachine.prototype.byte_MAKE_CLOSURE = function(argc) {
    var name = this.pop();
    var items = this.popn(2);
    var defaults = this.popn(argc);
    var fn = new batavia.core.Function(name, items[1], this.frame.f_globals, defaults, items[0], this);
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
    var lenKw = Math.floor(arg / 256);
    var lenPos = arg % 256;
    var namedargs = new batavia.core.Dict();
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
    if ('__self__' in func && '__python__' in func) {
        // A python-style method
        // Methods calls get self as an implicit first parameter.
        if (func.__self__) {
            posargs.unshift(func.__self__);
        }
        // The first parameter must be the correct type.
        if (posargs[0] instanceof func.constructor) {
            throw 'unbound method ' + func.__func__.__name__ + '()' +
                ' must be called with ' + func.__class__.__name__ + ' instance ' +
                'as first argument (got ' + posargs[0].prototype + ' instance instead)';
        }
        func = func.__func__.__call__;
    } else if ('__call__' in func) {
        // A Python callable
        func = func.__call__;
    } else if (func.prototype) {
        var is_class = false;
        for (var attr in func.prototype) {
            if (func.prototype.hasOwnProperty(attr)) {
                is_class = true;
                break;
            }
        }
        if (is_class) {
            func = function(fn) {
                return function(args, kwargs) {
                    var obj = Object.create(fn.prototype);
                    fn.apply(obj, args);
                    return obj;
                };
            }(func);
        }
    }

    var retval = func.apply(this, [posargs, namedargs]);

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
        batavia.builtins.__import__.apply(this, [[name, this.frame.f_globals, null, items[1], items[0]]])
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
