
/*************************************************************************
 * Virtual Machine
 *************************************************************************/

// from .pyobj import Frame, Block, Function, Generator
var log = new Logger();


function VirtualMachine() {
    // The call stack of frames.
    this.frames = [];

    // The current frame.
    this.frame = null;
    this.return_value = null;
    this.last_exception = null;
}

VirtualMachine.Py_Ellipsis = {};

VirtualMachine.builtins = {
    ArithmeticError: undefined,
    AssertionError: undefined,
    AttributeError: undefined,
    BaseException: undefined,
    BufferError: undefined,
    BytesWarning: undefined,
    DeprecationWarning: undefined,
    EOFError: undefined,
    Ellipsis: undefined,
    EnvironmentError: undefined,
    Exception: undefined,
    False: undefined,
    FloatingPointError: undefined,
    FutureWarning: undefined,
    GeneratorExit: undefined,
    IOError: undefined,
    ImportError: undefined,
    ImportWarning: undefined,
    IndentationError: undefined,
    IndexError: undefined,
    KeyError: undefined,
    KeyboardInterrupt: undefined,
    LookupError: undefined,
    MemoryError: undefined,
    NameError: undefined,
    None: undefined,
    NotImplemented: undefined,
    NotImplementedError: undefined,
    OSError: undefined,
    OverflowError: undefined,
    PendingDeprecationWarning: undefined,
    ReferenceError: undefined,
    RuntimeError: undefined,
    RuntimeWarning: undefined,
    StandardError: undefined,
    StopIteration: undefined,
    SyntaxError: undefined,
    SyntaxWarning: undefined,
    SystemError: undefined,
    SystemExit: undefined,
    TabError: undefined,
    True: undefined,
    TypeError: undefined,
    UnboundLocalError: undefined,
    UnicodeDecodeError: undefined,
    UnicodeEncodeError: undefined,
    UnicodeError: undefined,
    UnicodeTranslateError: undefined,
    UnicodeWarning: undefined,
    UserWarning: undefined,
    ValueError: undefined,
    Warning: undefined,
    ZeroDivisionError: undefined,

    __debug__: undefined,
    __doc__: undefined,
    __import__: undefined,
    __name__: undefined,
    __package__: undefined,

    abs: function() { throw "builtin function 'abs' not implemented"; },
    all: function() { throw "builtin function 'all' not implemented"; },
    any: function() { throw "builtin function 'any' not implemented"; },
    apply: function() { throw "builtin function 'apply' not implemented"; },
    basestring: function() { throw "builtin function 'basestring' not implemented"; },
    bin: function() { throw "builtin function 'bin' not implemented"; },
    bool: function() { throw "builtin function 'bool' not implemented"; },
    buffer: function() { throw "builtin function 'buffer' not implemented"; },
    bytearray: function() { throw "builtin function 'bytearray' not implemented"; },
    bytes: function() { throw "builtin function 'bytes' not implemented"; },
    callable: function() { throw "builtin function 'callable' not implemented"; },
    chr: function() { throw "builtin function 'chr' not implemented"; },
    classmethod: function() { throw "builtin function 'classmethod' not implemented"; },
    cmp: function() { throw "builtin function 'cmp' not implemented"; },
    coerce: function() { throw "builtin function 'coerce' not implemented"; },
    compile: function() { throw "builtin function 'compile' not implemented"; },
    complex: function() { throw "builtin function 'complex' not implemented"; },
    copyright: function() { throw "builtin function 'copyright' not implemented"; },
    credits: function() { throw "builtin function 'credits' not implemented"; },
    delattr: function() { throw "builtin function 'delattr' not implemented"; },
    dict: function() { throw "builtin function 'dict' not implemented"; },
    dir: function() { throw "builtin function 'dir' not implemented"; },
    divmod: function() { throw "builtin function 'divmod' not implemented"; },
    enumerate: function() { throw "builtin function 'enumerate' not implemented"; },
    eval: function() { throw "builtin function 'eval' not implemented"; },
    execfile: function() { throw "builtin function 'execfile' not implemented"; },
    exit: function() { throw "builtin function 'exit' not implemented"; },
    file: function() { throw "builtin function 'file' not implemented"; },
    filter: function() { throw "builtin function 'filter' not implemented"; },
    float: function() { throw "builtin function 'float' not implemented"; },
    format: function() { throw "builtin function 'format' not implemented"; },
    frozenset: function() { throw "builtin function 'frozenset' not implemented"; },
    getattr: function() { throw "builtin function 'getattr' not implemented"; },
    globals: function() { throw "builtin function 'globals' not implemented"; },
    hasattr: function() { throw "builtin function 'hasattr' not implemented"; },
    hash: function() { throw "builtin function 'hash' not implemented"; },
    help: function() { throw "builtin function 'help' not implemented"; },
    hex: function() { throw "builtin function 'hex' not implemented"; },
    id: function() { throw "builtin function 'id' not implemented"; },
    input: function() { throw "builtin function 'input' not implemented"; },
    int: function() { throw "builtin function 'int' not implemented"; },
    intern: function() { throw "builtin function 'intern' not implemented"; },
    isinstance: function() { throw "builtin function 'isinstance' not implemented"; },
    issubclass: function() { throw "builtin function 'issubclass' not implemented"; },
    iter: function() { throw "builtin function 'iter' not implemented"; },
    len: function(args, kwargs) {
        return args[0].length;
    },
    license: function() { throw "builtin function 'license' not implemented"; },
    list: function() { throw "builtin function 'list' not implemented"; },
    locals: function() { throw "builtin function 'locals' not implemented"; },
    long: function() { throw "builtin function 'long' not implemented"; },
    map: function(args, kwargs) {
        // FIXME
        args[0].call(this, [args[1]], {});
    },
    max: function() { throw "builtin function 'max' not implemented"; },
    memoryview: function() { throw "builtin function 'memoryview' not implemented"; },
    min: function() { throw "builtin function 'min' not implemented"; },
    next: function() { throw "builtin function 'next' not implemented"; },
    object: function() { throw "builtin function 'object' not implemented"; },
    oct: function() { throw "builtin function 'oct' not implemented"; },
    open: function() { throw "builtin function 'open' not implemented"; },
    ord: function() { throw "builtin function 'ord' not implemented"; },
    pow: function() { throw "builtin function 'pow' not implemented"; },
    print: function() { throw "builtin function 'print' not implemented"; },
    property: function() { throw "builtin function 'property' not implemented"; },
    quit: function() { throw "builtin function 'quit' not implemented"; },
    range: function(args, kwargs) {
        var start = 0;
        var stop;
        var step = 1;
        if (args.length === 1) {
            stop = args[0];
        } else if (args.length === 2) {
            start = args[0];
            stop = args[1];
        } else if (args.lenth === 3) {
            start = args[0];
            stop = args[1];
            stop = args[3];
        }

        var retval = [];
        for (i = start; i < stop; i += step) {
            retval.push(i);
        }
        return retval;
    },
    raw_input: function() { throw "builtin function 'raw_input' not implemented"; },
    reduce: function() { throw "builtin function 'reduce' not implemented"; },
    reload: function() { throw "builtin function 'reload' not implemented"; },
    repr: function() { throw "builtin function 'repr' not implemented"; },
    reversed: function() { throw "builtin function 'reversed' not implemented"; },
    round: function() { throw "builtin function 'round' not implemented"; },
    set: function() { throw "builtin function 'set' not implemented"; },
    setattr: function() { throw "builtin function 'setattr' not implemented"; },
    slice: function() { throw "builtin function 'slice' not implemented"; },
    sorted: function() { throw "builtin function 'sorted' not implemented"; },
    staticmethod: function() { throw "builtin function 'staticmethod' not implemented"; },
    str: function() { throw "builtin function 'str' not implemented"; },
    sum: function() { throw "builtin function 'sum' not implemented"; },
    super: function() { throw "builtin function 'super' not implemented"; },
    tuple: function() { throw "builtin function 'tuple' not implemented"; },
    type: function() { throw "builtin function 'type' not implemented"; },
    unichr: function() { throw "builtin function 'unichr' not implemented"; },
    unicode: function() { throw "builtin function 'unicode' not implemented"; },
    vars: function() { throw "builtin function 'vars' not implemented"; },
    xrange: function() { throw "builtin function 'xrange' not implemented"; },
    zip: function() { throw "builtin function 'zip' not implemented"; },
};

