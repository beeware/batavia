/*************************************************************************
 * Operators
 *************************************************************************/

var exceptions = require('./core').exceptions
var type_name = require('./core').type_name
var types = require('./types')

class BinaryOperator {
    constructor(name, magic_method, fallback = null) {
        this.name = name
        this.magic_method = magic_method
        this.fallback = fallback
    }

    apply(left, right, override_name = null) {
        let name = this.name
        if (override_name) {
            name = override_name
        }
        if (left === null) {
            return types.NoneType[this.magic_method](right)
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
                return this.fallback.apply(left, right, name)
            }

            throw new exceptions.TypeError.$pyclass(
                'unsupported operand type(s) for ' + name + ': \'' +
                type_name(left) + '\' and \'' + type_name(right) + '\'')
        }

        return result
    }
}

var operators = {}

Object.assign(operators, {
    '__add__': new BinaryOperator('+', '__add__'),
    '__and__': new BinaryOperator('&', '__and__'),
    '__floordiv__': new BinaryOperator('//', '__floordiv__'),
    '__lshift__': new BinaryOperator('<<', '__lshift__'),
    '__mod__': new BinaryOperator('%', '__mod__'),
    '__mul__': new BinaryOperator('*', '__mul__'),
    '__or__': new BinaryOperator('|', '__or__'),
    '__pow__': new BinaryOperator('** or pow()', '__pow__'),
    '__rshift__': new BinaryOperator('>>', '__rshift__'),
    '__sub__': new BinaryOperator('-', '__sub__'),
    '__truediv__': new BinaryOperator('/', '__truediv__'),
    '__xor__': new BinaryOperator('^', '__xor__')
})

Object.assign(operators, {
    '__iadd__': new BinaryOperator('+=', '__iadd__', operators['__add__']),
    '__iand__': new BinaryOperator('&=', '__iand__', operators['__and__']),
    '__ifloordiv__': new BinaryOperator('//=', '__ifloordiv__', operators['__floordiv__']),
    '__ilshift__': new BinaryOperator('<<=', '__ilshift__', operators['__lshift__']),
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
