var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var None = require('../core').None
var BytearrayIterator = require('./BytearrayIterator')

/*************************************************************************
 * A Python bytearray type
 *************************************************************************/

function Bytearray(val) {
    PyObject.call(this)
    this.val = val
}

create_pyclass(Bytearray, 'bytearray')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Bytearray.prototype.toString = function() {
    return this.__str__()
}

Bytearray.prototype.valueOf = function() {
    return this.val
}

/**************************************************
 * Type conversions
 **************************************************/

Bytearray.prototype.__bool__ = function() {
    return this.val.__bool__()
}

Bytearray.prototype.__repr__ = function() {
    return this.__str__()
}

Bytearray.prototype.__str__ = function() {
    return 'bytearray(' + this.val.toString() + ')'
}

Bytearray.prototype.__iter__ = function() {
    if (this.val.__iter__) {
        return this.val.__iter__()
    } else {
        return new BytearrayIterator(this.val)
    }
}

/**************************************************
 * Comparison operators
 **************************************************/

Bytearray.prototype.__lt__ = function(other) {
    if (other !== None) {
        return this.valueOf() < other
    }
    return false
}

Bytearray.prototype.__le__ = function(other) {
    if (other !== None) {
        return this.valueOf() <= other
    }
    return false
}

Bytearray.prototype.__eq__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        var val
        if (types.isinstance(other, [types.Bool, types.Int, types.Float])) {
            return false
        } else {
            return this.valueOf() === val
        }
    }
    return this.valueOf() === ''
}

Bytearray.prototype.__ne__ = function(other) {
    var types = require('../types')

    if (other !== None) {
        var val
        if (types.isinstance(other, [types.Bool, types.Int, types.Float])) {
            return true
        } else {
            return this.valueOf() !== val
        }
    }
    return this.valueOf() !== ''
}

Bytearray.prototype.__gt__ = function(other) {
    if (other !== None) {
        return this.valueOf() > other
    }
    return false
}

Bytearray.prototype.__ge__ = function(other) {
    if (other !== None) {
        return this.valueOf() >= other
    }
    return false
}

Bytearray.prototype.__contains__ = function(other) {
    if (other !== None) {
        return this.valueOf().hasOwnProperty(other)
    }
    return false
}

/**************************************************
 * Unary operators
 **************************************************/

Bytearray.prototype.__pos__ = function() {
    return new Bytearray(+this.valueOf())
}

Bytearray.prototype.__neg__ = function() {
    return new Bytearray(-this.valueOf())
}

Bytearray.prototype.__not__ = function() {
    return new Bytearray(!this.valueOf())
}

Bytearray.prototype.__invert__ = function() {
    return new Bytearray(~this.valueOf())
}

/**************************************************
 * Binary operators
 **************************************************/

Bytearray.prototype.__pow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__pow__ has not been implemented')
}

Bytearray.prototype.__div__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__div__ has not been implemented')
}

Bytearray.prototype.__floordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__floordiv__ has not been implemented')
}

Bytearray.prototype.__truediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__truediv__ has not been implemented')
}

Bytearray.prototype.__mul__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'")
}

Bytearray.prototype.__mod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__mod__ has not been implemented')
}