/*
 * The main entry point.
 *
 * Accepts a DOM id for an element containing base64 encoded bytecode.
 */
VirtualMachine.prototype.run = function(tag) {
    var payload = document.getElementById('batavia-' + tag).text.replace(/(\r\n|\n|\r)/gm, "").trim();
    var bytecode = atob(payload);
    var code = Marshal.load_pyc(this, bytecode);
    this.run_code({'code': code});
};

/*
 */
VirtualMachine.prototype.PyErr_Occurred = function() {
    return this.last_exception !== null;
};

VirtualMachine.prototype.PyErr_SetString = function(exc, message) {
    console.log("SET EXCEPTION", exc, message);
    this.last_exception = {
        'exception': exc,
        'message': message
    };
};

/*
 * Return the value at the top of the stack, with no changes.
 */
VirtualMachine.prototype.top = function() {
    return this.frame.stack[this.frame.stack.length - 1];
};

/*
 * Pop a value from the stack.
 *
 * Default to the top of the stack, but `i` can be a count from the top
 * instead.
 */
VirtualMachine.prototype.pop = function(i) {
    if (i === undefined) {
        i = 0;
    }
    return this.frame.stack.splice(this.frame.stack.length - 1 - i, 1)[0];
};

/*
 * Push value onto the value stack.
 */
