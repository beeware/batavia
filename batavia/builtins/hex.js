var BigNumber = require('bignumber.js')
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var types = require('../types')

function hex(args, kwargs) {
    if (args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('hex() takes exactly one argument (' + args.length + ' given)')
    }
    let value = args[0]
    let supported_types = [types.Bool, types.Int]
    let unsupported_types = [types.Bytearray, types.Bytes, types.Complex, types.Dict, types.Float, types.FrozenSet,
        types.List, types.NoneType, types.NotImplementedType, types.Range, types.Set, types.Slice, types.Str,
        types.Tuple]
    if (types.isinstance(value, supported_types)) {
        value = value.__int__()
    // Check for unsupported types and classes (type_name = 'type' when arg is a class)
    } else if (types.isinstance(value, unsupported_types) || type_name(value) === 'type') {
        throw new exceptions.TypeError.$pyclass("'" + type_name(value) + "' object cannot be interpreted as an integer")
    }
    // Javascript does not have native support for intergers as large as those supported by Python (uses Infinity)
    value = new BigNumber(value)
    // Javascript represents negative hex differently (e.g. -5 == (JS: 0x-5 || Py: -0x5))
    if (value < 0) {
        value = value.negated()
        return '-0x' + value.toString(16)
    } else {
        return '0x' + value.toString(16)
    }
}
hex.__doc__ = "hex(number) -> string\n\nReturn the hexadecimal representation of an integer.\n\n   >>> hex(3735928559)\n   '0xdeadbeef'\n"

module.exports = hex