Bytearray.prototype.__add__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Bytearray)) {

        /*
        console.log("\n\n\n\n")        
        if (this.val.__len__() > 0) {
            console.log("type checking")
            console.log(this.val.__len__())
            console.log("len: " + this.val.val.length)
            console.log(this.val)
            console.log(this.val.val)
            console.log(this.val.val[0])
            //console.log("x1: " + this.val.c.val[0])
        }
        */
        
        
        /*
        this.val accesses the bytearray type
        this.val.val access the array of bytes in the bytearray type
        this.val.val[x] access the byte at index x
        this.val.val.length to get the length of the bytearray


        this.val returns a Bytes type
        */

        //console.log("try adding: " + this.val.val + other.val.val)
        //console.log("try adding2: " + this.val.val.toString() + other.val.val.toString())

        var stringified1 = ""
        // var buffer_length = this.val.length
        var buffer_length = this.val.val.length
        for (var i = 0; i < buffer_length; i++) {
            var value = this.val.val[i]
            if (value >= 32 && value <= 126) {
                stringified1 += String.fromCharCode(value)
            } else if (value >= 9 && value <= 13) {
                stringified1 += {
                    9: '\\t',
                    10: '\\n',
                    11: '\\x0b',
                    12: '\\x0c',
                    13: '\\r'
                }[value]
            } else {
                stringified1 += '\\x' + ('0' + value.toString(16)).slice(-2)
            }
        }
        var stringified2 = ""
        // var buffer_length = this.val.length
        var buffer_length = other.val.val.length
        for (var i = 0; i < buffer_length; i++) {
            var value = other.val.val[i]
            if (value >= 32 && value <= 126) {
                stringified2 += String.fromCharCode(value)
            } else if (value >= 9 && value <= 13) {
                stringified2 += {
                    9: '\\t',
                    10: '\\n',
                    11: '\\x0b',
                    12: '\\x0c',
                    13: '\\r'
                }[value]
            } else {
                stringified2 += '\\x' + ('0' + value.toString(16)).slice(-2)
            }
        }
        //console.log("1: " + stringified1)
        //console.log("2: " + stringified2)
        //return stringified + "'"
        var concat_stringified = "b'" + stringified1 + stringified2 + "'"
        var combined_bytearray = new Bytearray(concat_stringified)
        //console.log(combined_bytearray.__len__())
        return combined_bytearray


        /*
        if (this.val.val.length === 0) {
            return new Bytearray(other)
        }
        else if (other.val.val.length === 0) {
            return new Bytearray(this)
        }
        else {
            console.log("=========")
            var bytes1 = new types.Bytes(this.val.val)
            var bytes2 = new types.Bytes(other.val.val)
            var bytes3 = new types.Bytes(bytes1 + bytes2)
            var bytes_str = new types.Bytes("wow")
            var bytes_sum = bytes1 + bytes_str

            var buffer1 = Buffer.alloc(this.val.val.length)
            console.log("writing " + this.val.val.toString() + " to buffer1")
            buffer1.write(this.val.val.toString())

            var buffer2 = Buffer.alloc(other.val.val.length)
            buffer2.write(other.val.val.toString())

            var buffer3 = Buffer.concat([buffer1, buffer2], buffer1.length + buffer2.length)
            console.log("buffer: " + buffer3 + ", length: " + buffer3.length)

            var byte_from_buffer = new types.Bytes(buffer3)
            console.log("byte buffer: " + byte_from_buffer)

            console.log("bytes1: " + bytes1)
            console.log("bytes2: " + bytes2)
            console.log("bytes3: " + bytes3)
            console.log("bytes +: " + bytes_sum)



            var buffer1x = Buffer.alloc(this.val.val.length)
            console.log("writing " + this.val.toString() + " to buffer1x")
            buffer1x.write(this.val.toString())

            console.log("=========")


            var byteBuffer = Buffer.alloc(this.val.val.length)
            byteBuffer.write(this.val.val.toString(16))
            console.log("BB: " + byteBuffer)
            //var concat = this.val.val.toString() + "," + other.val.val.toString()
            var sum = new types.Bytes(byteBuffer)
            console.log("my_sum: " + sum)

            var new_sum = new types.Bytes(Buffer.alloc(0)) 
            new_sum += this.val
            console.log("first: " + new_sum)
            new_sum += other.val
            console.log("second: " + new_sum)

            //var sum = ''
            for (var i = 0; i < this.val.val.length; ++i) {
                sum += this.val.val[i].toString()
            }
            for (var i = 0; i < other.val.val.length; ++i) {
                sum += other.val.val[i].toString()
            }
            console.log("sum: " + sum)
            //console.log("concat: " + concat)
            var ret = new Bytearray(sum)
            console.log(ret.toString())
            return ret
        }
        */

        /*
        console.log("BA: " + this.valueOf().toString()) //BA: b'\x00\x00'
        console.log("other: " + other.valueOf().toString()) // other: b'\x00\x01\x02\x03\x04'
        console.log("adding: " + this.valueOf().toString() + other.valueOf().toString()) //adding: b'\x00\x00'b'\x00\x01\x02\x03\x04
        console.log("BA-val: " + this.valueOf()) //BA-val: b'\x00\x00'
        console.log("other-val: " + other.valueOf()) //other-val: b'\x00\x01\x02\x03\x04'
        console.log("adding-val: " + this.valueOf() + other.valueOf()) //adding-val: b'\x00\x00'b'\x00\x01\x02\x03\x04'
        */
        //byteBuffer.write(this.valueOf().toString() + other.valueOf().toString())
        //return new Bytearray(byteBuffer)

        /*
        let byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().length)
        byteBuffer.write(this.valueOf().toString() + other.valueOf().toString())
        return new Bytes(byteBuffer)
        */


        // https://runkit.com/5acfc920e70cee00127a365c/5acfc920e70cee00127a365d
        //the below prints: Buffer <68, 65, 6C, 6C, 6F>
        /*
        var byteBuffer = Buffer.alloc(5);
        byteBuffer.write("hello");
        console.log(byteBuffer);
        */
        //var byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().length)

    }
    else if (types.isinstance(other, types.Bytes)) {
        let byteBuffer = Buffer.alloc(this.valueOf().length + other.valueOf().length)
        byteBuffer.write(this.valueOf().toString() + other.valueOf().toString())
        return new Bytearray(byteBuffer)
    }
    else {
        throw new exceptions.TypeError.$pyclass("can't concat bytearray to " + type_name(other))
    }    
}

Bytearray.prototype.__sub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__sub__ has not been implemented')
}

Bytearray.prototype.__getitem__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__getitem__ has not been implemented')
}

Bytearray.prototype.__lshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__lshift__ has not been implemented')
}

Bytearray.prototype.__rshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__rshift__ has not been implemented')
}

Bytearray.prototype.__and__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__and__ has not been implemented')
}

Bytearray.prototype.__xor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__xor__ has not been implemented')
}

Bytearray.prototype.__or__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__or__ has not been implemented')
}

/**************************************************
 * Inplace operators
 **************************************************/

Bytearray.prototype.__idiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__idiv__ has not been implemented')
}

Bytearray.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ifloordiv__ has not been implemented')
}

Bytearray.prototype.__itruediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__itruediv__ has not been implemented')
}

Bytearray.prototype.__iadd__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__iadd__ has not been implemented')
}

Bytearray.prototype.__isub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__isub__ has not been implemented')
}

Bytearray.prototype.__imul__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__imul__ has not been implemented')
}

Bytearray.prototype.__imod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__imod__ has not been implemented')
}

Bytearray.prototype.__ipow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ipow__ has not been implemented')
}

Bytearray.prototype.__ilshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ilshift__ has not been implemented')
}

Bytearray.prototype.__irshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__irshift__ has not been implemented')
}

Bytearray.prototype.__iand__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__iand__ has not been implemented')
}

Bytearray.prototype.__ixor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ixor__ has not been implemented')
}

Bytearray.prototype.__ior__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass('Bytearray.__ior__ has not been implemented')
}

/**************************************************
 * Methods
 **************************************************/

Bytearray.prototype.copy = function() {
    return new Bytearray(this.valueOf())
}

Bytearray.prototype.__len__ = function() {
    return this.val.__len__()
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Bytearray