VirtualMachine.prototype.push = function(val) {
    this.frame.stack.append(val);
};

/*
 * Pop a number of values from the value stack.
 *
 * A list of `n` values is returned, the deepest value first.
*/
VirtualMachine.prototype.popn = function(n) {
    if (n) {
        return this.frame.stack.splice(this.frame.stack.length - n, n);
    } else {
        return [];
    }
};

/*
 * Get a value `n` entries down in the stack, without changing the stack.
 */
VirtualMachine.prototype.peek = function(n) {

    return this.frame.stack[this.frame.stack.length - n - 1];
};

/*
 * Move the bytecode pointer to `jump`, so it will execute next.
 */
VirtualMachine.prototype.jump = function(jump) {
    this.frame.f_lasti = jump;
};

VirtualMachine.prototype.push_block = function(type, handler, level) {
    if (level === null) {
        level = this.frame.stack.length;
    }
    this.frame.block_stack.append(new Block(type, handler, level));
};

VirtualMachine.prototype.pop_block = function() {
    return this.frame.block_stack.pop();
};

VirtualMachine.prototype.make_frame = function(kwargs) {
    var code = kwargs.code;
    var callargs = kwargs.callargs || {};
    var f_globals = kwargs.f_globals || null;
    var f_locals = kwargs.f_locals || null;

    log.info("make_frame: code=" + code + ", callargs=" + callargs);

    if (f_globals !==  null) {
        if (f_locals !== null) {
            f_locals = f_globals;
        }
    } else if (this.frames.length > 0) {
        f_globals = this.frame.f_globals;
        f_locals = {};
    } else {
        f_globals = f_locals = {
            '__builtins__': VirtualMachine.builtins,
            '__name__': '__main__',
            '__doc__': null,
            '__package__': null,
        };
    }
    f_locals.update(callargs);

    frame = new Frame({
        'f_code': code,
        'f_globals': f_globals,
        'f_locals': f_locals,
        'f_back': this.frame
    });
    return frame;
};

VirtualMachine.prototype.push_frame = function(frame) {
    this.frames.append(frame);
    this.frame = frame;
};

VirtualMachine.prototype.pop_frame = function() {
    this.frames.pop();
    if (this.frames) {
        this.frame = this.frames[this.frames.length - 1];
    } else {
        this.frame = null;
    }
};

// VirtualMachine.prototype.print_frames = function {
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
// VirtualMachine.prototype.resume_frame = function(frame) {
//         frame.f_back = this.frame
//         val = this.run_frame(frame)
//         frame.f_back = null
//         return val
// }

VirtualMachine.prototype.run_code = function(kwargs) {
    var code = kwargs.code;
    var f_globals = kwargs.f_globals || null;
    var f_locals = kwargs.f_locals || null;
    var frame = this.make_frame({'code': code, 'f_globals': f_globals, 'f_locals': f_locals});
    var val = this.run_frame(frame);

    // Check some invariants
    if (this.frames.length > 0) {
        throw "Frames left over!";
    }
    if (this.frame && this.frame.stack.length > 0) {
        throw "Data left on stack! " + this.frame.stack;
    }
    return val;
};

// VirtualMachine.prototype.unwind_block = function(block) {
//         if block.type == 'except-handler':
//             offset = 3
//         else:
//             offset = 0

//         while len(this.frame.stack) > block.level + offset:
//             this.pop()

//         if block.type == 'except-handler':
//             tb, value, exctype = this.popn(3)
//             this.last_exception = exctype, value, tb
// }

