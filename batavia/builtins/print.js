var callables = require('../core').callables;

var print = function(args, kwargs) {
    var sys = require('../modules/sys');

    var elements = [];
    args.map(function(elm) {
        if (elm === null || elm === undefined) {
            elements.push("None");
        } else if (elm.__str__) {
            elements.push(callables.run_callable(elm, elm.__str__, [], {}));
        } else {
            elements.push(elm.toString());
        }
    });
    var sep = kwargs['sep'] || ' ';
    var end = kwargs['end'] || '\n';
    var file = kwargs['file'] || sys.stdout;

    file.write(elements.join(sep) + end);
};
print.__doc__ = "print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.\nOptional keyword arguments:\nfile:  a file-like object (stream); defaults to the current sys.stdout.\nsep:   string inserted between values, default a space.\nend:   string appended after the last value, default a newline.\nflush: whether to forcibly flush the stream.";

module.exports = print;
