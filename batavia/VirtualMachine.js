
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
                    throw new batavia.core.BataviaError("Unknown opcode " + opcode + " (" + opname + ")");
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
    args = args || [];
    var payload = this.loader(tag);
    var bytecode = atob(payload);
    var code = batavia.modules.marshal.load_pyc(this, bytecode);

    // Set up sys.argv
    batavia.modules.sys.argv = ['batavia'];
    batavia.modules.sys.argv.extend(args);

    // Run the code
    return this.run_code({'code': code});
};

/*
 * An entry point for invoking functions.
 *
 * Accepts a DOM id for an element containing base64 encoded bytecode.
 */
batavia.VirtualMachine.prototype.run_method = function(tag, args, kwargs, f_locals, f_globals) {
    kwargs = kwargs || new batavia.core.Dict();
    args = args || [];
    var payload = this.loader(tag);
    var bytecode = atob(payload);
    var code = batavia.modules.marshal.load_pyc(this, bytecode);

    var callargs = new batavia.core.Dict();
    for (var i = 0; i < args.length; i++) {
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
};

/*
 */
batavia.VirtualMachine.prototype.PyErr_Occurred = function() {
    return this.last_exception !== null;
};

batavia.VirtualMachine.prototype.PyErr_SetString = function(exc, message) {
    console.log("SET EXCEPTION", exc, message);
    this.last_exception = {
        'exception': exc,
        'message': message
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

// batavia.VirtualMachine.prototype.print_frames = function {
//         """Print the call stack, for debugging."""
//         for f in this.frames:
//             filename = f.f_code.co_filename
//             lineno = f.line_number()
//             print('  File "%s", line %d, in %s' % (
//                 filename, lineno, f.f_code.co_name
//             ))
//             linecache.checkcache(filename)
//             line = linecache.getline(filename, lineno, f.f_globals)
//             if line:
//                 print('    ' + line.strip())
// }
// batavia.VirtualMachine.prototype.resume_frame = function(frame) {
//         frame.f_back = this.frame
//         val = this.run_frame(frame)
//         frame.f_back = null
//         return val
// }

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
    var val = this.run_frame(frame);

    // Check some invariants
    if (this.frames.length > 0) {
        throw new batavia.core.BataviaError("Frames left over!");
    }
    if (this.frame && this.frame.stack.length > 0) {
        throw new batavia.core.BataviaError("Data left on stack! " + this.frame.stack);
    }
    return val;
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
            exctype: exc[2],
            value: exc[1],
            tb: exc[0]
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
    this.frame.f_lasti += 1;
    if (operation.opcode >= batavia.modules.dis.HAVE_ARGUMENT) {
        var arg = this.frame.f_code.co_code.slice(this.frame.f_lasti, this.frame.f_lasti + 2);
        this.frame.f_lasti += 2;
        var intArg = arg[0] + (arg[1] << 8);
        if (operation.opcode in batavia.modules.dis.hasconst) {
            operation.args = [this.frame.f_code.co_consts[intArg]];
        } else if (operation.opcode in batavia.modules.dis.hasfree) {
            if (intArg < this.frame.f_code.co_cellvars.length) {
                operation.args = [this.frame.f_code.co_cellvars[intArg]];
            } else {
                var_idx = intArg - this.frame.f_code.co_cellvars.length;
                operation.args = [this.frame.f_code.co_freevars[var_idx]];
            }
        } else if (operation.opcode in batavia.modules.dis.hasname) {
            operation.args = [this.frame.f_code.co_names[intArg]];
        } else if (operation.opcode in batavia.modules.dis.hasjrel) {
            operation.args = [this.frame.f_lasti + intArg];
        } else if (operation.opcode in batavia.modules.dis.hasjabs) {
            operation.args = [intArg];
        } else if (operation.opcode in batavia.modules.dis.haslocal) {
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
 * Dispatch by bytename to the corresponding methods.
 * Exceptions are caught and set on the virtual machine.
 */
batavia.VirtualMachine.prototype.dispatch = function(opcode, args) {
    var why = null;
    try {
        why = this.dispatch_table[opcode].apply(this, args);
    } catch (err) {
        // deal with exceptions encountered while executing the op.
        this.last_exception = {
            'exception': err,
            'message': err.toString()
        };
        why = 'exception';
    }
    return why;
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
        exc = this.last_exception;
        this.push(exc[2]);
        this.push(exc[1]);
        this.push(exc[0]);
        // PyErr_Normalize_Exception goes here
        this.push(exc[2]);
        this.push(exc[1]);
        this.push(exc[0]);
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
        operation = this.parse_byte_and_args();
        // this.log(operation);

        // When unwinding the block stack, we need to keep track of why we
        // are doing it.
        why = this.dispatch(operation.opcode, operation.args);
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
        throw this.last_exception.exception;
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
        throw new batavia.builtins.NameError("Global name '" + name + "' is not defined");
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
        if (!(obj instanceof batavia.core.Module)) {
            val = new batavia.core.Method(obj, val);
        }
    } else if (val instanceof Function) {
        val = function(fn) {
            return function(args, kwargs) {
                return fn.apply(obj, args);
            };
        }(val);
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
    this.push(items);
};

batavia.VirtualMachine.prototype.byte_BUILD_LIST = function(count) {
    var items = this.popn(count);
    this.push(items);
};

batavia.VirtualMachine.prototype.byte_BUILD_SET = function(count) {
    // TODO: Not documented in Py2 docs.
    var retval = new batavia.core.Set(this.popn(count));
    this.push(retval);
};

batavia.VirtualMachine.prototype.byte_BUILD_MAP = function(size) {
    switch (batavia.BATAVIA_MAGIC) {
        case batavia.BATAVIA_MAGIC_35:
            var items = this.popn(size * 2);
            var obj = {};

            for (var i = 0; i < items.length; i += 2) {
                obj[items[i]] = items[i + 1];
            }

            this.push(new batavia.core.Dict(obj));

            return;

        case batavia.BATAVIA_MAGIC_34:
            this.push(new batavia.core.Dict());

            return;

        default:
            throw new batavia.core.BataviaError(
                "Unsupported BATAVIA_MAGIC. Possibly using unsupported Python versionStrange"
            );
    }
};

batavia.VirtualMachine.prototype.byte_STORE_MAP = function() {
    switch (batavia.BATAVIA_MAGIC) {
        case batavia.BATAVIA_MAGIC_35:
            throw new batavia.core.BataviaError(
                "STORE_MAP is unsupported with BATAVIA_MAGIC"
            );

        case batavia.BATAVIA_MAGIC_34:
            var items = this.popn(3);
            items[0][items[2]] = items[1];
            this.push(items[0]);

            return;

        default:
            throw new batavia.core.BataviaError(
                "Unsupported BATAVIA_MAGIC. Possibly using unsupported Python versionStrange"
            );
    }
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
        seq.reverse();
        for (var i=0; i < seq.length; i++) {
            this.push(seq[i]);
        }
    }
};

batavia.VirtualMachine.prototype.byte_BUILD_SLICE = function(count) {
    if (count === 2 || count === 3) {
        items = this.popn(count);
        this.push(batavia.builtins.slice(items));
    } else {
        throw new batavia.core.BataviaError("Strange BUILD_SLICE count: " + count);
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
    this.push(iter(this.pop()));
};

batavia.VirtualMachine.prototype.byte_FOR_ITER = function(jump) {
    var iterobj = this.top();
    try {
        var v = next(iterobj);
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

// batavia.VirtualMachine.prototype.byte_END_FINALLY = function() {
//     var v = this.pop();
//     if isinstance(v, str):
//         why = v
//         if why in ('return', 'continue'):
//             this.return_value = this.pop()
//         if why == 'silenced':       // PY3
//             block = this.pop_block()
//             assert block.type == 'except-handler'
//             this.unwind_block(block)
//             why = null
//     elif v is null:
//         why = null
//     elif issubclass(v, BaseException):
//         exctype = v
//         val = this.pop()
//         tb = this.pop()
//         this.last_exception = (exctype, val, tb)
//         why = 'reraise'
//     else:       // pragma: no cover
//         throw "Confused END_FINALLY")
//     return why
// }

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

//     batavia.VirtualMachine.prototype.do_throw = function(exc, cause) {
//             if exc is null:         // reraise
//                 exc_type, val, tb = this.last_exception
//                 if exc_type is null:
//                     return 'exception'      // error
//                 else:
//                     return 'reraise'

//             elif type(exc) == type:
//                 // As in `throw ValueError`
//                 exc_type = exc
//                 val = exc()             // Make an instance.
//             elif isinstance(exc, BaseException):
//                 // As in `throw ValueError('foo')`
//                 exc_type = type(exc)
//                 val = exc
//             else:
//                 return 'exception'      // error

//             // If you reach this point, you're guaranteed that
//             // val is a valid exception instance and exc_type is its class.
//             // Now do a similar thing for the cause, if present.
//             if cause:
//                 if type(cause) == type:
//                     cause = cause()
//                 elif not isinstance(cause, BaseException):
//                     return 'exception'  // error

//                 val.__cause__ = cause

//             this.last_exception = exc_type, val, val.__traceback__
//             return 'exception'
// }
// batavia.VirtualMachine.prototype.byte_POP_EXCEPT = function {
//         block = this.pop_block()
//         if block.type != 'except-handler':
//             throw Exception("popped block is not an except handler")
//         this.unwind_block(block)
// }
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
    return this.call_function(arg, [], new batavia.core.Dict());
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_VAR = function(arg) {
    var args = this.pop();
    return this.call_function(arg, args, new batavia.core.Dict());
};

batavia.VirtualMachine.prototype.byte_CALL_FUNCTION_KW = function(arg) {
    var kwargs = this.pop();
    return this.call_function(arg, [], kwargs);
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
    namedargs.update(kwargs);
    var posargs = this.popn(lenPos);
    posargs = posargs.concat(args);

    var func = this.pop();
    // frame = this.frame
    if ('__self__' in func && '__python__' in func) {
        // Methods get self as an implicit first parameter.
        if (func.__self__) {
            posargs.unshift(func.__self__);
        }
        // FIXME: Work out how to do the class check.
        // The first parameter must be the correct type.
        // if (posargs[0] instanceof func.__class__) {
        //     throw 'unbound method ' + func.__func__.__name__ + '()' +
        //         ' must be called with ' + func.__class__.__name__ + ' instance ' +
        //         'as first argument (got ' + posargs[0].__proto__ + ' instance instead)';
        // }
        func = func.__func__.__call__;
    } else if ('__call__' in func) {
        func = func.__call__;
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
        batavia.builtins.__import__.apply(this, [[name, this.frame.f_globals, this.frame.f_locals, items[1], items[0]]])
    );
};

batavia.VirtualMachine.prototype.byte_IMPORT_STAR = function() {
    // TODO: this doesn't use __all__ properly.
    var mod = this.pop();
    for (var attr in mod) {
        if (attr[0] !== '_') {
            this.frame.f_locals[attr] = mod[attr];
        }
    }
};

batavia.VirtualMachine.prototype.byte_IMPORT_FROM = function(name) {
    mod = this.top();
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