/*
 * Parse 1 - 3 bytes of bytecode into
 * an instruction and optionally arguments.
 */
VirtualMachine.prototype.parse_byte_and_args = function() {
    var operation = {
        'opoffset': this.frame.f_lasti,
        'opcode': this.frame.f_code.co_code[this.frame.f_lasti],
        'args': []
    };
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
VirtualMachine.prototype.log = function(opcode) {
    var op = opcode.opoffset + ': ' + opcode.byteName;
    for (var arg in opcode.args) {
        op += ' ' + opcode.args[arg];
    }
    var indent = "    " * (this.frames.length - 1);

    log.info("  " + indent + "data: " + this.frame.stack);
    log.info("  " + indent + "blks: " + this.frame.block_stack);
    log.info(indent + op);
};

/*
 * Dispatch by bytename to the corresponding methods.
 * Exceptions are caught and set on the virtual machine.
 */
VirtualMachine.prototype.dispatch = function(opcode, args) {
    var why = null;
    try {
        console.log('OPCODE: ', dis.opname[operation.opcode], args);
        if (opcode in dis.unary_ops) {
            this.unaryOperator(dis.opname[opcode].slice(6));
        } else if (opcode in dis.binary_ops) {
            this.binaryOperator(dis.opname[opcode].slice(7));
        } else if (opcode in dis.inplace_ops) {
            this.inplaceOperator(dis.opname[opcode].slice(8));
        } else if (opcode in dis.slice_ops) {
            this.sliceOperator(dis.opname[opcode]);
        } else {
            // dispatch
            var bytecode_fn = this['byte_' + dis.opname[opcode]];
            if (!bytecode_fn) {
                throw "unknown opcode " + opcode + " (" + dis.opname[opcode] + ")";
            }
            why = bytecode_fn.apply(this, args);
        }
    } catch(err) {
        // deal with exceptions encountered while executing the op.
        //FIXME this.last_exception = sys.exc_info()[:2] + (null,);
        log.error("Caught exception during execution: " + err);
        why = 'exception';
    }
    return why;
};

// VirtualMachine.prototype.manage_block_stack = function(why) {
//         """ Manage a frame's block stack.
//         Manipulate the block stack and data stack for looping,
//         exception handling, or returning."""
//         assert why != 'yield'

//         block = this.frame.block_stack[-1]
//         if block.type == 'loop' and why == 'continue':
//             this.jump(this.return_value)
//             why = null
//             return why

//         this.pop_block()
//         this.unwind_block(block)

//         if block.type == 'loop' and why == 'break':
//             why = null
//             this.jump(block.handler)
//             return why

//         if PY2:
//             if (
//                 block.type == 'finally' or
//                 (block.type == 'setup-except' and why == 'exception') or
//                 block.type == 'with'
//             ):
//                 if why == 'exception':
//                     exctype, value, tb = this.last_exception
//                     this.push(tb, value, exctype)
//                 else:
//                     if why in ('return', 'continue'):
//                         this.push(this.return_value)
//                     this.push(why)

//                 why = null
//                 this.jump(block.handler)
//                 return why

//         elif PY3:
//             if (
//                 why == 'exception' and
//                 block.type in ['setup-except', 'finally']
//             ):
//                 this.push_block('except-handler')
//                 exctype, value, tb = this.last_exception
//                 this.push(tb, value, exctype)
//                 // PyErr_Normalize_Exception goes here
//                 this.push(tb, value, exctype)
//                 why = null
//                 this.jump(block.handler)
//                 return why

//             elif block.type == 'finally':
//                 if why in ('return', 'continue'):
//                     this.push(this.return_value)
//                 this.push(why)

//                 why = null
//                 this.jump(block.handler)
//                 return why

//         return why
// }
/*
 * Run a frame until it returns (somehow).
 *
 * Exceptions are raised, the return value is returned.
 *
 */
VirtualMachine.prototype.run_frame = function(frame) {
    var why;

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
        throw this.last_exception;
    }

    return this.return_value;
};

VirtualMachine.prototype.byte_LOAD_CONST = function(c) {
    this.push(c);
};

VirtualMachine.prototype.byte_POP_TOP = function() {
    this.pop();
};

VirtualMachine.prototype.byte_DUP_TOP = function() {
    this.push(this.top());
};

