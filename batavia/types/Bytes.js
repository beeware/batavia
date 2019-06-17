var Buffer = require('buffer').Buffer

var constants = require('../core').constants
var version = require('../core').version
var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var BytesIterator = require('./BytesIterator')
var NotImplemented = require('../core').NotImplemented

/*************************************************************************
 * A Python bytes type
 *************************************************************************/
const className = 'bytes';

function Bytes(val) {
    // the value is an instance of Feross's Buffer class
    PyObject.call(this)
    this.val = val
}

create_pyclass(Bytes, className)

Bytes.prototype.__dir__ = function() {
    var types = require('../types')
    if (version.at_least(3.7)) {
        // Python 3.7 adds isascii
        return new types.List(['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize', 'center', 'count', 'decode', 'endswith', 'expandtabs', 'find', 'fromhex', 'hex', 'index', 'isalnum', 'isalpha', 'isascii', 'isdigit', 'islower', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill'])
    }
    if (version.at_least(3.6)) {
        // Python 3.6 adds classmethod object.__init_subclass__
        return new types.List(['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize', 'center', 'count', 'decode', 'endswith', 'expandtabs', 'find', 'fromhex', 'hex', 'index', 'isalnum', 'isalpha', 'isdigit', 'islower', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill'])
    }
    return new types.List(['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize', 'center', 'count', 'decode', 'endswith', 'expandtabs', 'find', 'fromhex', 'hex', 'index', 'isalnum', 'isalpha', 'isdigit', 'islower', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill'])
}

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Bytes.prototype.toString = function() {
    return this.__str__()
}

Bytes.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Bytes.prototype.__bool__ = function() {
    return this.val.length > 0
}

Bytes.prototype.__len__ = function() {
    var types = require('../types')
    return new types.Int(this.val.length)
}

Bytes.prototype.__repr__ = function() {
    return this.__str__()
}

Bytes.prototype.__str__ = function() {
    // we iterate natively in JS so as not to have to box/unbox
    // the values from a Batavia Int, maybe premature optimisation
    // when writing only one bytestring to a console/textarea
    // but can't hurt when writing a lot of bytestrings on a socket
    var stringified = "b'"
    // var buffer_length = this.val.length
    var buffer_length = this.__len__()
    for (var i = 0; i < buffer_length; i++) {
        var value = this.val[i]
        if (value >= 32 && value <= 126) {
            stringified += String.fromCharCode(value)
        } else if (value >= 9 && value <= 13) {
            stringified += {
                9: '\\t',
                10: '\\n',
                11: '\\x0b',
                12: '\\x0c',
                13: '\\r'
            }[value]
        } else {
            stringified += '\\x' + ('0' + value.toString(16)).slice(-2)
        }
    }
    return stringified + "'"
}

Bytes.prototype.__iter__ = function() {
    return new BytesIterator(this.val)
}

/**************************************************
 * Comparison operators
 **************************************************/

Bytes.prototype.__lt__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bytes)) {
        return this.val < other.val
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'<\' not supported between instances of \'bytes\' and \'' +
                type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bytes() < ' + type_name(other) + '()'
            )
        }
    }
}

Bytes.prototype.__le__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bytes)) {
        return this.val <= other.val
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'<=\' not supported between instances of \'bytes\' and \'' +
                type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bytes() <= ' + type_name(other) + '()'
            )
        }
    }
}

Bytes.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bytes)) {
        var equal = (this.val.compare(other.val) === 0)
        return new types.Bool(equal)
    } else if (types.isinstance(other, types.Bytearray)) {
        throw new exceptions.NotImplementedError.$pyclass(
            'Comparison between bytes and bytearrays has not been implemented')
    } else {
        return new types.Bool(false)
    }
}

Bytes.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__()
}

Bytes.prototype.__gt__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bytes)) {
        return this.val > other.val
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'>\' not supported between instances of \'bytes\' and \'' +
                type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bytes() > ' + type_name(other) + '()'
            )
        }
    }
}

Bytes.prototype.__ge__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, Bytes)) {
        return this.val >= other.val
    } else {
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                '\'>=\' not supported between instances of \'bytes\' and \'' +
                type_name(other) + '\''
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'unorderable types: bytes() >= ' + type_name(other) + '()'
            )
        }
    }
}

Bytes.prototype.__contains__ = function(other) {
    var types = require('../types')

    var other_value = null
    if (types.isinstance(other, types.Int)) {
        if (other >= 0 && other <= 255) {
            other_value = parseInt(other.valueOf())
        } else {
            throw new exceptions.ValueError.$pyclass(
                'byte must be in range (0, 256)'
            )
        }
    } else if (types.isinstance(other, Bytes)) {
        other_value = this.val
    }
    if (other_value !== null) {
        return this.val.indexOf(other_value) !== -1
    } else {
        return new types.Bool(false)
    }
}

