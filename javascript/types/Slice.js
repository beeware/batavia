import { TypeError } from '../core/exceptions'
import { create_pyclass, type_name, PyObject, None } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

/*************************************************************************
 * An implementation of slice
 *************************************************************************/

export default class Slice extends PyObject {
    constructor(kwargs) {
        super()

        // BUG: slices can support arbitrary-sized arguments.
        this.start = kwargs.start
        this.stop = kwargs.stop
        this.step = kwargs.step
    }

    /**************************************************
     * Javascript compatibility methods
     **************************************************/

    toString() {
        return this.__str__()
    }

    /**************************************************
     * Type conversions
     **************************************************/

    __repr__() {
        return this.__str__()
    }

    __str__() {
        var output_vals = [this.start, this.stop, this.step]
        var output_str = []

        for (var i = 0, len = output_vals.length; i < len; i++) {
            if (output_vals[i] === None) {
                output_str.push('None')
            } else if (types.isinstance(output_vals[i], types.Str)) {
                output_str.push(output_vals[i].__repr__())
            } else {
                output_str.push(output_vals[i].__str__())
            }
        }

        return 'slice(' + output_str[0] + ', ' + output_str[1] + ', ' + output_str[2] + ')'
    }

    /**************************************************
     * Operands
     **************************************************/

    // In CPython, the comparison between two slices is done by converting them into tuples, but conversion by itself is not allowed.
    as_list(obj) {
        return [obj.start, obj.stop, obj.step]
    }

    as_tuple(obj) {
        return new types.Tuple(as_list(obj))
    }

    strip_and_compare(a, b, comparison_function) {
        var a_list = as_list(a)
        var b_list = as_list(b)
        for (var i = 0; i < a_list.length && i < b_list.length; ++i) {
            if (types.isinstance(a_list[i], types.NoneType) && types.isinstance(b_list[i], types.NoneType)) {
                a_list.splice(i, 1)
                b_list.splice(i, 1)
            }
        }
        return new types.Tuple(a_list)[comparison_function](new types.Tuple(b_list))
    }

    unsupported_operand(sign, other) {
        throw new TypeError(
            'unsupported operand type(s) for ' + sign + ': \'slice\' and \'' + type_name(other) + '\''
        )
    }

    unorderable_types(sign, other) {
        if (version.earlier('3.6')) {
            throw new TypeError(
                'unorderable types: slice() ' + sign + ' ' + type_name(other) + '()'
            )
        } else {
            throw new TypeError(
                '\'' + sign + '\' not supported between instances of \'slice\' and \'' +
                type_name(other) + '\''
            )
        }
    }

    __eq__(other) {
        if (!types.isinstance(other, types.Slice)) {
            return new types.Bool(false)
        }
        return (this.start === other.start && this.stop === other.stop && this.step === other.step)
    }

    __ne__(other) {
        if (!types.isinstance(other, types.Slice)) {
            return new types.Bool(true)
        }
        return !this.__eq__(other)
    }

    // __add__.bind(Slice.prototype, '+')
    // __and__.bind(Slice.prototype, '&')
    // __lshift__.bind(Slice.prototype, '<<')
    // __or__.bind(Slice.prototype, '|')
    // __pow__.bind(Slice.prototype, '** or pow()')
    // __rshift__.bind(Slice.prototype, '>>')
    // __sub__.bind(Slice.prototype, '-')
    // __truediv__.bind(Slice.prototype, '/')
    // __xor__.bind(Slice.prototype, '^')

    __floordiv__(other) {
        if (types.isinstance(other, types.Complex)) {
            throw new TypeError(
                'can\'t take floor of complex number.'
            )
        } else {
            unsupported_operand('//', other)
        }
    }

    __ge__(other) {
        if (types.isinstance(other, types.Slice)) {
            return as_tuple(this).__ge__(as_tuple(other))
        } else {
            unorderable_types('>=', other)
        }
    }

    __le__(other) {
        if (types.isinstance(other, types.Slice)) {
            return as_tuple(this).__le__(as_tuple(other))
        } else {
            unorderable_types('<=', other)
        }
    }

    __gt__(other) {
        if (types.isinstance(other, types.Slice)) {
            return strip_and_compare(this, other, '__gt__')
        } else {
            unorderable_types('>', other)
        }
    }

    __lt__(other) {
        if (types.isinstance(other, types.Slice)) {
            return strip_and_compare(this, other, '__lt__')
        } else {
            unorderable_types('<', other)
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.Complex)) {
            throw new TypeError(
                'can\'t mod complex numbers.'
            )
        } else {
            unsupported_operand('%', other)
        }
    }

    __mul__(other) {
        var is_sequence = types.isinstance(other, types.Str) || types.isinstance(other, types.Bytes) || types.isinstance(other, types.Bytearray) || types.isinstance(other, types.List) || types.isinstance(other, types.Tuple)
        if (is_sequence) {
            throw new TypeError(
                'can\'t multiply sequence by non-int of type \'slice\''
            )
        } else {
            unsupported_operand('*', other)
        }
    }

    __getitem__(key) {
        throw new TypeError(
            '\'slice\' object is not subscriptable'
        )
    }
}
create_pyclass(Slice, 'slice')