VirtualMachine.prototype.byte_DUP_TOPX = function(count) {
    items = this.popn(count);
    for (var n = 0; n < 2; n++) {
        for (var i = 0; i < count; i++) {
            this.push(items[i]);
        }
    }
};

VirtualMachine.prototype.byte_DUP_TOP_TWO = function() {
    items = this.popn(2);
    this.push(items[0]);
    this.push(items[1]);
    this.push(items[0]);
    this.push(items[1]);
};

VirtualMachine.prototype.byte_ROT_TWO = function() {
    items = this.popn(2);
    this.push(items[1]);
    this.push(items[0]);
};

VirtualMachine.prototype.byte_ROT_THREE = function() {
    items = this.popn(3);
    this.push(items[2]);
    this.push(items[0]);
    this.push(items[1]);
};

VirtualMachine.prototype.byte_ROT_FOUR = function() {
    items = this.popn(4);
    this.push(items[3]);
    this.push(items[0]);
    this.push(items[1]);
    this.push(items[2]);
};

VirtualMachine.prototype.byte_LOAD_NAME = function(name) {
    frame = this.frame;
    if (name in frame.f_locals) {
        val = frame.f_locals[name];
    } else if (name in frame.f_globals) {
        val = frame.f_globals[name];
    } else if (name in frame.f_builtins) {
        val = frame.f_builtins[name];
    } else {
        throw "Name '" + name + "' is not defined";
    }
    this.push(val);
};

VirtualMachine.prototype.byte_STORE_NAME = function(name) {
    this.frame.f_locals[name] = this.pop();
};

VirtualMachine.prototype.byte_DELETE_NAME = function(name) {
    delete this.frame.f_locals[name];
};

VirtualMachine.prototype.byte_LOAD_FAST = function(name) {
    if (name in this.frame.f_locals) {
        val = this.frame.f_locals[name];
    } else {
        throw "Local variable '" + name + "' referenced before assignment";
    }
    this.push(val);
};

VirtualMachine.prototype.byte_STORE_FAST = function(name) {
    this.frame.f_locals[name] = this.pop();
};

VirtualMachine.prototype.byte_DELETE_FAST = function(name) {
    delete this.frame.f_locals[name];
};

VirtualMachine.prototype.byte_STORE_GLOBAL = function(name) {
    this.frame.f_globals[name] = this.pop();
};

VirtualMachine.prototype.byte_LOAD_GLOBAL = function(name) {
    f = this.frame;
    if (name in f.f_globals) {
        val = f.f_globals[name];
    } else if (name in f.f_builtins) {
        val = f.f_builtins[name];
    } else {
        throw "Global name '" + name + "' is not defined";
    }
    this.push(val);
};

VirtualMachine.prototype.byte_LOAD_DEREF = function(name) {
    this.push(this.frame.cells[name].get());
};

VirtualMachine.prototype.byte_STORE_DEREF = function(name) {
    this.frame.cells[name].set(this.pop());
};

VirtualMachine.prototype.byte_LOAD_LOCALS = function() {
    this.push(this.frame.f_locals);
};

VirtualMachine.prototype.unaryOperator = function(op) {
    x = this.pop();
    this.push({
        'POSITIVE': +x,
        'NEGATIVE': -x,
        'NOT': !x,
        // 'CONVERT': !x,
        // 'INVERT': !x,
    }[op]);
};

VirtualMachine.prototype.binaryOperator = function(op) {
    items = this.popn(2);
    this.push({
        'POWER':    Math.pow(items[0], items[1]),
        'MULTIPLY': items[0] * items[1],
        'DIVIDE':   items[0] / items[1],
        'FLOOR_DIVIDE': Math.floor(items[0] / items[1]),
        'TRUE_DIVIDE':  items[0] / items[1],
        'MODULO':   items[0] % items[1],
        'ADD':      items[0] + items[1],
        'SUBTRACT': items[0] - items[1],
        'SUBSCR':   items[0][items[1]],
        'LSHIFT':   items[0] << items[1],
        'RSHIFT':   items[0] >> items[1],
        'AND':      items[0] & items[1],
        'XOR':      items[0] ^ items[1],
        'OR':       items[0] | items[1],
    }[op]);
};

