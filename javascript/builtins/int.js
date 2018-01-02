import { BataviaError, TypeError, ValueError } from '../core/exceptions'

import * as types from '../types'

import repr from './repr'

export default function int(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("int() doesn't accept keyword arguments")
    }

    var base = 10
    var value = 0
    if (!args || args.length === 0) {
        return new types.Int(0)
    } else if (args && args.length === 1) {
        value = args[0]
        if (types.isinstance(value, [types.Int, types.Bool])) {
            return value.__int__()
        }
    } else if (args && args.length === 2) {
        value = args[0]
        base = args[1]
    } else {
        throw new TypeError.$pyclass(
            'int() takes at most 2 arguments (' + args.length + ' given)')
    }
    // TODO: this should be able to parse things longer than 53 bits
    var result = parseInt(value, base)
    if (isNaN(result)) {
        throw new ValueError.$pyclass(
            'invalid literal for int() with base ' + base + ': ' + repr([value], null)
        )
    }
    return new types.Int(result)
}

int.__doc__ = "int(x=0) -> integer\nint(x, base=10) -> integer\n\nConvert a number or string to an integer, or return 0 if no arguments\nare given.  If x is a number, return x.__int__().  For floating point\nnumbers, this truncates towards zero.\n\nIf x is not a number or if base is given, then x must be a string,\nbytes, or bytearray instance representing an integer literal in the\ngiven base.  The literal can be preceded by '+' or '-' and be surrounded\nby whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.\nBase 0 means to interpret the base from the string as an integer literal.\n>>> int('0b100', base=0)\n4"
int.$pyargs = true
