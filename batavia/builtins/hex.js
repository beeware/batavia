var exceptions = require('../core').exceptions;


function hex(args, kwargs) {
    if (args.length !== 1) {
        throw new exceptions.TypeError("hex() takes exactly one argument (" + args.length + " given)");
    };
    var int = args[0].val
    return "0x" + int.toString(16);
}
hex.__doc__ = "hex(number) -> string\n\nReturn the hexadecimal representation of an integer.\n\n   >>> hex(3735928559)\n   '0xdeadbeef'\n";

module.exports = hex;
