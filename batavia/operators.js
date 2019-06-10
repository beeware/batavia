/*************************************************************************
 * Operators
 *************************************************************************/

var exceptions = require('./core').exceptions
var type_name = require('./core').type_name
var types = require('./types')

class BinaryOperator {
    constructor(name, magic_method, fallback = null, fallback_reversed = false) {
        this.name = name
        this.magic_method = magic_method
        this.fallback = fallback
        this.fallback_reversed = fallback_reversed
    }

    apply_(left, right) {
        if (left === null) {
            return this.apply_(new types.NoneType(), right)
        }

        let result = new types.NotImplementedType()
        if (left[this.magic_method]) {
            if (left[this.magic_method].__call__) {
                result = left[this.magic_method].__call__([left, right])
            } else {
                result = left[this.magic_method](right)
            }
        }

        if (types.isinstance(result, types.NotImplementedType)) {
            if (this.fallback) {
                if (this.fallback_reversed) {
                    return this.fallback.apply_(right, left)
                }
                return this.fallback.apply_(left, right)
            }
        }
        return result
    }

    apply(left, right) {
        const result = this.apply_(left, right)
        if (types.isinstance(result, types.NotImplementedType)) {
            throw new exceptions.TypeError.$pyclass(
                'unsupported operand type(s) for ' + this.name + ': \'' +
                type_name(left) + '\' and \'' + type_name(right) + '\'')
        }
        return result
    }
}

var operators = {}

Object.assign(operators, {
    '__radd__': new BinaryOperator('+', '__radd__'),
    '__rand__': new BinaryOperator('&', '__rand__'),
    '__rfloordiv__': new BinaryOperator('//', '__rfloordiv__'),
    '__rlshift__': new BinaryOperator('<<', '__rlshift__'),
    '__rmod__': new BinaryOperator('%', '__rmod__'),
    '__rmul__': new BinaryOperator('*', '__rmul__'),
    '__ror__': new BinaryOperator('|', '__ror__'),
    '__rpow__': new BinaryOperator('** or pow()', '__rpow__'),
    '__rrshift__': new BinaryOperator('>>', '__rrshift__'),
    '__rsub__': new BinaryOperator('-', '__rsub__'),
    '__rtruediv__': new BinaryOperator('/', '__rtruediv__'),
    '__rxor__': new BinaryOperator('^', '__rxor__'),
})

Object.assign(operators, {
    '__add__': new BinaryOperator('+', '__add__', operators['__radd__'], true),
    '__and__': new BinaryOperator('&', '__and__', operators['__rand__'], true),
    '__floordiv__': new BinaryOperator('//', '__floordiv__', operators['__rfloordiv__'], true),
    '__lshift__': new BinaryOperator('<<', '__lshift__', operators['__rlshift__'], true),
    '__matmul__': new BinaryOperator('@', '__matmul__', operators['__matmul__'], true),
    '__mod__': new BinaryOperator('%', '__mod__', operators['__rmod__'], true),
    '__mul__': new BinaryOperator('*', '__mul__', operators['__rmul__'], true),
    '__or__': new BinaryOperator('|', '__or__', operators['__ror__'], true),
    '__pow__': new BinaryOperator('** or pow()', '__pow__', operators['__rpow__'], true),
    '__rshift__': new BinaryOperator('>>', '__rshift__', operators['__rrshift__'], true),
    '__sub__': new BinaryOperator('-', '__sub__', operators['__rsub__'], true),
    '__truediv__': new BinaryOperator('/', '__truediv__', operators['__rtruediv__'], true),
    '__xor__': new BinaryOperator('^', '__xor__', operators['__rxor__'], true)
})

Object.assign(operators, {
    '__iadd__': new BinaryOperator('+=', '__iadd__', operators['__add__']),
    '__iand__': new BinaryOperator('&=', '__iand__', operators['__and__']),
    '__ifloordiv__': new BinaryOperator('//=', '__ifloordiv__', operators['__floordiv__']),
    '__ilshift__': new BinaryOperator('<<=', '__ilshift__', operators['__lshift__']),
    '__imatmul__': new BinaryOperator('@=', '__imatmul', operators['__matmul__']),
    '__imod__': new BinaryOperator('%=', '__imod__', operators['__mod__']),
    '__imul__': new BinaryOperator('*=', '__imul__', operators['__mul__']),
    '__ior__': new BinaryOperator('|=', '__ior__', operators['__or__']),
    '__ipow__': new BinaryOperator('** or pow()', '__ipow__', operators['__pow__']),
    '__irshift__': new BinaryOperator('>>=', '__irshift__', operators['__rshift__']),
    '__isub__': new BinaryOperator('-=', '__isub__', operators['__sub__']),
    '__itruediv__': new BinaryOperator('/=', '__itruediv__', operators['__truediv__']),
    '__ixor__': new BinaryOperator('^=', '__ixor__', operators['__xor__'])
})

module.exports = operators
