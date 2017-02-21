var exceptions = require('../core').exceptions

function open(args, kwargs) {
    throw new exceptions.NotImplementedError.$pyclass("Builtin Batavia function 'open' not implemented")
}
open.__doc__ = 'open() is complicated.' // 6575 character long docstring

module.exports = open