/**************************************************
 * Unary operators
 **************************************************/

Bytes.prototype.__pos__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary +: 'bytes'")
}

Bytes.prototype.__neg__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary -: 'bytes'")
}

Bytes.prototype.__not__ = function() {
    return this.val.length === 0
}

Bytes.prototype.__invert__ = function() {
    throw new exceptions.TypeError.$pyclass("bad operand type for unary ~: 'bytes'")
}

/**************************************************
 * Binary operators
 **************************************************/

Bytes.prototype.__mul__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [types.Bool, types.Int])) {
        // Check if value of 'other' Int/Bool value is truthy
        // and 'this' byte object is non-empty
        if (other.valueOf() > 0 && this.valueOf().length > 0) {
            let thisByteLength = this.valueOf().length
            let thisValue = this.valueOf().toString()
            let otherValue = other.valueOf()

            // Add at least one copy of byte object string into buffer
            let byteBuffer = Buffer.alloc(thisByteLength * otherValue)
            byteBuffer.write(thisValue)

            // repeat adding copies as necessary
            if (otherValue > 1) {
                for (let i = 1; i < otherValue; i++) {
                    byteBuffer.write(thisValue, i * thisByteLength)
                }
            }

            return new Bytes(byteBuffer)
        } else {
            return new Bytes('')
        }
    } else {
        throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
    }
}

Bytes.prototype.__add__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, [Bytes])) {
        // create a new buffer object of combined length and then write the concatenated string value of both byte objects
        let byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().length)
        byteBuffer.write(this.valueOf().toString() + other.valueOf().toString())
        return new Bytes(byteBuffer)
    } else if (types.isinstance(other, [types.Bytearray])) {
        let byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().valueOf().length)
        byteBuffer.write(this.valueOf().toString() + other.valueOf().valueOf().toString())
        return new Bytes(byteBuffer)
    } else if (types.isinstance(other, [
        types.Bool,
        types.Dict,
        types.Int,
        types.Float,
        types.List,
        types.NoneType,
        types.Set,
        types.Str,
        types.Tuple ])) {
        // does not concat with all these
        if (version.at_least('3.6')) {
            throw new exceptions.TypeError.$pyclass(
                'can\'t concat ' + type_name(other) + ' to bytes'
            )
        } else {
            throw new exceptions.TypeError.$pyclass(
                'can\'t concat bytes to ' + type_name(other)
            )
        }
    } else {
        throw new exceptions.TypeError.$pyclass("can't concat bytes to " + type_name(other))
    }
}

Bytes.prototype.__getitem__ = function(other) {
    var types = require('../types')

    if (types.isinstance(other, types.Slice)) {
        throw new exceptions.NotImplementedError.$pyclass('bytes.__getitem__ with slice has not been implemented')
    }
    if (!types.isinstance(other, types.Int)) {
        throw new exceptions.TypeError.$pyclass('byte indices must be integers or slices, not ' + type_name(other))
    }
    return new types.Int(this.val[other.int32()])
}

/**************************************************
 * Right-hand operators
 **************************************************/

Bytes.prototype.__rmul__ = function(other) {
    let types = require('../types')
    if (types.isinstance(other, [types.Int, types.Bool])) {
        return this.__mul__(other)
    }
    throw new exceptions.TypeError.$pyclass('\'' + type_name(other) + '\' object cannot be interpreted as an integer')
}

Bytes.prototype.__rmod__ = function(other) {
    return NotImplemented
}

/**************************************************
 * Methods
 **************************************************/

Bytes.prototype.copy = function() {
    return new Bytes(this.valueOf())
}

Bytes.prototype.decode = function(encoding, errors) {
    if (errors !== undefined) {
        return new exceptions.NotImplementedError(
            "'errors' parameter of String.encode not implemented"
        )
    }
    encoding = encoding.toLowerCase()
    var encs = constants.TEXT_ENCODINGS
    if (encs.ascii.indexOf(encoding) !== -1) {
        return this.val.toString('ascii')
    } else if (encs.latin_1.indexOf(encoding) !== -1) {
        return this.val.toString('latin1')
    } else if (encs.utf_8.indexOf(encoding) !== -1) {
        return this.val.toString('utf8')
    } else {
        return new exceptions.NotImplementedError(
            'encoding not implemented or incorrect encoding'
        )
    }
}

Bytes.prototype.__format__ = function(value, formatSpecifier) {
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code ' +  formatSpecifier + ' for object of type ' + className)
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Bytes