VirtualMachine.prototype.inplaceOperator = function(op) {
    items = this.popn(2);
    if (op == 'POWER') {
        items[0] = Math.pow(items[0], items[1]);
    } else if (op === 'MULTIPLY') {
        items[0] *= items[1];
    } else if (op === 'DIVIDE' || op === 'FLOOR_DIVIDE') {
        items[0] /= items[1];
    } else if (op == 'TRUE_DIVIDE') {
        items[0] /= items[1];
    } else if (op == 'MODULO') {
        items[0] %= items[1];
    } else if (op == 'ADD') {
        items[0] += items[1];
    } else if (op == 'SUBTRACT') {
        items[0] -= items[1];
    } else if (op == 'LSHIFT') {
        items[0] <<= items[1];
    } else if (op == 'RSHIFT') {
        items[0] >>= items[1];
    } else if (op == 'AND') {
        items[0] &= items[1];
    } else if (op == 'XOR') {
        items[0] ^= items[1];
    } else if (op == 'OR') {
        items[0] |= items[1];
    } else {
        throw "Unknown in-place operator: " + op;
    }
    this.push(items[0]);
};

// VirtualMachine.prototype.sliceOperator = function(op) {
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

//     COMPARE_OPERATORS = [
//         operator.lt,
//         operator.le,
//         operator.eq,
//         operator.ne,
//         operator.gt,
//         operator.ge,
//         lambda x, y: x in y,
//         lambda x, y: x not in y,
//         lambda x, y: x is y,
//         lambda x, y: x is not y,
//         lambda x, y: issubclass(x, Exception) and issubclass(x, y),
//     ]
// }
// VirtualMachine.prototype.byte_COMPARE_OP = function(opnum) {
//         x, y = this.popn(2)
//         this.push(this.COMPARE_OPERATORS[opnum](x, y))

//     #// Attributes and indexing
// }

VirtualMachine.prototype.byte_LOAD_ATTR = function(attr) {
    var obj = this.pop();
    var val = obj[attr];
    this.push(val);
};

VirtualMachine.prototype.byte_STORE_ATTR = function(name) {
    items = this.popn(2);
    items[0][name] = val;
};

VirtualMachine.prototype.byte_DELETE_ATTR = function(name) {
    var obj = this.pop();
    delete obj[name];
};

VirtualMachine.prototype.byte_STORE_SUBSCR = function() {
    var items = this.popn(3);
    items[0][items[1]] = items[2];
};

VirtualMachine.prototype.byte_DELETE_SUBSCR = function() {
    var items = this.popn(2);
    delete items[0][items[1]];
};

VirtualMachine.prototype.byte_BUILD_TUPLE = function(count) {
    var items = this.popn(count);
    this.push(items);
};

VirtualMachine.prototype.byte_BUILD_LIST = function(count) {
    var items = this.popn(count);
    this.push(items);
};

VirtualMachine.prototype.byte_BUILD_SET = function(count) {
    // TODO: Not documented in Py2 docs.
    var retval = new Set();
    for (var i = 0; i < count; i++) {
        retval.add(this.pop());
    }
    this.push(retval);
};

VirtualMachine.prototype.byte_BUILD_MAP = function(size) {
    this.push({});
};

VirtualMachine.prototype.byte_STORE_MAP = function() {
    var items = this.popn(3);
    items[0][items[1]] = items[2];
    this.push(items[0]);
};

VirtualMachine.prototype.byte_UNPACK_SEQUENCE = function(count) {
    var seq = this.pop();
    seq.reverse();
    for (var i=0; i < seq.length; i++) {
        this.push(seq[i]);
    }
};

// VirtualMachine.prototype.byte_BUILD_SLICE = function(count) {
//         if count == 2:
//             x, y = this.popn(2)
//             this.push(slice(x, y))
//         elif count == 3:
//             x, y, z = this.popn(3)
//             this.push(slice(x, y, z))
//         else:           // pragma: no cover
//             throw "Strange BUILD_SLICE count: %r" % count)
// }
VirtualMachine.prototype.byte_LIST_APPEND = function(count) {
    var val = this.pop();
    var the_list = this.peek(count);
    the_list.append(val);
};

VirtualMachine.prototype.byte_SET_ADD = function(count) {
    var val = this.pop();
    var the_set = this.peek(count);
    the_set.add(val);
};

VirtualMachine.prototype.byte_MAP_ADD = function(count) {
    var items = this.popn(2);
    var the_map = this.peek(count);
    the_map[items[1]] = items[0];
};

VirtualMachine.prototype.byte_PRINT_EXPR = function() {
    console.log(this.pop());
};

VirtualMachine.prototype.byte_PRINT_ITEM = function() {
    var item = this.pop();
    this.print_item(item);
};

