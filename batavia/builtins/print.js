var callables = require('../core').callables;

var print = function(args, kwargs) {
    var sys = require('../modules/sys');
    var sep = kwargs['sep'] || ' ';
    var end = kwargs['end'] || '\n';
    var file = kwargs['file'] || sys.stdout;

    if (args.length == 0) {
        callables.run_callable(file, file.write, [end], {});
    } else {
        for (var i = 0; i < args.length; i++) {
            var elm = args[i];
            var content;

            // output the content
            if (elm === null || elm === undefined) {
                content = "None";
            } else if (elm.__str__) {
                content = callables.run_callable(elm, elm.__str__, [], {});
            } else {
                content = elm.toString();
            }
            callables.run_callable(file, file.write, [content], {});

            // output the separator (or end marker if at the end of line)
            if (i == args.length - 1) {
                callables.run_callable(file, file.write, [end], {});
            } else {
                callables.run_callable(file, file.write, [sep], {});
            }
        }
    }

    if (kwargs['flush']) {
        callables.run_callable(file, file.flush, [], {});
    }
};
print.__doc__ = "print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.\nOptional keyword arguments:\nfile:  a file-like object (stream); defaults to the current sys.stdout.\nsep:   string inserted between values, default a space.\nend:   string appended after the last value, default a newline.\nflush: whether to forcibly flush the stream.";

module.exports = print;
