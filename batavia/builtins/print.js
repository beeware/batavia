var callables = require('../core').callables;
var exceptions = require('../core').exceptions;
var types = require('../types');


function print(args, kwargs) {
    var sys = require('../modules/sys');
    var sep = kwargs['sep'] || ' ';
    var end = kwargs['end'] || '\n';
    var file = kwargs['file'] || sys.stdout;

    if (args.length == 0) {
        file.write([end]);
    } else {
        for (var i = 0; i < args.length; i++) {
            var elm = args[i];
            var content;

            // output the content
            if (elm === null || elm === undefined) {
                content = "None";
            } else if (elm.__getattr__) {
                try {
                    var str_fn = elm.__getattr__('__str__');
                    // var str_method;
                    // if (str_fn instanceof types.Function) {
                    //     str_method = new types.Method(elm, str_fn);
                    // } else {
                    //     str_method = str_fn;
                    // }
                    if (str_fn.__call__) {
                        str_fn = str_fn.__call__;
                    }
                    content = str_fn([]);
                } catch (e) {
                    if (e instanceof exceptions.AttributeError.$pyclass) {
                        content = elm.toString();
                    } else {
                        throw e;
                    }
                }
            // } else if (elm.__str__) {
            //     content = elm.__str__();
            } else {
                content = elm.toString();
            }
            file.write([content]);

            // output the separator (or end marker if at the end of line)
            if (i == args.length - 1) {
                file.write([end]);
            } else {
                file.write([sep]);
            }
        }
    }

    if (kwargs['flush']) {
        file.flush();
    }
}
print.__doc__ = "print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.\nOptional keyword arguments:\nfile:  a file-like object (stream); defaults to the current sys.stdout.\nsep:   string inserted between values, default a space.\nend:   string appended after the last value, default a newline.\nflush: whether to forcibly flush the stream.";

module.exports = print;