VirtualMachine.prototype.byte_PRINT_ITEM_TO = function() {
    var to = this.pop();  // FIXME - this is ignored.
    var item = this.pop();
    this.print_item(item);
};

VirtualMachine.prototype.byte_PRINT_NEWLINE = function() {
    this.print_newline();
};

VirtualMachine.prototype.byte_PRINT_NEWLINE_TO = function() {
    var to = this.pop();  // FIXME - this is ignored.
    this.print_newline(to);
};

VirtualMachine.prototype.print_item = function(item, to) {
    if (to === undefined) {
        // to = sys.stdout;  // FIXME - this is ignored.
    }
    console.log(item);
};

VirtualMachine.prototype.print_newline = function(to) {
    if (to === undefined) {
        // to = sys.stdout;  // FIXME - this is ignored.
    }
    console.log("");
};

VirtualMachine.prototype.byte_JUMP_FORWARD = function(jump) {
    this.jump(jump);
};

VirtualMachine.prototype.byte_JUMP_ABSOLUTE = function(jump) {
    this.jump(jump);
};

VirtualMachine.prototype.byte_POP_JUMP_IF_TRUE = function(jump) {
    var val = this.pop();
    if (val) {
        this.jump(jump);
    }
};

VirtualMachine.prototype.byte_POP_JUMP_IF_FALSE = function(jump) {
    var val = this.pop();
    if (!val) {
        this.jump(jump);
    }
};

