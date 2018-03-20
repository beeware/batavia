import { pyargs } from '../core/callables'
import { pyTypeError } from '../core/exceptions'
import { jstype, type_name, PyObject, pyNone } from '../core/types'
import * as version from '../core/version'

import * as types from '../types'

/*************************************************************************
 * An implementation of slice
 *************************************************************************/

class PySlice extends PyObject {
    @pyargs({
        args: ['start_or_stop'],
        default_args: ['stop', 'step'],
        missing_args_error: (e) => `slice expected at least 1 arguments, got ${e.given}`,
        surplus_args_error: (e) => `slice expected at most 3 arguments, got ${e.given}`
    })
    __init__(start_or_stop, stop, step) {
        if (stop === undefined && step === undefined) {
            this.start = pyNone
            this.stop = start_or_stop
            this.step = pyNone
        } else if (step === undefined) {
            this.start = start_or_stop
            this.stop = stop
            this.step = pyNone
        } else {
            this.start = start_or_stop
            this.stop = stop
            this.step = step
        }
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
            if (output_vals[i] === pyNone) {
                output_str.push('None')
            } else if (types.isinstance(output_vals[i], types.pystr)) {
                output_str.push(output_vals[i].__repr__())
            } else {
                output_str.push(output_vals[i].__str__())
            }
        }

        return 'slice(' + output_str[0] + ', ' + output_str[1] + ', ' + output_str[2] + ')'
    }

    __bool__() {
        return true
    }

    /**************************************************
     * Operands
     **************************************************/

    // In CPython, the comparison between two slices is done by converting them into tuples, but conversion by itself is not allowed.
    $as_list(obj) {
        return [obj.start, obj.stop, obj.step]
    }

    $as_tuple(obj) {
        return types.pytuple(this.$as_list(obj))
    }

    $strip_and_compare(a, b, comparison_function) {
        var a_list = this.$as_list(a)
        var b_list = this.$as_list(b)
        for (var i = 0; i < a_list.length && i < b_list.length; ++i) {
            if (types.isinstance(a_list[i], types.pyNoneType) && types.isinstance(b_list[i], types.pyNoneType)) {
                a_list.splice(i, 1)
                b_list.splice(i, 1)
            }
        }
        return types.pytuple(a_list)[comparison_function](types.pytuple(b_list))
    }

    $unsupported_operand(sign, other) {
        throw pyTypeError(
            'unsupported operand type(s) for ' + sign + ': \'slice\' and \'' + type_name(other) + '\''
        )
    }

    $unorderable_types(sign, other) {
        if (version.earlier('3.6')) {
            throw pyTypeError(
                'unorderable types: slice() ' + sign + ' ' + type_name(other) + '()'
            )
        } else {
            throw pyTypeError(
                '\'' + sign + '\' not supported between instances of \'slice\' and \'' +
                type_name(other) + '\''
            )
        }
    }

    __eq__(other) {
        if (!types.isinstance(other, types.pyslice)) {
            return types.pybool(false)
        }
        return (this.start === other.start && this.stop === other.stop && this.step === other.step)
    }

    __ne__(other) {
        if (!types.isinstance(other, types.pyslice)) {
            return types.pybool(true)
        }
        return !this.__eq__(other)
    }

    // __add__.bind(PySlice.prototype, '+')
    // __and__.bind(PySlice.prototype, '&')
    // __lshift__.bind(PySlice.prototype, '<<')
    // __or__.bind(PySlice.prototype, '|')
    // __pow__.bind(PySlice.prototype, '** or pow()')
    // __rshift__.bind(PySlice.prototype, '>>')
    // __sub__.bind(PySlice.prototype, '-')
    // __truediv__.bind(PySlice.prototype, '/')
    // __xor__.bind(PySlice.prototype, '^')

    __floordiv__(other) {
        if (types.isinstance(other, types.pycomplex)) {
            throw pyTypeError(
                'can\'t take floor of complex number.'
            )
        } else {
            this.$unsupported_operand('//', other)
        }
    }

    __ge__(other) {
        if (types.isinstance(other, types.pyslice)) {
            return this.$as_tuple(this).__ge__(this.$as_tuple(other))
        } else {
            this.$unorderable_types('>=', other)
        }
    }

    __le__(other) {
        if (types.isinstance(other, types.pyslice)) {
            return this.$as_tuple(this).__le__(this.$as_tuple(other))
        } else {
            this.$unorderable_types('<=', other)
        }
    }

    __gt__(other) {
        if (types.isinstance(other, types.pyslice)) {
            return this.$strip_and_compare(this, other, '__gt__')
        } else {
            this.$unorderable_types('>', other)
        }
    }

    __lt__(other) {
        if (types.isinstance(other, types.pyslice)) {
            return this.$strip_and_compare(this, other, '__lt__')
        } else {
            this.$unorderable_types('<', other)
        }
    }

    __mod__(other) {
        if (types.isinstance(other, types.pycomplex)) {
            throw pyTypeError(
                'can\'t mod complex numbers.'
            )
        } else {
            this.$unsupported_operand('%', other)
        }
    }

    __mul__(other) {
        var is_sequence = types.isinstance(other, types.pystr) || types.isinstance(other, types.pybytes) || types.isinstance(other, types.pybytearray) || types.isinstance(other, types.pylist) || types.isinstance(other, types.pytuple)
        if (is_sequence) {
            throw pyTypeError(
                'can\'t multiply sequence by non-int of type \'slice\''
            )
        } else {
            this.$unsupported_operand('*', other)
        }
    }

    __getitem__(key) {
        throw pyTypeError(
            '\'slice\' object is not subscriptable'
        )
    }
}

const pyslice = jstype(PySlice, 'slice')
export default pyslice