VirtualMachine.prototype.byte_JUMP_IF_TRUE_OR_POP = function(jump) {
    var val = this.top();
    if (val) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

VirtualMachine.prototype.byte_JUMP_IF_FALSE_OR_POP = function(jump) {
    var val = this.top();
    if (!val) {
        this.jump(jump);
    } else {
        this.pop();
    }
};

VirtualMachine.prototype.byte_SETUP_LOOP = function(dest) {
    this.push_block('loop', dest);
};

VirtualMachine.prototype.byte_GET_ITER = function() {
    this.push(iter(this.pop()));
};

VirtualMachine.prototype.byte_FOR_ITER = function(jump) {
    var iterobj = this.top();
    try {
        v = next(iterobj);
        this.push(v);
    } catch (err) {
        if (err === StopIteration) {
            this.pop();
            this.jump(jump);
        }
    }
};

VirtualMachine.prototype.byte_BREAK_LOOP = function() {
    return 'break';
};

VirtualMachine.prototype.byte_CONTINUE_LOOP = function(dest) {
    // This is a trick with the return value.
    // While unrolling blocks, continue and return both have to preserve
    // state as the finally blocks are executed.  For continue, it's
    // where to jump to, for return, it's the value to return.  It gets
    // pushed on the stack for both, so continue puts the jump destination
    // into return_value.
    this.return_value = dest;
    return 'continue';
};

VirtualMachine.prototype.byte_SETUP_EXCEPT = function(dest) {
    this.push_block('setup-except', dest);
};

VirtualMachine.prototype.byte_SETUP_FINALLY = function(dest) {
    this.push_block('finally', dest);
};

// VirtualMachine.prototype.byte_END_FINALLY = function() {
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

VirtualMachine.prototype.byte_POP_BLOCK = function() {
    this.pop_block();
};

VirtualMachine.prototype.byte_RAISE_VARARGS = function(argc) {
    var cause, exc;
    if (argc == 2) {
        cause = this.pop();
        exc = this.pop();
    } else if (argc == 1) {
        exc = this.pop();
    }
    return this.do_raise(exc, cause)
};

//     VirtualMachine.prototype.do_throw = function(exc, cause) {
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
// VirtualMachine.prototype.byte_POP_EXCEPT = function {
//         block = this.pop_block()
//         if block.type != 'except-handler':
//             throw Exception("popped block is not an except handler")
//         this.unwind_block(block)
// }
// VirtualMachine.prototype.byte_SETUP_WITH = function(dest) {
//         ctxmgr = this.pop()
//         this.push(ctxmgr.__exit__)
//         ctxmgr_obj = ctxmgr.__enter__()
//         if PY2:
//             this.push_block('with', dest)
//         elif PY3:
//             this.push_block('finally', dest)
//         this.push(ctxmgr_obj)
// }
// VirtualMachine.prototype.byte_WITH_CLEANUP = function {
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
// VirtualMachine.prototype.byte_MAKE_FUNCTION = function(argc) {
//         if PY3:
//             name = this.pop()
//         else:
//             name = null
//         code = this.pop()
//         defaults = this.popn(argc)
//         globs = this.frame.f_globals
//         fn = Function(name, code, globs, defaults, null, self)
//         this.push(fn)
// }
// VirtualMachine.prototype.byte_LOAD_CLOSURE = function(name) {
//         this.push(this.frame.cells[name])
// }
// VirtualMachine.prototype.byte_MAKE_CLOSURE = function(argc) {
//         if PY3:
//             // TODO: the py3 docs don't mention this change.
//             name = this.pop()
//         else:
//             name = null
//         closure, code = this.popn(2)
//         defaults = this.popn(argc)
//         globs = this.frame.f_globals
//         fn = Function(name, code, globs, defaults, closure, self)
//         this.push(fn)
// }
VirtualMachine.prototype.byte_CALL_FUNCTION = function(arg) {
    return this.call_function(arg, [], {});
};

VirtualMachine.prototype.byte_CALL_FUNCTION_VAR = function(arg) {
    args = this.pop();
    return this.call_function(arg, args, {});
};

VirtualMachine.prototype.byte_CALL_FUNCTION_KW = function(arg) {
    kwargs = this.pop();
    return this.call_function(arg, [], kwargs);
};

VirtualMachine.prototype.byte_CALL_FUNCTION_VAR_KW = function(arg) {
    items = this.popn(2);
    return this.call_function(arg, items[0], items[1]);
};

VirtualMachine.prototype.call_function = function(arg, args, kwargs) {
    var lenKw = Math.floor(arg / 256);
    var lenPos = arg % 256;
    var namedargs = {};
    for (var i = 0; i < lenKw; i++) {
        items = this.popn(2);
        namedargs[items[0]] = items[1];
    }
    namedargs.update(kwargs);
    var posargs = this.popn(lenPos);
    posargs.extend(args);

    var func = this.pop();
    // frame = this.frame
    if ('im_func' in func) {
        // Methods get self as an implicit first parameter.
        if (func.im_self) {
            posargs.insert(0, func.im_self);
        }
        // The first parameter must be the correct type.
        if (!isinstance(posargs[0], func.im_class)) {
            throw 'unbound method ' + func.im_func.func_name + '()' +
                ' must be called with ' + func.im_class.__name__ + ' instance ' +
                'as first argument (got ' + type(posargs[0]).__name__ + ' instance instead)';
        }
        func = func.im_func;
    }

    var retval = func(posargs, namedargs);
    this.push(retval);
};

// VirtualMachine.prototype.byte_RETURN_VALUE = function {
//         this.return_value = this.pop()
//         if this.frame.generator:
//             this.frame.generator.finished = True
//         return "return"
// }
// VirtualMachine.prototype.byte_YIELD_VALUE = function {
//         this.return_value = this.pop()
//         return "yield"
// }
// VirtualMachine.prototype.byte_YIELD_FROM = function {
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

VirtualMachine.prototype.byte_IMPORT_NAME = function(name) {
    items = this.popn(2);
    frame = this.frame;
    this.push(
        this.__import__(name, frame.f_globals, frame.f_locals, items[1], items[0])
    );
};

VirtualMachine.prototype.byte_IMPORT_STAR = function() {
    // TODO: this doesn't use __all__ properly.
    mod = this.pop();
    for (var attr in mod) {
        if (attr[0] !== '_') {
            this.frame.f_locals[attr] = mod[attr];
        }
    }
};

VirtualMachine.prototype.byte_IMPORT_FROM = function(name) {
    mod = this.top();
    this.push(mod[name]);
};

// VirtualMachine.prototype.byte_EXEC_STMT = function() {
//     stmt, globs, locs = this.popn(3)
//     six.exec_(stmt, globs, locs)
// };

VirtualMachine.prototype.byte_LOAD_BUILD_CLASS = function() {
    this.push(__build_class__);
};

VirtualMachine.prototype.byte_STORE_LOCALS = function() {
    this.frame.f_locals = this.pop();
};

VirtualMachine.prototype.byte_SET_LINENO = function(lineno) {
    this.frame.f_lineno = lineno;
};

VirtualMachine.prototype.__import__ = function(name, globals, locals, fromlist, level) {
    var module = {};
    if (name === 'time') {
        module.clock = function() {
            return [0.1];
        };
    } else {

    }
    return module;
};
