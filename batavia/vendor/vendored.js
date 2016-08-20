/*
  The build system for Batavia is (for the moment) composed of make and cat,
  so this file contains a smushed-together compilation of all the vendored libs.

  Eventually, hopefully the `batavia.vendored` name hierarchy will be created
  automatically by a real build system. Meanwhile...
*/


/*****************************************************************
 * isarray: a compatibility shim to add isArray to older browsers.

 * https://github.com/juliangruber/isarray/

 * license: MIT

 *****************************************************************/
batavia.vendored.toString = {}.toString;
batavia.vendored.isArray = Array.isArray || function (arr) {
  return batavia.vendored.toString.call(arr) == '[object Array]';
};


/*****************************************************************
 * ieee754: Read/write IEEE754 floating point numbers from/to a Buffer or array-like object.

 * https://github.com/feross/ieee754

 * license: MIT

 *****************************************************************/

batavia.vendored.ieee754 = {};
batavia.vendored.ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m
    var eLen = nBytes * 8 - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var nBits = -7
    var i = isLE ? (nBytes - 1) : 0
    var d = isLE ? -1 : 1
    var s = buffer[offset + i]

    i += d

    e = s & ((1 << (-nBits)) - 1)
    s >>= (-nBits)
    nBits += eLen
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << (-nBits)) - 1)
    e >>= (-nBits)
    nBits += mLen
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
        e = 1 - eBias
    } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

batavia.vendored.ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c
    var eLen = nBytes * 8 - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
    var i = isLE ? 0 : (nBytes - 1)
    var d = isLE ? 1 : -1
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

    value = Math.abs(value)

    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
    } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--
            c *= 2
        }
        if (e + eBias >= 1) {
            value += rt / c
        } else {
            value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
            e++
            c /= 2
        }

        if (e + eBias >= eMax) {
            m = 0
            e = eMax
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen)
            e = e + eBias
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
            e = 0
        }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = (e << mLen) | m
    eLen += mLen
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128
}


/*****************************************************************
 * base64-js: Base64 encoding/decoding in pure JS

 * https://github.com/beatgammit/base64-js

 * License: MIT

 *****************************************************************/

batavia.vendored.base64 = function() {
    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

    function init () {
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        for (var i = 0, len = code.length; i < len; ++i) {
            lookup[i] = code[i]
            revLookup[code.charCodeAt(i)] = i
        }

    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63
    }

    init()

    function toByteArray (b64) {
        var i, j, l, tmp, placeHolders, arr
        var len = b64.length

        if (len % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

        // base64 is 4/3 + up to two characters of the original data
        arr = new Arr(len * 3 / 4 - placeHolders)

        // if there are placeholders, only get up to the last complete 4 chars
        l = placeHolders > 0 ? len - 4 : len

        var L = 0

        for (i = 0, j = 0; i < l; i += 4, j += 3) {
            tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
            arr[L++] = (tmp >> 16) & 0xFF
            arr[L++] = (tmp >> 8) & 0xFF
            arr[L++] = tmp & 0xFF
        }

        if (placeHolders === 2) {
            tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
            arr[L++] = tmp & 0xFF
        } else if (placeHolders === 1) {
            tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
            arr[L++] = (tmp >> 8) & 0xFF
            arr[L++] = tmp & 0xFF
        }

        return arr
    }

    function tripletToBase64 (num) {
        return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
    }

    function encodeChunk (uint8, start, end) {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
            tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
            output.push(tripletToBase64(tmp))
        }
        return output.join('')
    }

    function fromByteArray (uint8) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var output = ''
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            tmp = uint8[len - 1]
            output += lookup[tmp >> 2]
            output += lookup[(tmp << 4) & 0x3F]
            output += '=='
        } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
            output += lookup[tmp >> 10]
            output += lookup[(tmp >> 4) & 0x3F]
            output += lookup[(tmp << 2) & 0x3F]
            output += '='
        }

        parts.push(output)

        return parts.join('')
    }
    var exports = {};
    exports.toByteArray = toByteArray
    exports.fromByteArray = fromByteArray
    return exports
}();


/*****************************************************************
 * buffer: The buffer module from node.js, for the browser.

 * https://github.com/feross/buffer

 * license: MIT

 *****************************************************************/

batavia.vendored.buffer = function() {
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    /* eslint-disable no-proto */

    'use strict'

    var base64 = batavia.vendored.base64
    var ieee754 = batavia.vendored.ieee754
    var isArray = batavia.vendored.isArray

    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Use Object implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * Due to various browser bugs, sometimes the Object implementation will be used even
     * when the browser supports typed arrays.
     *
     * Note:
     *
     *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
     *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
     *
     *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
     *
     *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
     *     incorrect length in some situations.
     * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
     * get the Object implementation, which is slower but behaves correctly.
     */

    function typedArraySupport () {
        try {
            var arr = new Uint8Array(1)
            arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
            return arr.foo() === 42 && // typed array instances can be augmented
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
        } catch (e) {
            return false
        }
    }

    function kMaxLength () {
        return Buffer.TYPED_ARRAY_SUPPORT
            ? 0x7fffffff
            : 0x3fffffff
    }

    function createBuffer (that, length) {
        if (kMaxLength() < length) {
            throw new RangeError('Invalid typed array length')
        }
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            // Return an augmented `Uint8Array` instance, for best performance
            that = new Uint8Array(length)
            that.__proto__ = Buffer.prototype
        } else {
            // Fallback: Return an object instance of the Buffer class
            if (that === null) {
                that = new Buffer(length)
            }
            that.length = length
        }

        return that
    }

    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */
    function Buffer (arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
            return new Buffer(arg, encodingOrOffset, length)
        }

        // Common case.
        if (typeof arg === 'number') {
            if (typeof encodingOrOffset === 'string') {
                throw new Error(
                    'If encoding is specified then the first argument must be a string'
                )
            }
            return allocUnsafe(this, arg)
        }
        return from(this, arg, encodingOrOffset, length)
    }

    Buffer.poolSize = 8192 // not used by this implementation

    // TODO: Legacy, not needed anymore. Remove in next major version.
    Buffer._augment = function (arr) {
        arr.__proto__ = Buffer.prototype
        return arr
    }

    function from (that, value, encodingOrOffset, length) {
        if (typeof value === 'number') {
            throw new TypeError('"value" argument must not be a number')
        }

        if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
            return fromArrayBuffer(that, value, encodingOrOffset, length)
        }

        if (typeof value === 'string') {
            return fromString(that, value, encodingOrOffset)
        }

        return fromObject(that, value)
    }

    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/
    Buffer.from = function (value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length)
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype
        Buffer.__proto__ = Uint8Array
        if (typeof Symbol !== 'undefined' && Symbol.species &&
            Buffer[Symbol.species] === Buffer) {
            // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
            Object.defineProperty(Buffer, Symbol.species, {
                value: null,
                configurable: true
            })
        }
    }

    function assertSize (size) {
        if (typeof size !== 'number') {
            throw new TypeError('"size" argument must be a number')
        }
    }

    function alloc (that, size, fill, encoding) {
        assertSize(size)
        if (size <= 0) {
            return createBuffer(that, size)
        }
        if (fill !== undefined) {
            // Only pay attention to encoding if it's a string. This
            // prevents accidentally sending in a number that would
            // be interpretted as a start offset.
            return typeof encoding === 'string'
                ? createBuffer(that, size).fill(fill, encoding)
                : createBuffer(that, size).fill(fill)
        }
        return createBuffer(that, size)
    }

    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/
    Buffer.alloc = function (size, fill, encoding) {
        return alloc(null, size, fill, encoding)
    }

    function allocUnsafe (that, size) {
        assertSize(size)
        that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
        if (!Buffer.TYPED_ARRAY_SUPPORT) {
            for (var i = 0; i < size; ++i) {
                that[i] = 0
            }
        }
        return that
    }

    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */
    Buffer.allocUnsafe = function (size) {
        return allocUnsafe(null, size)
    }
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */
    Buffer.allocUnsafeSlow = function (size) {
        return allocUnsafe(null, size)
    }

    function fromString (that, string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
            encoding = 'utf8'
        }

        if (!Buffer.isEncoding(encoding)) {
            throw new TypeError('"encoding" must be a valid string encoding')
        }

        var length = byteLength(string, encoding) | 0
        that = createBuffer(that, length)

        var actual = that.write(string, encoding)

        if (actual !== length) {
            // Writing a hex string, for example, that contains invalid characters will
            // cause everything after the first invalid character to be ignored. (e.g.
            // 'abxxcd' will be treated as 'ab')
            that = that.slice(0, actual)
        }

        return that
    }

    function fromArrayLike (that, array) {
        var length = checked(array.length) | 0
        that = createBuffer(that, length)
        for (var i = 0; i < length; i += 1) {
            that[i] = array[i] & 255
        }
        return that
    }

    function fromArrayBuffer (that, array, byteOffset, length) {
        array.byteLength // this throws if `array` is not a valid ArrayBuffer

        if (byteOffset < 0 || array.byteLength < byteOffset) {
            throw new RangeError('\'offset\' is out of bounds')
        }

        if (array.byteLength < byteOffset + (length || 0)) {
            throw new RangeError('\'length\' is out of bounds')
        }

        if (byteOffset === undefined && length === undefined) {
            array = new Uint8Array(array)
        } else if (length === undefined) {
            array = new Uint8Array(array, byteOffset)
        } else {
            array = new Uint8Array(array, byteOffset, length)
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
            // Return an augmented `Uint8Array` instance, for best performance
            that = array
            that.__proto__ = Buffer.prototype
        } else {
            // Fallback: Return an object instance of the Buffer class
            that = fromArrayLike(that, array)
        }
        return that
    }

    function fromObject (that, obj) {
        if (Buffer.isBuffer(obj)) {
            var len = checked(obj.length) | 0
            that = createBuffer(that, len)

            if (that.length === 0) {
                return that
            }

            obj.copy(that, 0, 0, len)
            return that
        }

        if (obj) {
            if ((typeof ArrayBuffer !== 'undefined' &&
                 obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
                if (typeof obj.length !== 'number' || isnan(obj.length)) {
                    return createBuffer(that, 0)
                }
                return fromArrayLike(that, obj)
            }

            if (obj.type === 'Buffer' && isArray(obj.data)) {
                return fromArrayLike(that, obj.data)
            }
        }

        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
    }

    function checked (length) {
        // Note: cannot use `length < kMaxLength` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= kMaxLength()) {
            throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                                 'size: 0x' + kMaxLength().toString(16) + ' bytes')
        }
        return length | 0
    }

    function SlowBuffer (length) {
        if (+length != length) { // eslint-disable-line eqeqeq
            length = 0
        }
        return Buffer.alloc(+length)
    }

    Buffer.isBuffer = function isBuffer (b) {
        return !!(b != null && b._isBuffer)
    }

    Buffer.compare = function compare (a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
            throw new TypeError('Arguments must be Buffers')
        }

        if (a === b) return 0

        var x = a.length
        var y = b.length

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
            if (a[i] !== b[i]) {
                x = a[i]
                y = b[i]
                break
            }
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
    }

    Buffer.isEncoding = function isEncoding (encoding) {
        switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true
        default:
            return false
        }
    }

    Buffer.concat = function concat (list, length) {
        if (!isArray(list)) {
            throw new TypeError('"list" argument must be an Array of Buffers')
        }

        if (list.length === 0) {
            return Buffer.alloc(0)
        }

        var i
        if (length === undefined) {
            length = 0
            for (i = 0; i < list.length; ++i) {
                length += list[i].length
            }
        }

        var buffer = Buffer.allocUnsafe(length)
        var pos = 0
        for (i = 0; i < list.length; ++i) {
            var buf = list[i]
            if (!Buffer.isBuffer(buf)) {
                throw new TypeError('"list" argument must be an Array of Buffers')
            }
            buf.copy(buffer, pos)
            pos += buf.length
        }
        return buffer
    }

    function byteLength (string, encoding) {
        if (Buffer.isBuffer(string)) {
            return string.length
        }
        if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
            (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
            return string.byteLength
        }
        if (typeof string !== 'string') {
            string = '' + string
        }

        var len = string.length
        if (len === 0) return 0

        // Use a for loop to avoid recursion
        var loweredCase = false
        for (;;) {
            switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len
            case 'utf8':
            case 'utf-8':
            case undefined:
                return utf8ToBytes(string).length
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2
            case 'hex':
                return len >>> 1
            case 'base64':
                return base64ToBytes(string).length
            default:
                if (loweredCase) return utf8ToBytes(string).length // assume utf8
                encoding = ('' + encoding).toLowerCase()
                loweredCase = true
            }
        }
    }
    Buffer.byteLength = byteLength

    function slowToString (encoding, start, end) {
        var loweredCase = false

        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.

        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
        if (start === undefined || start < 0) {
            start = 0
        }
        // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.
        if (start > this.length) {
            return ''
        }

        if (end === undefined || end > this.length) {
            end = this.length
        }

        if (end <= 0) {
            return ''
        }

        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
        end >>>= 0
        start >>>= 0

        if (end <= start) {
            return ''
        }

        if (!encoding) encoding = 'utf8'

        while (true) {
            switch (encoding) {
            case 'hex':
                return hexSlice(this, start, end)

            case 'utf8':
            case 'utf-8':
                return utf8Slice(this, start, end)

            case 'ascii':
                return asciiSlice(this, start, end)

            case 'latin1':
            case 'binary':
                return latin1Slice(this, start, end)

            case 'base64':
                return base64Slice(this, start, end)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leSlice(this, start, end)

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                encoding = (encoding + '').toLowerCase()
                loweredCase = true
            }
        }
    }

    // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
    // Buffer instances.
    Buffer.prototype._isBuffer = true

    function swap (b, n, m) {
        var i = b[n]
        b[n] = b[m]
        b[m] = i
    }

    Buffer.prototype.swap16 = function swap16 () {
        var len = this.length
        if (len % 2 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 16-bits')
        }
        for (var i = 0; i < len; i += 2) {
            swap(this, i, i + 1)
        }
        return this
    }

    Buffer.prototype.swap32 = function swap32 () {
        var len = this.length
        if (len % 4 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 32-bits')
        }
        for (var i = 0; i < len; i += 4) {
            swap(this, i, i + 3)
            swap(this, i + 1, i + 2)
        }
        return this
    }

    Buffer.prototype.swap64 = function swap64 () {
        var len = this.length
        if (len % 8 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 64-bits')
        }
        for (var i = 0; i < len; i += 8) {
            swap(this, i, i + 7)
            swap(this, i + 1, i + 6)
            swap(this, i + 2, i + 5)
            swap(this, i + 3, i + 4)
        }
        return this
    }

    Buffer.prototype.toString = function toString () {
        var length = this.length | 0
        if (length === 0) return ''
        if (arguments.length === 0) return utf8Slice(this, 0, length)
        return slowToString.apply(this, arguments)
    }

    Buffer.prototype.equals = function equals (b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
        if (this === b) return true
        return Buffer.compare(this, b) === 0
    }

    Buffer.prototype.inspect = function inspect () {
        var str = ''
        var max = exports.INSPECT_MAX_BYTES
        if (this.length > 0) {
            str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
            if (this.length > max) str += ' ... '
        }
        return '<Buffer ' + str + '>'
    }

    Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) {
            throw new TypeError('Argument must be a Buffer')
        }

        if (start === undefined) {
            start = 0
        }
        if (end === undefined) {
            end = target ? target.length : 0
        }
        if (thisStart === undefined) {
            thisStart = 0
        }
        if (thisEnd === undefined) {
            thisEnd = this.length
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
            throw new RangeError('out of range index')
        }

        if (thisStart >= thisEnd && start >= end) {
            return 0
        }
        if (thisStart >= thisEnd) {
            return -1
        }
        if (start >= end) {
            return 1
        }

        start >>>= 0
        end >>>= 0
        thisStart >>>= 0
        thisEnd >>>= 0

        if (this === target) return 0

        var x = thisEnd - thisStart
        var y = end - start
        var len = Math.min(x, y)

        var thisCopy = this.slice(thisStart, thisEnd)
        var targetCopy = target.slice(start, end)

        for (var i = 0; i < len; ++i) {
            if (thisCopy[i] !== targetCopy[i]) {
                x = thisCopy[i]
                y = targetCopy[i]
                break
            }
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
    }

    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf
    function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1

        // Normalize byteOffset
        if (typeof byteOffset === 'string') {
            encoding = byteOffset
            byteOffset = 0
        } else if (byteOffset > 0x7fffffff) {
            byteOffset = 0x7fffffff
        } else if (byteOffset < -0x80000000) {
            byteOffset = -0x80000000
        }
        byteOffset = +byteOffset  // Coerce to Number.
        if (isNaN(byteOffset)) {
            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
            byteOffset = dir ? 0 : (buffer.length - 1)
        }

        // Normalize byteOffset: negative offsets start from the end of the buffer
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset
        if (byteOffset >= buffer.length) {
            if (dir) return -1
            else byteOffset = buffer.length - 1
        } else if (byteOffset < 0) {
            if (dir) byteOffset = 0
            else return -1
        }

        // Normalize val
        if (typeof val === 'string') {
            val = Buffer.from(val, encoding)
        }

        // Finally, search either indexOf (if dir is true) or lastIndexOf
        if (Buffer.isBuffer(val)) {
            // Special case: looking for empty string/buffer always fails
            if (val.length === 0) {
                return -1
            }
            return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
        } else if (typeof val === 'number') {
            val = val & 0xFF // Search for a byte value [0-255]
            if (Buffer.TYPED_ARRAY_SUPPORT &&
                typeof Uint8Array.prototype.indexOf === 'function') {
                if (dir) {
                    return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                } else {
                    return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                }
            }
            return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
        }

        throw new TypeError('val must be string, number or Buffer')
    }

    function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
        var indexSize = 1
        var arrLength = arr.length
        var valLength = val.length

        if (encoding !== undefined) {
            encoding = String(encoding).toLowerCase()
            if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                encoding === 'utf16le' || encoding === 'utf-16le') {
                if (arr.length < 2 || val.length < 2) {
                    return -1
                }
                indexSize = 2
                arrLength /= 2
                valLength /= 2
                byteOffset /= 2
            }
        }

        function read (buf, i) {
            if (indexSize === 1) {
                return buf[i]
            } else {
                return buf.readUInt16BE(i * indexSize)
            }
        }

        var i
        if (dir) {
            var foundIndex = -1
            for (i = byteOffset; i < arrLength; i++) {
                if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                    if (foundIndex === -1) foundIndex = i
                    if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                } else {
                    if (foundIndex !== -1) i -= i - foundIndex
                    foundIndex = -1
                }
            }
        } else {
            if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
            for (i = byteOffset; i >= 0; i--) {
                var found = true
                for (var j = 0; j < valLength; j++) {
                    if (read(arr, i + j) !== read(val, j)) {
                        found = false
                        break
                    }
                }
                if (found) return i
            }
        }

        return -1
    }

    Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1
    }

    Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
    }

    Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
    }

    function hexWrite (buf, string, offset, length) {
        offset = Number(offset) || 0
        var remaining = buf.length - offset
        if (!length) {
            length = remaining
        } else {
            length = Number(length)
            if (length > remaining) {
                length = remaining
            }
        }

        // must be an even number of digits
        var strLen = string.length
        if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

        if (length > strLen / 2) {
            length = strLen / 2
        }
        for (var i = 0; i < length; ++i) {
            var parsed = parseInt(string.substr(i * 2, 2), 16)
            if (isNaN(parsed)) return i
            buf[offset + i] = parsed
        }
        return i
    }

    function utf8Write (buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
    }

    function asciiWrite (buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length)
    }

    function latin1Write (buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length)
    }

    function base64Write (buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length)
    }

    function ucs2Write (buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
    }

    Buffer.prototype.write = function write (string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
            encoding = 'utf8'
            length = this.length
            offset = 0
            // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
            encoding = offset
            length = this.length
            offset = 0
            // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
            offset = offset | 0
            if (isFinite(length)) {
                length = length | 0
                if (encoding === undefined) encoding = 'utf8'
            } else {
                encoding = length
                length = undefined
            }
            // legacy write(string, encoding, offset, length) - remove in v0.13
        } else {
            throw new Error(
                'Buffer.write(string, encoding, offset[, length]) is no longer supported'
            )
        }

        var remaining = this.length - offset
        if (length === undefined || length > remaining) length = remaining

        if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
            throw new RangeError('Attempt to write outside buffer bounds')
        }

        if (!encoding) encoding = 'utf8'

        var loweredCase = false
        for (;;) {
            switch (encoding) {
            case 'hex':
                return hexWrite(this, string, offset, length)

            case 'utf8':
            case 'utf-8':
                return utf8Write(this, string, offset, length)

            case 'ascii':
                return asciiWrite(this, string, offset, length)

            case 'latin1':
            case 'binary':
                return latin1Write(this, string, offset, length)

            case 'base64':
                // Warning: maxLength not taken into account in base64Write
                return base64Write(this, string, offset, length)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return ucs2Write(this, string, offset, length)

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                encoding = ('' + encoding).toLowerCase()
                loweredCase = true
            }
        }
    }

    Buffer.prototype.toJSON = function toJSON () {
        return {
            type: 'Buffer',
            data: Array.prototype.slice.call(this._arr || this, 0)
        }
    }

    function base64Slice (buf, start, end) {
        if (start === 0 && end === buf.length) {
            return base64.fromByteArray(buf)
        } else {
            return base64.fromByteArray(buf.slice(start, end))
        }
    }

    function utf8Slice (buf, start, end) {
        end = Math.min(buf.length, end)
        var res = []

        var i = start
        while (i < end) {
            var firstByte = buf[i]
            var codePoint = null
            var bytesPerSequence = (firstByte > 0xEF) ? 4
                : (firstByte > 0xDF) ? 3
                : (firstByte > 0xBF) ? 2
                : 1

            if (i + bytesPerSequence <= end) {
                var secondByte, thirdByte, fourthByte, tempCodePoint

                switch (bytesPerSequence) {
                case 1:
                    if (firstByte < 0x80) {
                        codePoint = firstByte
                    }
                    break
                case 2:
                    secondByte = buf[i + 1]
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                        if (tempCodePoint > 0x7F) {
                            codePoint = tempCodePoint
                        }
                    }
                    break
                case 3:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                            codePoint = tempCodePoint
                        }
                    }
                    break
                case 4:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    fourthByte = buf[i + 3]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                            codePoint = tempCodePoint
                        }
                    }
                }
            }

            if (codePoint === null) {
                // we did not generate a valid codePoint so insert a
                // replacement char (U+FFFD) and advance only 1 byte
                codePoint = 0xFFFD
                bytesPerSequence = 1
            } else if (codePoint > 0xFFFF) {
                // encode to utf16 (surrogate pair dance)
                codePoint -= 0x10000
                res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                codePoint = 0xDC00 | codePoint & 0x3FF
            }

            res.push(codePoint)
            i += bytesPerSequence
        }

        return decodeCodePointsArray(res)
    }

    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety
    var MAX_ARGUMENTS_LENGTH = 0x1000

    function decodeCodePointsArray (codePoints) {
        var len = codePoints.length
        if (len <= MAX_ARGUMENTS_LENGTH) {
            return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
        }

        // Decode in chunks to avoid "call stack size exceeded".
        var res = ''
        var i = 0
        while (i < len) {
            res += String.fromCharCode.apply(
                String,
                codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
            )
        }
        return res
    }

    function asciiSlice (buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i] & 0x7F)
        }
        return ret
    }

    function latin1Slice (buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i])
        }
        return ret
    }

    function hexSlice (buf, start, end) {
        var len = buf.length

        if (!start || start < 0) start = 0
        if (!end || end < 0 || end > len) end = len

        var out = ''
        for (var i = start; i < end; ++i) {
            out += toHex(buf[i])
        }
        return out
    }

    function utf16leSlice (buf, start, end) {
        var bytes = buf.slice(start, end)
        var res = ''
        for (var i = 0; i < bytes.length; i += 2) {
            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
        }
        return res
    }

    Buffer.prototype.slice = function slice (start, end) {
        var len = this.length
        start = ~~start
        end = end === undefined ? len : ~~end

        if (start < 0) {
            start += len
            if (start < 0) start = 0
        } else if (start > len) {
            start = len
        }

        if (end < 0) {
            end += len
            if (end < 0) end = 0
        } else if (end > len) {
            end = len
        }

        if (end < start) end = start

        var newBuf
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            newBuf = this.subarray(start, end)
            newBuf.__proto__ = Buffer.prototype
        } else {
            var sliceLen = end - start
            newBuf = new Buffer(sliceLen, undefined)
            for (var i = 0; i < sliceLen; ++i) {
                newBuf[i] = this[i + start]
            }
        }

        return newBuf
    }

    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */
    function checkOffset (offset, ext, length) {
        if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
    }

    Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul
        }

        return val
    }

    Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
            checkOffset(offset, byteLength, this.length)
        }

        var val = this[offset + --byteLength]
        var mul = 1
        while (byteLength > 0 && (mul *= 0x100)) {
            val += this[offset + --byteLength] * mul
        }

        return val
    }

    Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length)
        return this[offset]
    }

    Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        return this[offset] | (this[offset + 1] << 8)
    }

    Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        return (this[offset] << 8) | this[offset + 1]
    }

    Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return ((this[offset]) |
                (this[offset + 1] << 8) |
                (this[offset + 2] << 16)) +
            (this[offset + 3] * 0x1000000)
    }

    Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] * 0x1000000) +
            ((this[offset + 1] << 16) |
             (this[offset + 2] << 8) |
             this[offset + 3])
    }

    Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
    }

    Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var i = byteLength
        var mul = 1
        var val = this[offset + --i]
        while (i > 0 && (mul *= 0x100)) {
            val += this[offset + --i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
    }

    Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length)
        if (!(this[offset] & 0x80)) return (this[offset])
        return ((0xff - this[offset] + 1) * -1)
    }

    Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset] | (this[offset + 1] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
    }

    Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset + 1] | (this[offset] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
    }

    Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset]) |
            (this[offset + 1] << 8) |
            (this[offset + 2] << 16) |
            (this[offset + 3] << 24)
    }

    Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] << 24) |
            (this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            (this[offset + 3])
    }

    Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, true, 23, 4)
    }

    Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, false, 23, 4)
    }

    Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, true, 52, 8)
    }

    Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, false, 52, 8)
    }

    function checkInt (buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
        if (offset + ext > buf.length) throw new RangeError('Index out of range')
    }

    Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1
            checkInt(this, value, offset, byteLength, maxBytes, 0)
        }

        var mul = 1
        var i = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
            this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
    }

    Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        byteLength = byteLength | 0
        if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1
            checkInt(this, value, offset, byteLength, maxBytes, 0)
        }

        var i = byteLength - 1
        var mul = 1
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
            this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
    }

    Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
        this[offset] = (value & 0xff)
        return offset + 1
    }

    function objectWriteUInt16 (buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffff + value + 1
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
            buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                (littleEndian ? i : 1 - i) * 8
        }
    }

    Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
        } else {
            objectWriteUInt16(this, value, offset, true)
        }
        return offset + 2
    }

    Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
        } else {
            objectWriteUInt16(this, value, offset, false)
        }
        return offset + 2
    }

    function objectWriteUInt32 (buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffffffff + value + 1
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
            buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
        }
    }

    Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset + 3] = (value >>> 24)
            this[offset + 2] = (value >>> 16)
            this[offset + 1] = (value >>> 8)
            this[offset] = (value & 0xff)
        } else {
            objectWriteUInt32(this, value, offset, true)
        }
        return offset + 4
    }

    Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
        } else {
            objectWriteUInt32(this, value, offset, false)
        }
        return offset + 4
    }

    Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1)

            checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = 0
        var mul = 1
        var sub = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                sub = 1
            }
            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
    }

    Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1)

            checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = byteLength - 1
        var mul = 1
        var sub = 0
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                sub = 1
            }
            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
    }

    Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
        if (value < 0) value = 0xff + value + 1
        this[offset] = (value & 0xff)
        return offset + 1
    }

    Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
        } else {
            objectWriteUInt16(this, value, offset, true)
        }
        return offset + 2
    }

    Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
        } else {
            objectWriteUInt16(this, value, offset, false)
        }
        return offset + 2
    }

    Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            this[offset + 2] = (value >>> 16)
            this[offset + 3] = (value >>> 24)
        } else {
            objectWriteUInt32(this, value, offset, true)
        }
        return offset + 4
    }

    Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
        value = +value
        offset = offset | 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (value < 0) value = 0xffffffff + value + 1
        if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
        } else {
            objectWriteUInt32(this, value, offset, false)
        }
        return offset + 4
    }

    function checkIEEE754 (buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range')
        if (offset < 0) throw new RangeError('Index out of range')
    }

    function writeFloat (buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
            checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4)
        return offset + 4
    }

    Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert)
    }

    Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert)
    }

    function writeDouble (buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
            checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8)
        return offset + 8
    }

    Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert)
    }

    Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert)
    }

    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function copy (target, targetStart, start, end) {
        if (!start) start = 0
        if (!end && end !== 0) end = this.length
        if (targetStart >= target.length) targetStart = target.length
        if (!targetStart) targetStart = 0
        if (end > 0 && end < start) end = start

        // Copy 0 bytes; we're done
        if (end === start) return 0
        if (target.length === 0 || this.length === 0) return 0

        // Fatal error conditions
        if (targetStart < 0) {
            throw new RangeError('targetStart out of bounds')
        }
        if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
        if (end < 0) throw new RangeError('sourceEnd out of bounds')

        // Are we oob?
        if (end > this.length) end = this.length
        if (target.length - targetStart < end - start) {
            end = target.length - targetStart + start
        }

        var len = end - start
        var i

        if (this === target && start < targetStart && targetStart < end) {
            // descending copy from end
            for (i = len - 1; i >= 0; --i) {
                target[i + targetStart] = this[i + start]
            }
        } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
            // ascending copy from start
            for (i = 0; i < len; ++i) {
                target[i + targetStart] = this[i + start]
            }
        } else {
            Uint8Array.prototype.set.call(
                target,
                this.subarray(start, start + len),
                targetStart
            )
        }

        return len
    }

    // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])
    Buffer.prototype.fill = function fill (val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
            if (typeof start === 'string') {
                encoding = start
                start = 0
                end = this.length
            } else if (typeof end === 'string') {
                encoding = end
                end = this.length
            }
            if (val.length === 1) {
                var code = val.charCodeAt(0)
                if (code < 256) {
                    val = code
                }
            }
            if (encoding !== undefined && typeof encoding !== 'string') {
                throw new TypeError('encoding must be a string')
            }
            if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                throw new TypeError('Unknown encoding: ' + encoding)
            }
        } else if (typeof val === 'number') {
            val = val & 255
        }

        // Invalid ranges are not set to a default, so can range check early.
        if (start < 0 || this.length < start || this.length < end) {
            throw new RangeError('Out of range index')
        }

        if (end <= start) {
            return this
        }

        start = start >>> 0
        end = end === undefined ? this.length : end >>> 0

        if (!val) val = 0

        var i
        if (typeof val === 'number') {
            for (i = start; i < end; ++i) {
                this[i] = val
            }
        } else {
            var bytes = Buffer.isBuffer(val)
                ? val
                : utf8ToBytes(new Buffer(val, encoding).toString())
            var len = bytes.length
            for (i = 0; i < end - start; ++i) {
                this[i + start] = bytes[i % len]
            }
        }

        return this
    }

    // HELPER FUNCTIONS
    // ================

    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

    function base64clean (str) {
        // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = stringtrim(str).replace(INVALID_BASE64_RE, '')
        // Node converts strings with length < 2 to ''
        if (str.length < 2) return ''
        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        while (str.length % 4 !== 0) {
            str = str + '='
        }
        return str
    }

    function stringtrim (str) {
        if (str.trim) return str.trim()
        return str.replace(/^\s+|\s+$/g, '')
    }

    function toHex (n) {
        if (n < 16) return '0' + n.toString(16)
        return n.toString(16)
    }

    function utf8ToBytes (string, units) {
        units = units || Infinity
        var codePoint
        var length = string.length
        var leadSurrogate = null
        var bytes = []

        for (var i = 0; i < length; ++i) {
            codePoint = string.charCodeAt(i)

            // is surrogate component
            if (codePoint > 0xD7FF && codePoint < 0xE000) {
                // last char was a lead
                if (!leadSurrogate) {
                    // no lead yet
                    if (codePoint > 0xDBFF) {
                        // unexpected trail
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                        continue
                    } else if (i + 1 === length) {
                        // unpaired lead
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                        continue
                    }

                    // valid lead
                    leadSurrogate = codePoint

                    continue
                }

                // 2 leads in a row
                if (codePoint < 0xDC00) {
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    leadSurrogate = codePoint
                    continue
                }

                // valid surrogate pair
                codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
            } else if (leadSurrogate) {
                // valid bmp char, but last char was a lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            }

            leadSurrogate = null

            // encode utf8
            if (codePoint < 0x80) {
                if ((units -= 1) < 0) break
                bytes.push(codePoint)
            } else if (codePoint < 0x800) {
                if ((units -= 2) < 0) break
                bytes.push(
                    codePoint >> 0x6 | 0xC0,
                    codePoint & 0x3F | 0x80
                )
            } else if (codePoint < 0x10000) {
                if ((units -= 3) < 0) break
                bytes.push(
                    codePoint >> 0xC | 0xE0,
                    codePoint >> 0x6 & 0x3F | 0x80,
                    codePoint & 0x3F | 0x80
                )
            } else if (codePoint < 0x110000) {
                if ((units -= 4) < 0) break
                bytes.push(
                    codePoint >> 0x12 | 0xF0,
                    codePoint >> 0xC & 0x3F | 0x80,
                    codePoint >> 0x6 & 0x3F | 0x80,
                    codePoint & 0x3F | 0x80
                )
            } else {
                throw new Error('Invalid code point')
            }
        }

        return bytes
    }

    function asciiToBytes (str) {
        var byteArray = []
        for (var i = 0; i < str.length; ++i) {
            // Node's code seems to be doing this and not & 0x7F..
            byteArray.push(str.charCodeAt(i) & 0xFF)
        }
        return byteArray
    }

    function utf16leToBytes (str, units) {
        var c, hi, lo
        var byteArray = []
        for (var i = 0; i < str.length; ++i) {
            if ((units -= 2) < 0) break

            c = str.charCodeAt(i)
            hi = c >> 8
            lo = c % 256
            byteArray.push(lo)
            byteArray.push(hi)
        }

        return byteArray
    }

    function base64ToBytes (str) {
        return base64.toByteArray(base64clean(str))
    }

    function blitBuffer (src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
            if ((i + offset >= dst.length) || (i >= src.length)) break
            dst[i + offset] = src[i]
        }
        return i
    }

    function isnan (val) {
        return val !== val // eslint-disable-line no-self-compare
    }

    var exports = {}
    exports.Buffer = Buffer
    exports.SlowBuffer = SlowBuffer
    exports.INSPECT_MAX_BYTES = 50

    var global = window;
    Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
        ? global.TYPED_ARRAY_SUPPORT
        : typedArraySupport()

    /*
     * Export kMaxLength after typed array support is determined.
     */
    exports.kMaxLength = kMaxLength()

    return exports
}();


/*! bignumber.js v2.4.0 https://github.com/MikeMcl/bignumber.js/LICENCE */

;(function (globalObj) {
    'use strict';

    /*
      bignumber.js v2.4.0
      A JavaScript library for arbitrary-precision arithmetic.
      https://github.com/MikeMcl/bignumber.js
      Copyright (c) 2016 Michael Mclaughlin <M8ch88l@gmail.com>
      MIT Expat Licence
    */


    var BigNumber, cryptoObj, parseNumeric,
        isNumeric = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        mathceil = Math.ceil,
        mathfloor = Math.floor,
        notBool = ' not a boolean or binary digit',
        roundingMode = 'rounding mode',
        tooManyDigits = 'number type has more than 15 significant digits',
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
        BASE = 1e14,
        LOG_BASE = 14,
        MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
        // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
        POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
        SQRT_BASE = 1e7,

        /*
         * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
         * the arguments to toExponential, toFixed, toFormat, and toPrecision, beyond which an
         * exception is thrown (if ERRORS is true).
         */
        MAX = 1E9;                                   // 0 to MAX_INT32

    if ( typeof crypto != 'undefined' ) cryptoObj = crypto;


    /*
     * Create and return a BigNumber constructor.
     */
    function constructorFactory(configObj) {
        var div,

            // id tracks the caller function, so its name can be included in error messages.
            id = 0,
            P = BigNumber.prototype,
            ONE = new BigNumber(1),


            /********************************* EDITABLE DEFAULTS **********************************/


            /*
             * The default values below must be integers within the inclusive ranges stated.
             * The values can also be changed at run-time using BigNumber.config.
             */

            // The maximum number of decimal places for operations involving division.
            DECIMAL_PLACES = 20,                     // 0 to MAX

            /*
             * The rounding mode used when rounding to the above decimal places, and when using
             * toExponential, toFixed, toFormat and toPrecision, and round (default value).
             * UP         0 Away from zero.
             * DOWN       1 Towards zero.
             * CEIL       2 Towards +Infinity.
             * FLOOR      3 Towards -Infinity.
             * HALF_UP    4 Towards nearest neighbour. If equidistant, up.
             * HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
             * HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
             * HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
             * HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
             */
            ROUNDING_MODE = 4,                       // 0 to 8

            // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

            // The exponent value at and beneath which toString returns exponential notation.
            // Number type: -7
            TO_EXP_NEG = -7,                         // 0 to -MAX

            // The exponent value at and above which toString returns exponential notation.
            // Number type: 21
            TO_EXP_POS = 21,                         // 0 to MAX

            // RANGE : [MIN_EXP, MAX_EXP]

            // The minimum exponent value, beneath which underflow to zero occurs.
            // Number type: -324  (5e-324)
            MIN_EXP = -1e7,                          // -1 to -MAX

            // The maximum exponent value, above which overflow to Infinity occurs.
            // Number type:  308  (1.7976931348623157e+308)
            // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
            MAX_EXP = 1e7,                           // 1 to MAX

            // Whether BigNumber Errors are ever thrown.
            ERRORS = true,                           // true or false

            // Change to intValidatorNoErrors if ERRORS is false.
            isValidInt = intValidatorWithErrors,     // intValidatorWithErrors/intValidatorNoErrors

            // Whether to use cryptographically-secure random number generation, if available.
            CRYPTO = false,                          // true or false

            /*
             * The modulo mode used when calculating the modulus: a mod n.
             * The quotient (q = a / n) is calculated according to the corresponding rounding mode.
             * The remainder (r) is calculated as: r = a - n * q.
             *
             * UP        0 The remainder is positive if the dividend is negative, else is negative.
             * DOWN      1 The remainder has the same sign as the dividend.
             *             This modulo mode is commonly known as 'truncated division' and is
             *             equivalent to (a % n) in JavaScript.
             * FLOOR     3 The remainder has the same sign as the divisor (Python %).
             * HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
             * EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
             *             The remainder is always positive.
             *
             * The truncated division, floored division, Euclidian division and IEEE 754 remainder
             * modes are commonly used for the modulus operation.
             * Although the other rounding modes can also be used, they may not give useful results.
             */
            MODULO_MODE = 1,                         // 0 to 9

            // The maximum number of significant digits of the result of the toPower operation.
            // If POW_PRECISION is 0, there will be unlimited significant digits.
            POW_PRECISION = 100,                     // 0 to MAX

            // The format specification used by the BigNumber.prototype.toFormat method.
            FORMAT = {
                decimalSeparator: '.',
                groupSeparator: ',',
                groupSize: 3,
                secondaryGroupSize: 0,
                fractionGroupSeparator: '\xA0',      // non-breaking space
                fractionGroupSize: 0
            };


        /******************************************************************************************/


        // CONSTRUCTOR


        /*
         * The BigNumber constructor and exported function.
         * Create and return a new instance of a BigNumber object.
         *
         * n {number|string|BigNumber} A numeric value.
         * [b] {number} The base of n. Integer, 2 to 64 inclusive.
         */
        function BigNumber( n, b ) {
            var c, e, i, num, len, str,
                x = this;

            // Enable constructor usage without new.
            if ( !( x instanceof BigNumber ) ) {

                // 'BigNumber() constructor call without new: {n}'
                if (ERRORS) raise( 26, 'constructor call without new', n );
                return new BigNumber( n, b );
            }

            // 'new BigNumber() base not an integer: {b}'
            // 'new BigNumber() base out of range: {b}'
            if ( b == null || !isValidInt( b, 2, 64, id, 'base' ) ) {

                // Duplicate.
                if ( n instanceof BigNumber ) {
                    x.s = n.s;
                    x.e = n.e;
                    x.c = ( n = n.c ) ? n.slice() : n;
                    id = 0;
                    return;
                }

                if ( ( num = typeof n == 'number' ) && n * 0 == 0 ) {
                    x.s = 1 / n < 0 ? ( n = -n, -1 ) : 1;

                    // Fast path for integers.
                    if ( n === ~~n ) {
                        for ( e = 0, i = n; i >= 10; i /= 10, e++ );
                        x.e = e;
                        x.c = [n];
                        id = 0;
                        return;
                    }

                    str = n + '';
                } else {
                    if ( !isNumeric.test( str = n + '' ) ) return parseNumeric( x, str, num );
                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
                }
            } else {
                b = b | 0;
                str = n + '';

                // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
                // Allow exponential notation to be used with base 10 argument.
                if ( b == 10 ) {
                    x = new BigNumber( n instanceof BigNumber ? n : str );
                    return round( x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE );
                }

                // Avoid potential interpretation of Infinity and NaN as base 44+ values.
                // Any number in exponential form will fail due to the [Ee][+-].
                if ( ( num = typeof n == 'number' ) && n * 0 != 0 ||
                  !( new RegExp( '^-?' + ( c = '[' + ALPHABET.slice( 0, b ) + ']+' ) +
                    '(?:\\.' + c + ')?$',b < 37 ? 'i' : '' ) ).test(str) ) {
                    return parseNumeric( x, str, num, b );
                }

                if (num) {
                    x.s = 1 / n < 0 ? ( str = str.slice(1), -1 ) : 1;

                    if ( ERRORS && str.replace( /^0\.0*|\./, '' ).length > 15 ) {

                        // 'new BigNumber() number type has more than 15 significant digits: {n}'
                        raise( id, tooManyDigits, n );
                    }

                    // Prevent later check for length on converted number.
                    num = false;
                } else {
                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
                }

                str = convertBase( str, 10, b, x.s );
            }

            // Decimal point?
            if ( ( e = str.indexOf('.') ) > -1 ) str = str.replace( '.', '' );

            // Exponential form?
            if ( ( i = str.search( /e/i ) ) > 0 ) {

                // Determine exponent.
                if ( e < 0 ) e = i;
                e += +str.slice( i + 1 );
                str = str.substring( 0, i );
            } else if ( e < 0 ) {

                // Integer.
                e = str.length;
            }

            // Determine leading zeros.
            for ( i = 0; str.charCodeAt(i) === 48; i++ );

            // Determine trailing zeros.
            for ( len = str.length; str.charCodeAt(--len) === 48; );
            str = str.slice( i, len + 1 );

            if (str) {
                len = str.length;

                // Disallow numbers with over 15 significant digits if number type.
                // 'new BigNumber() number type has more than 15 significant digits: {n}'
                if ( num && ERRORS && len > 15 && ( n > MAX_SAFE_INTEGER || n !== mathfloor(n) ) ) {
                    raise( id, tooManyDigits, x.s * n );
                }

                e = e - i - 1;

                 // Overflow?
                if ( e > MAX_EXP ) {

                    // Infinity.
                    x.c = x.e = null;

                // Underflow?
                } else if ( e < MIN_EXP ) {

                    // Zero.
                    x.c = [ x.e = 0 ];
                } else {
                    x.e = e;
                    x.c = [];

                    // Transform base

                    // e is the base 10 exponent.
                    // i is where to slice str to get the first element of the coefficient array.
                    i = ( e + 1 ) % LOG_BASE;
                    if ( e < 0 ) i += LOG_BASE;

                    if ( i < len ) {
                        if (i) x.c.push( +str.slice( 0, i ) );

                        for ( len -= LOG_BASE; i < len; ) {
                            x.c.push( +str.slice( i, i += LOG_BASE ) );
                        }

                        str = str.slice(i);
                        i = LOG_BASE - str.length;
                    } else {
                        i -= len;
                    }

                    for ( ; i--; str += '0' );
                    x.c.push( +str );
                }
            } else {

                // Zero.
                x.c = [ x.e = 0 ];
            }

            id = 0;
        }


        // CONSTRUCTOR PROPERTIES


        BigNumber.another = constructorFactory;

        BigNumber.ROUND_UP = 0;
        BigNumber.ROUND_DOWN = 1;
        BigNumber.ROUND_CEIL = 2;
        BigNumber.ROUND_FLOOR = 3;
        BigNumber.ROUND_HALF_UP = 4;
        BigNumber.ROUND_HALF_DOWN = 5;
        BigNumber.ROUND_HALF_EVEN = 6;
        BigNumber.ROUND_HALF_CEIL = 7;
        BigNumber.ROUND_HALF_FLOOR = 8;
        BigNumber.EUCLID = 9;


        /*
         * Configure infrequently-changing library-wide settings.
         *
         * Accept an object or an argument list, with one or many of the following properties or
         * parameters respectively:
         *
         *   DECIMAL_PLACES  {number}  Integer, 0 to MAX inclusive
         *   ROUNDING_MODE   {number}  Integer, 0 to 8 inclusive
         *   EXPONENTIAL_AT  {number|number[]}  Integer, -MAX to MAX inclusive or
         *                                      [integer -MAX to 0 incl., 0 to MAX incl.]
         *   RANGE           {number|number[]}  Non-zero integer, -MAX to MAX inclusive or
         *                                      [integer -MAX to -1 incl., integer 1 to MAX incl.]
         *   ERRORS          {boolean|number}   true, false, 1 or 0
         *   CRYPTO          {boolean|number}   true, false, 1 or 0
         *   MODULO_MODE     {number}           0 to 9 inclusive
         *   POW_PRECISION   {number}           0 to MAX inclusive
         *   FORMAT          {object}           See BigNumber.prototype.toFormat
         *      decimalSeparator       {string}
         *      groupSeparator         {string}
         *      groupSize              {number}
         *      secondaryGroupSize     {number}
         *      fractionGroupSeparator {string}
         *      fractionGroupSize      {number}
         *
         * (The values assigned to the above FORMAT object properties are not checked for validity.)
         *
         * E.g.
         * BigNumber.config(20, 4) is equivalent to
         * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
         *
         * Ignore properties/parameters set to null or undefined.
         * Return an object with the properties current values.
         */
        BigNumber.config = function () {
            var v, p,
                i = 0,
                r = {},
                a = arguments,
                o = a[0],
                has = o && typeof o == 'object'
                  ? function () { if ( o.hasOwnProperty(p) ) return ( v = o[p] ) != null; }
                  : function () { if ( a.length > i ) return ( v = a[i++] ) != null; };

            // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
            // 'config() DECIMAL_PLACES not an integer: {v}'
            // 'config() DECIMAL_PLACES out of range: {v}'
            if ( has( p = 'DECIMAL_PLACES' ) && isValidInt( v, 0, MAX, 2, p ) ) {
                DECIMAL_PLACES = v | 0;
            }
            r[p] = DECIMAL_PLACES;

            // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
            // 'config() ROUNDING_MODE not an integer: {v}'
            // 'config() ROUNDING_MODE out of range: {v}'
            if ( has( p = 'ROUNDING_MODE' ) && isValidInt( v, 0, 8, 2, p ) ) {
                ROUNDING_MODE = v | 0;
            }
            r[p] = ROUNDING_MODE;

            // EXPONENTIAL_AT {number|number[]}
            // Integer, -MAX to MAX inclusive or [integer -MAX to 0 inclusive, 0 to MAX inclusive].
            // 'config() EXPONENTIAL_AT not an integer: {v}'
            // 'config() EXPONENTIAL_AT out of range: {v}'
            if ( has( p = 'EXPONENTIAL_AT' ) ) {

                if ( isArray(v) ) {
                    if ( isValidInt( v[0], -MAX, 0, 2, p ) && isValidInt( v[1], 0, MAX, 2, p ) ) {
                        TO_EXP_NEG = v[0] | 0;
                        TO_EXP_POS = v[1] | 0;
                    }
                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
                    TO_EXP_NEG = -( TO_EXP_POS = ( v < 0 ? -v : v ) | 0 );
                }
            }
            r[p] = [ TO_EXP_NEG, TO_EXP_POS ];

            // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
            // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
            // 'config() RANGE not an integer: {v}'
            // 'config() RANGE cannot be zero: {v}'
            // 'config() RANGE out of range: {v}'
            if ( has( p = 'RANGE' ) ) {

                if ( isArray(v) ) {
                    if ( isValidInt( v[0], -MAX, -1, 2, p ) && isValidInt( v[1], 1, MAX, 2, p ) ) {
                        MIN_EXP = v[0] | 0;
                        MAX_EXP = v[1] | 0;
                    }
                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
                    if ( v | 0 ) MIN_EXP = -( MAX_EXP = ( v < 0 ? -v : v ) | 0 );
                    else if (ERRORS) raise( 2, p + ' cannot be zero', v );
                }
            }
            r[p] = [ MIN_EXP, MAX_EXP ];

            // ERRORS {boolean|number} true, false, 1 or 0.
            // 'config() ERRORS not a boolean or binary digit: {v}'
            if ( has( p = 'ERRORS' ) ) {

                if ( v === !!v || v === 1 || v === 0 ) {
                    id = 0;
                    isValidInt = ( ERRORS = !!v ) ? intValidatorWithErrors : intValidatorNoErrors;
                } else if (ERRORS) {
                    raise( 2, p + notBool, v );
                }
            }
            r[p] = ERRORS;

            // CRYPTO {boolean|number} true, false, 1 or 0.
            // 'config() CRYPTO not a boolean or binary digit: {v}'
            // 'config() crypto unavailable: {crypto}'
            if ( has( p = 'CRYPTO' ) ) {

                if ( v === !!v || v === 1 || v === 0 ) {
                    CRYPTO = !!( v && cryptoObj );
                    if ( v && !CRYPTO && ERRORS ) raise( 2, 'crypto unavailable', cryptoObj );
                } else if (ERRORS) {
                    raise( 2, p + notBool, v );
                }
            }
            r[p] = CRYPTO;

            // MODULO_MODE {number} Integer, 0 to 9 inclusive.
            // 'config() MODULO_MODE not an integer: {v}'
            // 'config() MODULO_MODE out of range: {v}'
            if ( has( p = 'MODULO_MODE' ) && isValidInt( v, 0, 9, 2, p ) ) {
                MODULO_MODE = v | 0;
            }
            r[p] = MODULO_MODE;

            // POW_PRECISION {number} Integer, 0 to MAX inclusive.
            // 'config() POW_PRECISION not an integer: {v}'
            // 'config() POW_PRECISION out of range: {v}'
            if ( has( p = 'POW_PRECISION' ) && isValidInt( v, 0, MAX, 2, p ) ) {
                POW_PRECISION = v | 0;
            }
            r[p] = POW_PRECISION;

            // FORMAT {object}
            // 'config() FORMAT not an object: {v}'
            if ( has( p = 'FORMAT' ) ) {

                if ( typeof v == 'object' ) {
                    FORMAT = v;
                } else if (ERRORS) {
                    raise( 2, p + ' not an object', v );
                }
            }
            r[p] = FORMAT;

            return r;
        };


        /*
         * Return a new BigNumber whose value is the maximum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.max = function () { return maxOrMin( arguments, P.lt ); };


        /*
         * Return a new BigNumber whose value is the minimum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.min = function () { return maxOrMin( arguments, P.gt ); };


        /*
         * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
         * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
         * zeros are produced).
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         *
         * 'random() decimal places not an integer: {dp}'
         * 'random() decimal places out of range: {dp}'
         * 'random() crypto unavailable: {crypto}'
         */
        BigNumber.random = (function () {
            var pow2_53 = 0x20000000000000;

            // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
            // Check if Math.random() produces more than 32 bits of randomness.
            // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
            // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
            var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
              ? function () { return mathfloor( Math.random() * pow2_53 ); }
              : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
                  (Math.random() * 0x800000 | 0); };

            return function (dp) {
                var a, b, e, k, v,
                    i = 0,
                    c = [],
                    rand = new BigNumber(ONE);

                dp = dp == null || !isValidInt( dp, 0, MAX, 14 ) ? DECIMAL_PLACES : dp | 0;
                k = mathceil( dp / LOG_BASE );

                if (CRYPTO) {

                    // Browsers supporting crypto.getRandomValues.
                    if ( cryptoObj && cryptoObj.getRandomValues ) {

                        a = cryptoObj.getRandomValues( new Uint32Array( k *= 2 ) );

                        for ( ; i < k; ) {

                            // 53 bits:
                            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                            //                                     11111 11111111 11111111
                            // 0x20000 is 2^21.
                            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

                            // Rejection sampling:
                            // 0 <= v < 9007199254740992
                            // Probability that v >= 9e15, is
                            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                            if ( v >= 9e15 ) {
                                b = cryptoObj.getRandomValues( new Uint32Array(2) );
                                a[i] = b[0];
                                a[i + 1] = b[1];
                            } else {

                                // 0 <= v <= 8999999999999999
                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push( v % 1e14 );
                                i += 2;
                            }
                        }
                        i = k / 2;

                    // Node.js supporting crypto.randomBytes.
                    } else if ( cryptoObj && cryptoObj.randomBytes ) {

                        // buffer
                        a = cryptoObj.randomBytes( k *= 7 );

                        for ( ; i < k; ) {

                            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                            // 0x100000000 is 2^32, 0x1000000 is 2^24
                            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                            // 0 <= v < 9007199254740992
                            v = ( ( a[i] & 31 ) * 0x1000000000000 ) + ( a[i + 1] * 0x10000000000 ) +
                                  ( a[i + 2] * 0x100000000 ) + ( a[i + 3] * 0x1000000 ) +
                                  ( a[i + 4] << 16 ) + ( a[i + 5] << 8 ) + a[i + 6];

                            if ( v >= 9e15 ) {
                                cryptoObj.randomBytes(7).copy( a, i );
                            } else {

                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push( v % 1e14 );
                                i += 7;
                            }
                        }
                        i = k / 7;
                    } else if (ERRORS) {
                        raise( 14, 'crypto unavailable', cryptoObj );
                    }
                }

                // Use Math.random: CRYPTO is false or crypto is unavailable and ERRORS is false.
                if (!i) {

                    for ( ; i < k; ) {
                        v = random53bitInt();
                        if ( v < 9e15 ) c[i++] = v % 1e14;
                    }
                }

                k = c[--i];
                dp %= LOG_BASE;

                // Convert trailing digits to zeros according to dp.
                if ( k && dp ) {
                    v = POWS_TEN[LOG_BASE - dp];
                    c[i] = mathfloor( k / v ) * v;
                }

                // Remove trailing elements which are zero.
                for ( ; c[i] === 0; c.pop(), i-- );

                // Zero?
                if ( i < 0 ) {
                    c = [ e = 0 ];
                } else {

                    // Remove leading elements which are zero and adjust exponent accordingly.
                    for ( e = -1 ; c[0] === 0; c.shift(), e -= LOG_BASE);

                    // Count the digits of the first element of c to determine leading zeros, and...
                    for ( i = 1, v = c[0]; v >= 10; v /= 10, i++);

                    // adjust the exponent accordingly.
                    if ( i < LOG_BASE ) e -= LOG_BASE - i;
                }

                rand.e = e;
                rand.c = c;
                return rand;
            };
        })();


        // PRIVATE FUNCTIONS


        // Convert a numeric string of baseIn to a numeric string of baseOut.
        function convertBase( str, baseOut, baseIn, sign ) {
            var d, e, k, r, x, xc, y,
                i = str.indexOf( '.' ),
                dp = DECIMAL_PLACES,
                rm = ROUNDING_MODE;

            if ( baseIn < 37 ) str = str.toLowerCase();

            // Non-integer.
            if ( i >= 0 ) {
                k = POW_PRECISION;

                // Unlimited precision.
                POW_PRECISION = 0;
                str = str.replace( '.', '' );
                y = new BigNumber(baseIn);
                x = y.pow( str.length - i );
                POW_PRECISION = k;

                // Convert str as if an integer, then restore the fraction part by dividing the
                // result by its base raised to a power.
                y.c = toBaseOut( toFixedPoint( coeffToString( x.c ), x.e ), 10, baseOut );
                y.e = y.c.length;
            }

            // Convert the number as integer.
            xc = toBaseOut( str, baseIn, baseOut );
            e = k = xc.length;

            // Remove trailing zeros.
            for ( ; xc[--k] == 0; xc.pop() );
            if ( !xc[0] ) return '0';

            if ( i < 0 ) {
                --e;
            } else {
                x.c = xc;
                x.e = e;

                // sign is needed for correct rounding.
                x.s = sign;
                x = div( x, y, dp, rm, baseOut );
                xc = x.c;
                r = x.r;
                e = x.e;
            }

            d = e + dp + 1;

            // The rounding digit, i.e. the digit to the right of the digit that may be rounded up.
            i = xc[d];
            k = baseOut / 2;
            r = r || d < 0 || xc[d + 1] != null;

            r = rm < 4 ? ( i != null || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
                       : i > k || i == k &&( rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                         rm == ( x.s < 0 ? 8 : 7 ) );

            if ( d < 1 || !xc[0] ) {

                // 1^-dp or 0.
                str = r ? toFixedPoint( '1', -dp ) : '0';
            } else {
                xc.length = d;

                if (r) {

                    // Rounding up may mean the previous digit has to be rounded up and so on.
                    for ( --baseOut; ++xc[--d] > baseOut; ) {
                        xc[d] = 0;

                        if ( !d ) {
                            ++e;
                            xc.unshift(1);
                        }
                    }
                }

                // Determine trailing zeros.
                for ( k = xc.length; !xc[--k]; );

                // E.g. [4, 11, 15] becomes 4bf.
                for ( i = 0, str = ''; i <= k; str += ALPHABET.charAt( xc[i++] ) );
                str = toFixedPoint( str, e );
            }

            // The caller will add the sign.
            return str;
        }


        // Perform division in the specified base. Called by div and convertBase.
        div = (function () {

            // Assume non-zero x and k.
            function multiply( x, k, base ) {
                var m, temp, xlo, xhi,
                    carry = 0,
                    i = x.length,
                    klo = k % SQRT_BASE,
                    khi = k / SQRT_BASE | 0;

                for ( x = x.slice(); i--; ) {
                    xlo = x[i] % SQRT_BASE;
                    xhi = x[i] / SQRT_BASE | 0;
                    m = khi * xlo + xhi * klo;
                    temp = klo * xlo + ( ( m % SQRT_BASE ) * SQRT_BASE ) + carry;
                    carry = ( temp / base | 0 ) + ( m / SQRT_BASE | 0 ) + khi * xhi;
                    x[i] = temp % base;
                }

                if (carry) x.unshift(carry);

                return x;
            }

            function compare( a, b, aL, bL ) {
                var i, cmp;

                if ( aL != bL ) {
                    cmp = aL > bL ? 1 : -1;
                } else {

                    for ( i = cmp = 0; i < aL; i++ ) {

                        if ( a[i] != b[i] ) {
                            cmp = a[i] > b[i] ? 1 : -1;
                            break;
                        }
                    }
                }
                return cmp;
            }

            function subtract( a, b, aL, base ) {
                var i = 0;

                // Subtract b from a.
                for ( ; aL--; ) {
                    a[aL] -= i;
                    i = a[aL] < b[aL] ? 1 : 0;
                    a[aL] = i * base + a[aL] - b[aL];
                }

                // Remove leading zeros.
                for ( ; !a[0] && a.length > 1; a.shift() );
            }

            // x: dividend, y: divisor.
            return function ( x, y, dp, rm, base ) {
                var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
                    yL, yz,
                    s = x.s == y.s ? 1 : -1,
                    xc = x.c,
                    yc = y.c;

                // Either NaN, Infinity or 0?
                if ( !xc || !xc[0] || !yc || !yc[0] ) {

                    return new BigNumber(

                      // Return NaN if either NaN, or both Infinity or 0.
                      !x.s || !y.s || ( xc ? yc && xc[0] == yc[0] : !yc ) ? NaN :

                        // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                        xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                    );
                }

                q = new BigNumber(s);
                qc = q.c = [];
                e = x.e - y.e;
                s = dp + e + 1;

                if ( !base ) {
                    base = BASE;
                    e = bitFloor( x.e / LOG_BASE ) - bitFloor( y.e / LOG_BASE );
                    s = s / LOG_BASE | 0;
                }

                // Result exponent may be one less then the current value of e.
                // The coefficients of the BigNumbers from convertBase may have trailing zeros.
                for ( i = 0; yc[i] == ( xc[i] || 0 ); i++ );
                if ( yc[i] > ( xc[i] || 0 ) ) e--;

                if ( s < 0 ) {
                    qc.push(1);
                    more = true;
                } else {
                    xL = xc.length;
                    yL = yc.length;
                    i = 0;
                    s += 2;

                    // Normalise xc and yc so highest order digit of yc is >= base / 2.

                    n = mathfloor( base / ( yc[0] + 1 ) );

                    // Not necessary, but to handle odd bases where yc[0] == ( base / 2 ) - 1.
                    // if ( n > 1 || n++ == 1 && yc[0] < base / 2 ) {
                    if ( n > 1 ) {
                        yc = multiply( yc, n, base );
                        xc = multiply( xc, n, base );
                        yL = yc.length;
                        xL = xc.length;
                    }

                    xi = yL;
                    rem = xc.slice( 0, yL );
                    remL = rem.length;

                    // Add zeros to make remainder as long as divisor.
                    for ( ; remL < yL; rem[remL++] = 0 );
                    yz = yc.slice();
                    yz.unshift(0);
                    yc0 = yc[0];
                    if ( yc[1] >= base / 2 ) yc0++;
                    // Not necessary, but to prevent trial digit n > base, when using base 3.
                    // else if ( base == 3 && yc0 == 1 ) yc0 = 1 + 1e-15;

                    do {
                        n = 0;

                        // Compare divisor and remainder.
                        cmp = compare( yc, rem, yL, remL );

                        // If divisor < remainder.
                        if ( cmp < 0 ) {

                            // Calculate trial digit, n.

                            rem0 = rem[0];
                            if ( yL != remL ) rem0 = rem0 * base + ( rem[1] || 0 );

                            // n is how many times the divisor goes into the current remainder.
                            n = mathfloor( rem0 / yc0 );

                            //  Algorithm:
                            //  1. product = divisor * trial digit (n)
                            //  2. if product > remainder: product -= divisor, n--
                            //  3. remainder -= product
                            //  4. if product was < remainder at 2:
                            //    5. compare new remainder and divisor
                            //    6. If remainder > divisor: remainder -= divisor, n++

                            if ( n > 1 ) {

                                // n may be > base only when base is 3.
                                if (n >= base) n = base - 1;

                                // product = divisor * trial digit.
                                prod = multiply( yc, n, base );
                                prodL = prod.length;
                                remL = rem.length;

                                // Compare product and remainder.
                                // If product > remainder.
                                // Trial digit n too high.
                                // n is 1 too high about 5% of the time, and is not known to have
                                // ever been more than 1 too high.
                                while ( compare( prod, rem, prodL, remL ) == 1 ) {
                                    n--;

                                    // Subtract divisor from product.
                                    subtract( prod, yL < prodL ? yz : yc, prodL, base );
                                    prodL = prod.length;
                                    cmp = 1;
                                }
                            } else {

                                // n is 0 or 1, cmp is -1.
                                // If n is 0, there is no need to compare yc and rem again below,
                                // so change cmp to 1 to avoid it.
                                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                                if ( n == 0 ) {

                                    // divisor < remainder, so n must be at least 1.
                                    cmp = n = 1;
                                }

                                // product = divisor
                                prod = yc.slice();
                                prodL = prod.length;
                            }

                            if ( prodL < remL ) prod.unshift(0);

                            // Subtract product from remainder.
                            subtract( rem, prod, remL, base );
                            remL = rem.length;

                             // If product was < remainder.
                            if ( cmp == -1 ) {

                                // Compare divisor and new remainder.
                                // If divisor < new remainder, subtract divisor from remainder.
                                // Trial digit n too low.
                                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                                while ( compare( yc, rem, yL, remL ) < 1 ) {
                                    n++;

                                    // Subtract divisor from remainder.
                                    subtract( rem, yL < remL ? yz : yc, remL, base );
                                    remL = rem.length;
                                }
                            }
                        } else if ( cmp === 0 ) {
                            n++;
                            rem = [0];
                        } // else cmp === 1 and n will be 0

                        // Add the next digit, n, to the result array.
                        qc[i++] = n;

                        // Update the remainder.
                        if ( rem[0] ) {
                            rem[remL++] = xc[xi] || 0;
                        } else {
                            rem = [ xc[xi] ];
                            remL = 1;
                        }
                    } while ( ( xi++ < xL || rem[0] != null ) && s-- );

                    more = rem[0] != null;

                    // Leading zero?
                    if ( !qc[0] ) qc.shift();
                }

                if ( base == BASE ) {

                    // To calculate q.e, first get the number of digits of qc[0].
                    for ( i = 1, s = qc[0]; s >= 10; s /= 10, i++ );
                    round( q, dp + ( q.e = i + e * LOG_BASE - 1 ) + 1, rm, more );

                // Caller is convertBase.
                } else {
                    q.e = e;
                    q.r = +more;
                }

                return q;
            };
        })();


        /*
         * Return a string representing the value of BigNumber n in fixed-point or exponential
         * notation rounded to the specified decimal places or significant digits.
         *
         * n is a BigNumber.
         * i is the index of the last digit required (i.e. the digit that may be rounded up).
         * rm is the rounding mode.
         * caller is caller id: toExponential 19, toFixed 20, toFormat 21, toPrecision 24.
         */
        function format( n, i, rm, caller ) {
            var c0, e, ne, len, str;

            rm = rm != null && isValidInt( rm, 0, 8, caller, roundingMode )
              ? rm | 0 : ROUNDING_MODE;

            if ( !n.c ) return n.toString();
            c0 = n.c[0];
            ne = n.e;

            if ( i == null ) {
                str = coeffToString( n.c );
                str = caller == 19 || caller == 24 && ne <= TO_EXP_NEG
                  ? toExponential( str, ne )
                  : toFixedPoint( str, ne );
            } else {
                n = round( new BigNumber(n), i, rm );

                // n.e may have changed if the value was rounded up.
                e = n.e;

                str = coeffToString( n.c );
                len = str.length;

                // toPrecision returns exponential notation if the number of significant digits
                // specified is less than the number of digits necessary to represent the integer
                // part of the value in fixed-point notation.

                // Exponential notation.
                if ( caller == 19 || caller == 24 && ( i <= e || e <= TO_EXP_NEG ) ) {

                    // Append zeros?
                    for ( ; len < i; str += '0', len++ );
                    str = toExponential( str, e );

                // Fixed-point notation.
                } else {
                    i -= ne;
                    str = toFixedPoint( str, e );

                    // Append zeros?
                    if ( e + 1 > len ) {
                        if ( --i > 0 ) for ( str += '.'; i--; str += '0' );
                    } else {
                        i += e - len;
                        if ( i > 0 ) {
                            if ( e + 1 == len ) str += '.';
                            for ( ; i--; str += '0' );
                        }
                    }
                }
            }

            return n.s < 0 && c0 ? '-' + str : str;
        }


        // Handle BigNumber.max and BigNumber.min.
        function maxOrMin( args, method ) {
            var m, n,
                i = 0;

            if ( isArray( args[0] ) ) args = args[0];
            m = new BigNumber( args[0] );

            for ( ; ++i < args.length; ) {
                n = new BigNumber( args[i] );

                // If any number is NaN, return NaN.
                if ( !n.s ) {
                    m = n;
                    break;
                } else if ( method.call( m, n ) ) {
                    m = n;
                }
            }

            return m;
        }


        /*
         * Return true if n is an integer in range, otherwise throw.
         * Use for argument validation when ERRORS is true.
         */
        function intValidatorWithErrors( n, min, max, caller, name ) {
            if ( n < min || n > max || n != truncate(n) ) {
                raise( caller, ( name || 'decimal places' ) +
                  ( n < min || n > max ? ' out of range' : ' not an integer' ), n );
            }

            return true;
        }


        /*
         * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
         * Called by minus, plus and times.
         */
        function normalise( n, c, e ) {
            var i = 1,
                j = c.length;

             // Remove trailing zeros.
            for ( ; !c[--j]; c.pop() );

            // Calculate the base 10 exponent. First get the number of digits of c[0].
            for ( j = c[0]; j >= 10; j /= 10, i++ );

            // Overflow?
            if ( ( e = i + e * LOG_BASE - 1 ) > MAX_EXP ) {

                // Infinity.
                n.c = n.e = null;

            // Underflow?
            } else if ( e < MIN_EXP ) {

                // Zero.
                n.c = [ n.e = 0 ];
            } else {
                n.e = e;
                n.c = c;
            }

            return n;
        }


        // Handle values that fail the validity test in BigNumber.
        parseNumeric = (function () {
            var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                dotAfter = /^([^.]+)\.$/,
                dotBefore = /^\.([^.]+)$/,
                isInfinityOrNaN = /^-?(Infinity|NaN)$/,
                whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

            return function ( x, str, num, b ) {
                var base,
                    s = num ? str : str.replace( whitespaceOrPlus, '' );

                // No exception on ±Infinity or NaN.
                if ( isInfinityOrNaN.test(s) ) {
                    x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
                } else {
                    if ( !num ) {

                        // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                        s = s.replace( basePrefix, function ( m, p1, p2 ) {
                            base = ( p2 = p2.toLowerCase() ) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                            return !b || b == base ? p1 : m;
                        });

                        if (b) {
                            base = b;

                            // E.g. '1.' to '1', '.1' to '0.1'
                            s = s.replace( dotAfter, '$1' ).replace( dotBefore, '0.$1' );
                        }

                        if ( str != s ) return new BigNumber( s, base );
                    }

                    // 'new BigNumber() not a number: {n}'
                    // 'new BigNumber() not a base {b} number: {n}'
                    if (ERRORS) raise( id, 'not a' + ( b ? ' base ' + b : '' ) + ' number', str );
                    x.s = null;
                }

                x.c = x.e = null;
                id = 0;
            }
        })();


        // Throw a BigNumber Error.
        function raise( caller, msg, val ) {
            var error = new Error( [
                'new BigNumber',     // 0
                'cmp',               // 1
                'config',            // 2
                'div',               // 3
                'divToInt',          // 4
                'eq',                // 5
                'gt',                // 6
                'gte',               // 7
                'lt',                // 8
                'lte',               // 9
                'minus',             // 10
                'mod',               // 11
                'plus',              // 12
                'precision',         // 13
                'random',            // 14
                'round',             // 15
                'shift',             // 16
                'times',             // 17
                'toDigits',          // 18
                'toExponential',     // 19
                'toFixed',           // 20
                'toFormat',          // 21
                'toFraction',        // 22
                'pow',               // 23
                'toPrecision',       // 24
                'toString',          // 25
                'BigNumber'          // 26
            ][caller] + '() ' + msg + ': ' + val );

            error.name = 'BigNumber Error';
            id = 0;
            throw error;
        }


        /*
         * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
         * If r is truthy, it is known that there are more digits after the rounding digit.
         */
        function round( x, sd, rm, r ) {
            var d, i, j, k, n, ni, rd,
                xc = x.c,
                pows10 = POWS_TEN;

            // if x is not Infinity or NaN...
            if (xc) {

                // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
                // n is a base 1e14 number, the value of the element of array x.c containing rd.
                // ni is the index of n within x.c.
                // d is the number of digits of n.
                // i is the index of rd within n including leading zeros.
                // j is the actual index of rd within n (if < 0, rd is a leading zero).
                out: {

                    // Get the number of digits of the first element of xc.
                    for ( d = 1, k = xc[0]; k >= 10; k /= 10, d++ );
                    i = sd - d;

                    // If the rounding digit is in the first element of xc...
                    if ( i < 0 ) {
                        i += LOG_BASE;
                        j = sd;
                        n = xc[ ni = 0 ];

                        // Get the rounding digit at index j of n.
                        rd = n / pows10[ d - j - 1 ] % 10 | 0;
                    } else {
                        ni = mathceil( ( i + 1 ) / LOG_BASE );

                        if ( ni >= xc.length ) {

                            if (r) {

                                // Needed by sqrt.
                                for ( ; xc.length <= ni; xc.push(0) );
                                n = rd = 0;
                                d = 1;
                                i %= LOG_BASE;
                                j = i - LOG_BASE + 1;
                            } else {
                                break out;
                            }
                        } else {
                            n = k = xc[ni];

                            // Get the number of digits of n.
                            for ( d = 1; k >= 10; k /= 10, d++ );

                            // Get the index of rd within n.
                            i %= LOG_BASE;

                            // Get the index of rd within n, adjusted for leading zeros.
                            // The number of leading zeros of n is given by LOG_BASE - d.
                            j = i - LOG_BASE + d;

                            // Get the rounding digit at index j of n.
                            rd = j < 0 ? 0 : n / pows10[ d - j - 1 ] % 10 | 0;
                        }
                    }

                    r = r || sd < 0 ||

                    // Are there any non-zero digits after the rounding digit?
                    // The expression  n % pows10[ d - j - 1 ]  returns all digits of n to the right
                    // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
                      xc[ni + 1] != null || ( j < 0 ? n : n % pows10[ d - j - 1 ] );

                    r = rm < 4
                      ? ( rd || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
                      : rd > 5 || rd == 5 && ( rm == 4 || r || rm == 6 &&

                        // Check whether the digit to the left of the rounding digit is odd.
                        ( ( i > 0 ? j > 0 ? n / pows10[ d - j ] : 0 : xc[ni - 1] ) % 10 ) & 1 ||
                          rm == ( x.s < 0 ? 8 : 7 ) );

                    if ( sd < 1 || !xc[0] ) {
                        xc.length = 0;

                        if (r) {

                            // Convert sd to decimal places.
                            sd -= x.e + 1;

                            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                            xc[0] = pows10[ ( LOG_BASE - sd % LOG_BASE ) % LOG_BASE ];
                            x.e = -sd || 0;
                        } else {

                            // Zero.
                            xc[0] = x.e = 0;
                        }

                        return x;
                    }

                    // Remove excess digits.
                    if ( i == 0 ) {
                        xc.length = ni;
                        k = 1;
                        ni--;
                    } else {
                        xc.length = ni + 1;
                        k = pows10[ LOG_BASE - i ];

                        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                        // j > 0 means i > number of leading zeros of n.
                        xc[ni] = j > 0 ? mathfloor( n / pows10[ d - j ] % pows10[j] ) * k : 0;
                    }

                    // Round up?
                    if (r) {

                        for ( ; ; ) {

                            // If the digit to be rounded up is in the first element of xc...
                            if ( ni == 0 ) {

                                // i will be the length of xc[0] before k is added.
                                for ( i = 1, j = xc[0]; j >= 10; j /= 10, i++ );
                                j = xc[0] += k;
                                for ( k = 1; j >= 10; j /= 10, k++ );

                                // if i != k the length has increased.
                                if ( i != k ) {
                                    x.e++;
                                    if ( xc[0] == BASE ) xc[0] = 1;
                                }

                                break;
                            } else {
                                xc[ni] += k;
                                if ( xc[ni] != BASE ) break;
                                xc[ni--] = 0;
                                k = 1;
                            }
                        }
                    }

                    // Remove trailing zeros.
                    for ( i = xc.length; xc[--i] === 0; xc.pop() );
                }

                // Overflow? Infinity.
                if ( x.e > MAX_EXP ) {
                    x.c = x.e = null;

                // Underflow? Zero.
                } else if ( x.e < MIN_EXP ) {
                    x.c = [ x.e = 0 ];
                }
            }

            return x;
        }


        // PROTOTYPE/INSTANCE METHODS


        /*
         * Return a new BigNumber whose value is the absolute value of this BigNumber.
         */
        P.absoluteValue = P.abs = function () {
            var x = new BigNumber(this);
            if ( x.s < 0 ) x.s = 1;
            return x;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
         * number in the direction of Infinity.
         */
        P.ceil = function () {
            return round( new BigNumber(this), this.e + 1, 2 );
        };


        /*
         * Return
         * 1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
         * 0 if they have the same value,
         * or null if the value of either is NaN.
         */
        P.comparedTo = P.cmp = function ( y, b ) {
            id = 1;
            return compare( this, new BigNumber( y, b ) );
        };


        /*
         * Return the number of decimal places of the value of this BigNumber, or null if the value
         * of this BigNumber is ±Infinity or NaN.
         */
        P.decimalPlaces = P.dp = function () {
            var n, v,
                c = this.c;

            if ( !c ) return null;
            n = ( ( v = c.length - 1 ) - bitFloor( this.e / LOG_BASE ) ) * LOG_BASE;

            // Subtract the number of trailing zeros of the last number.
            if ( v = c[v] ) for ( ; v % 10 == 0; v /= 10, n-- );
            if ( n < 0 ) n = 0;

            return n;
        };


        /*
         *  n / 0 = I
         *  n / N = N
         *  n / I = 0
         *  0 / n = 0
         *  0 / 0 = N
         *  0 / N = N
         *  0 / I = 0
         *  N / n = N
         *  N / 0 = N
         *  N / N = N
         *  N / I = N
         *  I / n = I
         *  I / 0 = I
         *  I / N = N
         *  I / I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
         * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.dividedBy = P.div = function ( y, b ) {
            id = 3;
            return div( this, new BigNumber( y, b ), DECIMAL_PLACES, ROUNDING_MODE );
        };


        /*
         * Return a new BigNumber whose value is the integer part of dividing the value of this
         * BigNumber by the value of BigNumber(y, b).
         */
        P.dividedToIntegerBy = P.divToInt = function ( y, b ) {
            id = 4;
            return div( this, new BigNumber( y, b ), 0, 1 );
        };


        /*
         * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.equals = P.eq = function ( y, b ) {
            id = 5;
            return compare( this, new BigNumber( y, b ) ) === 0;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
         * number in the direction of -Infinity.
         */
        P.floor = function () {
            return round( new BigNumber(this), this.e + 1, 3 );
        };


        /*
         * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.greaterThan = P.gt = function ( y, b ) {
            id = 6;
            return compare( this, new BigNumber( y, b ) ) > 0;
        };


        /*
         * Return true if the value of this BigNumber is greater than or equal to the value of
         * BigNumber(y, b), otherwise returns false.
         */
        P.greaterThanOrEqualTo = P.gte = function ( y, b ) {
            id = 7;
            return ( b = compare( this, new BigNumber( y, b ) ) ) === 1 || b === 0;

        };


        /*
         * Return true if the value of this BigNumber is a finite number, otherwise returns false.
         */
        P.isFinite = function () {
            return !!this.c;
        };


        /*
         * Return true if the value of this BigNumber is an integer, otherwise return false.
         */
        P.isInteger = P.isInt = function () {
            return !!this.c && bitFloor( this.e / LOG_BASE ) > this.c.length - 2;
        };


        /*
         * Return true if the value of this BigNumber is NaN, otherwise returns false.
         */
        P.isNaN = function () {
            return !this.s;
        };


        /*
         * Return true if the value of this BigNumber is negative, otherwise returns false.
         */
        P.isNegative = P.isNeg = function () {
            return this.s < 0;
        };


        /*
         * Return true if the value of this BigNumber is 0 or -0, otherwise returns false.
         */
        P.isZero = function () {
            return !!this.c && this.c[0] == 0;
        };


        /*
         * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.lessThan = P.lt = function ( y, b ) {
            id = 8;
            return compare( this, new BigNumber( y, b ) ) < 0;
        };


        /*
         * Return true if the value of this BigNumber is less than or equal to the value of
         * BigNumber(y, b), otherwise returns false.
         */
        P.lessThanOrEqualTo = P.lte = function ( y, b ) {
            id = 9;
            return ( b = compare( this, new BigNumber( y, b ) ) ) === -1 || b === 0;
        };


        /*
         *  n - 0 = n
         *  n - N = N
         *  n - I = -I
         *  0 - n = -n
         *  0 - 0 = 0
         *  0 - N = N
         *  0 - I = -I
         *  N - n = N
         *  N - 0 = N
         *  N - N = N
         *  N - I = N
         *  I - n = I
         *  I - 0 = I
         *  I - N = N
         *  I - I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber minus the value of
         * BigNumber(y, b).
         */
        P.minus = P.sub = function ( y, b ) {
            var i, j, t, xLTy,
                x = this,
                a = x.s;

            id = 10;
            y = new BigNumber( y, b );
            b = y.s;

            // Either NaN?
            if ( !a || !b ) return new BigNumber(NaN);

            // Signs differ?
            if ( a != b ) {
                y.s = -b;
                return x.plus(y);
            }

            var xe = x.e / LOG_BASE,
                ye = y.e / LOG_BASE,
                xc = x.c,
                yc = y.c;

            if ( !xe || !ye ) {

                // Either Infinity?
                if ( !xc || !yc ) return xc ? ( y.s = -b, y ) : new BigNumber( yc ? x : NaN );

                // Either zero?
                if ( !xc[0] || !yc[0] ) {

                    // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                    return yc[0] ? ( y.s = -b, y ) : new BigNumber( xc[0] ? x :

                      // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                      ROUNDING_MODE == 3 ? -0 : 0 );
                }
            }

            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();

            // Determine which is the bigger number.
            if ( a = xe - ye ) {

                if ( xLTy = a < 0 ) {
                    a = -a;
                    t = xc;
                } else {
                    ye = xe;
                    t = yc;
                }

                t.reverse();

                // Prepend zeros to equalise exponents.
                for ( b = a; b--; t.push(0) );
                t.reverse();
            } else {

                // Exponents equal. Check digit by digit.
                j = ( xLTy = ( a = xc.length ) < ( b = yc.length ) ) ? a : b;

                for ( a = b = 0; b < j; b++ ) {

                    if ( xc[b] != yc[b] ) {
                        xLTy = xc[b] < yc[b];
                        break;
                    }
                }
            }

            // x < y? Point xc to the array of the bigger number.
            if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

            b = ( j = yc.length ) - ( i = xc.length );

            // Append zeros to xc if shorter.
            // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
            if ( b > 0 ) for ( ; b--; xc[i++] = 0 );
            b = BASE - 1;

            // Subtract yc from xc.
            for ( ; j > a; ) {

                if ( xc[--j] < yc[j] ) {
                    for ( i = j; i && !xc[--i]; xc[i] = b );
                    --xc[i];
                    xc[j] += BASE;
                }

                xc[j] -= yc[j];
            }

            // Remove leading zeros and adjust exponent accordingly.
            for ( ; xc[0] == 0; xc.shift(), --ye );

            // Zero?
            if ( !xc[0] ) {

                // Following IEEE 754 (2008) 6.3,
                // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
                y.s = ROUNDING_MODE == 3 ? -1 : 1;
                y.c = [ y.e = 0 ];
                return y;
            }

            // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
            // for finite x and y.
            return normalise( y, xc, ye );
        };


        /*
         *   n % 0 =  N
         *   n % N =  N
         *   n % I =  n
         *   0 % n =  0
         *  -0 % n = -0
         *   0 % 0 =  N
         *   0 % N =  N
         *   0 % I =  0
         *   N % n =  N
         *   N % 0 =  N
         *   N % N =  N
         *   N % I =  N
         *   I % n =  N
         *   I % 0 =  N
         *   I % N =  N
         *   I % I =  N
         *
         * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
         * BigNumber(y, b). The result depends on the value of MODULO_MODE.
         */
        P.modulo = P.mod = function ( y, b ) {
            var q, s,
                x = this;

            id = 11;
            y = new BigNumber( y, b );

            // Return NaN if x is Infinity or NaN, or y is NaN or zero.
            if ( !x.c || !y.s || y.c && !y.c[0] ) {
                return new BigNumber(NaN);

            // Return x if y is Infinity or x is zero.
            } else if ( !y.c || x.c && !x.c[0] ) {
                return new BigNumber(x);
            }

            if ( MODULO_MODE == 9 ) {

                // Euclidian division: q = sign(y) * floor(x / abs(y))
                // r = x - qy    where  0 <= r < abs(y)
                s = y.s;
                y.s = 1;
                q = div( x, y, 0, 3 );
                y.s = s;
                q.s *= s;
            } else {
                q = div( x, y, 0, MODULO_MODE );
            }

            return x.minus( q.times(y) );
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber negated,
         * i.e. multiplied by -1.
         */
        P.negated = P.neg = function () {
            var x = new BigNumber(this);
            x.s = -x.s || null;
            return x;
        };


        /*
         *  n + 0 = n
         *  n + N = N
         *  n + I = I
         *  0 + n = n
         *  0 + 0 = 0
         *  0 + N = N
         *  0 + I = I
         *  N + n = N
         *  N + 0 = N
         *  N + N = N
         *  N + I = N
         *  I + n = I
         *  I + 0 = I
         *  I + N = N
         *  I + I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber plus the value of
         * BigNumber(y, b).
         */
        P.plus = P.add = function ( y, b ) {
            var t,
                x = this,
                a = x.s;

            id = 12;
            y = new BigNumber( y, b );
            b = y.s;

            // Either NaN?
            if ( !a || !b ) return new BigNumber(NaN);

            // Signs differ?
             if ( a != b ) {
                y.s = -b;
                return x.minus(y);
            }

            var xe = x.e / LOG_BASE,
                ye = y.e / LOG_BASE,
                xc = x.c,
                yc = y.c;

            if ( !xe || !ye ) {

                // Return ±Infinity if either ±Infinity.
                if ( !xc || !yc ) return new BigNumber( a / 0 );

                // Either zero?
                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                if ( !xc[0] || !yc[0] ) return yc[0] ? y : new BigNumber( xc[0] ? x : a * 0 );
            }

            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();

            // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
            if ( a = xe - ye ) {
                if ( a > 0 ) {
                    ye = xe;
                    t = yc;
                } else {
                    a = -a;
                    t = xc;
                }

                t.reverse();
                for ( ; a--; t.push(0) );
                t.reverse();
            }

            a = xc.length;
            b = yc.length;

            // Point xc to the longer array, and b to the shorter length.
            if ( a - b < 0 ) t = yc, yc = xc, xc = t, b = a;

            // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
            for ( a = 0; b; ) {
                a = ( xc[--b] = xc[b] + yc[b] + a ) / BASE | 0;
                xc[b] %= BASE;
            }

            if (a) {
                xc.unshift(a);
                ++ye;
            }

            // No need to check for zero, as +x + +y != 0 && -x + -y != 0
            // ye = MAX_EXP + 1 possible
            return normalise( y, xc, ye );
        };


        /*
         * Return the number of significant digits of the value of this BigNumber.
         *
         * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
         */
        P.precision = P.sd = function (z) {
            var n, v,
                x = this,
                c = x.c;

            // 'precision() argument not a boolean or binary digit: {z}'
            if ( z != null && z !== !!z && z !== 1 && z !== 0 ) {
                if (ERRORS) raise( 13, 'argument' + notBool, z );
                if ( z != !!z ) z = null;
            }

            if ( !c ) return null;
            v = c.length - 1;
            n = v * LOG_BASE + 1;

            if ( v = c[v] ) {

                // Subtract the number of trailing zeros of the last element.
                for ( ; v % 10 == 0; v /= 10, n-- );

                // Add the number of digits of the first element.
                for ( v = c[0]; v >= 10; v /= 10, n++ );
            }

            if ( z && x.e + 1 > n ) n = x.e + 1;

            return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
         * dp decimal places using rounding mode rm, or to 0 and ROUNDING_MODE respectively if
         * omitted.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'round() decimal places out of range: {dp}'
         * 'round() decimal places not an integer: {dp}'
         * 'round() rounding mode not an integer: {rm}'
         * 'round() rounding mode out of range: {rm}'
         */
        P.round = function ( dp, rm ) {
            var n = new BigNumber(this);

            if ( dp == null || isValidInt( dp, 0, MAX, 15 ) ) {
                round( n, ~~dp + this.e + 1, rm == null ||
                  !isValidInt( rm, 0, 8, 15, roundingMode ) ? ROUNDING_MODE : rm | 0 );
            }

            return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
         * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
         *
         * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         *
         * If k is out of range and ERRORS is false, the result will be ±0 if k < 0, or ±Infinity
         * otherwise.
         *
         * 'shift() argument not an integer: {k}'
         * 'shift() argument out of range: {k}'
         */
        P.shift = function (k) {
            var n = this;
            return isValidInt( k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 16, 'argument' )

              // k < 1e+21, or truncate(k) will produce exponential notation.
              ? n.times( '1e' + truncate(k) )
              : new BigNumber( n.c && n.c[0] && ( k < -MAX_SAFE_INTEGER || k > MAX_SAFE_INTEGER )
                ? n.s * ( k < 0 ? 0 : 1 / 0 )
                : n );
        };


        /*
         *  sqrt(-n) =  N
         *  sqrt( N) =  N
         *  sqrt(-I) =  N
         *  sqrt( I) =  I
         *  sqrt( 0) =  0
         *  sqrt(-0) = -0
         *
         * Return a new BigNumber whose value is the square root of the value of this BigNumber,
         * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.squareRoot = P.sqrt = function () {
            var m, n, r, rep, t,
                x = this,
                c = x.c,
                s = x.s,
                e = x.e,
                dp = DECIMAL_PLACES + 4,
                half = new BigNumber('0.5');

            // Negative/NaN/Infinity/zero?
            if ( s !== 1 || !c || !c[0] ) {
                return new BigNumber( !s || s < 0 && ( !c || c[0] ) ? NaN : c ? x : 1 / 0 );
            }

            // Initial estimate.
            s = Math.sqrt( +x );

            // Math.sqrt underflow/overflow?
            // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
            if ( s == 0 || s == 1 / 0 ) {
                n = coeffToString(c);
                if ( ( n.length + e ) % 2 == 0 ) n += '0';
                s = Math.sqrt(n);
                e = bitFloor( ( e + 1 ) / 2 ) - ( e < 0 || e % 2 );

                if ( s == 1 / 0 ) {
                    n = '1e' + e;
                } else {
                    n = s.toExponential();
                    n = n.slice( 0, n.indexOf('e') + 1 ) + e;
                }

                r = new BigNumber(n);
            } else {
                r = new BigNumber( s + '' );
            }

            // Check for zero.
            // r could be zero if MIN_EXP is changed after the this value was created.
            // This would cause a division by zero (x/t) and hence Infinity below, which would cause
            // coeffToString to throw.
            if ( r.c[0] ) {
                e = r.e;
                s = e + dp;
                if ( s < 3 ) s = 0;

                // Newton-Raphson iteration.
                for ( ; ; ) {
                    t = r;
                    r = half.times( t.plus( div( x, t, dp, 1 ) ) );

                    if ( coeffToString( t.c   ).slice( 0, s ) === ( n =
                         coeffToString( r.c ) ).slice( 0, s ) ) {

                        // The exponent of r may here be one less than the final result exponent,
                        // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                        // are indexed correctly.
                        if ( r.e < e ) --s;
                        n = n.slice( s - 3, s + 1 );

                        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                        // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                        // iteration.
                        if ( n == '9999' || !rep && n == '4999' ) {

                            // On the first iteration only, check to see if rounding up gives the
                            // exact result as the nines may infinitely repeat.
                            if ( !rep ) {
                                round( t, t.e + DECIMAL_PLACES + 2, 0 );

                                if ( t.times(t).eq(x) ) {
                                    r = t;
                                    break;
                                }
                            }

                            dp += 4;
                            s += 4;
                            rep = 1;
                        } else {

                            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                            // result. If not, then there are further digits and m will be truthy.
                            if ( !+n || !+n.slice(1) && n.charAt(0) == '5' ) {

                                // Truncate to the first rounding digit.
                                round( r, r.e + DECIMAL_PLACES + 2, 1 );
                                m = !r.times(r).eq(x);
                            }

                            break;
                        }
                    }
                }
            }

            return round( r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m );
        };


        /*
         *  n * 0 = 0
         *  n * N = N
         *  n * I = I
         *  0 * n = 0
         *  0 * 0 = 0
         *  0 * N = N
         *  0 * I = N
         *  N * n = N
         *  N * 0 = N
         *  N * N = N
         *  N * I = N
         *  I * n = I
         *  I * 0 = N
         *  I * N = N
         *  I * I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber times the value of
         * BigNumber(y, b).
         */
        P.times = P.mul = function ( y, b ) {
            var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
                base, sqrtBase,
                x = this,
                xc = x.c,
                yc = ( id = 17, y = new BigNumber( y, b ) ).c;

            // Either NaN, ±Infinity or ±0?
            if ( !xc || !yc || !xc[0] || !yc[0] ) {

                // Return NaN if either is NaN, or one is 0 and the other is Infinity.
                if ( !x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc ) {
                    y.c = y.e = y.s = null;
                } else {
                    y.s *= x.s;

                    // Return ±Infinity if either is ±Infinity.
                    if ( !xc || !yc ) {
                        y.c = y.e = null;

                    // Return ±0 if either is ±0.
                    } else {
                        y.c = [0];
                        y.e = 0;
                    }
                }

                return y;
            }

            e = bitFloor( x.e / LOG_BASE ) + bitFloor( y.e / LOG_BASE );
            y.s *= x.s;
            xcL = xc.length;
            ycL = yc.length;

            // Ensure xc points to longer array and xcL to its length.
            if ( xcL < ycL ) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

            // Initialise the result array with zeros.
            for ( i = xcL + ycL, zc = []; i--; zc.push(0) );

            base = BASE;
            sqrtBase = SQRT_BASE;

            for ( i = ycL; --i >= 0; ) {
                c = 0;
                ylo = yc[i] % sqrtBase;
                yhi = yc[i] / sqrtBase | 0;

                for ( k = xcL, j = i + k; j > i; ) {
                    xlo = xc[--k] % sqrtBase;
                    xhi = xc[k] / sqrtBase | 0;
                    m = yhi * xlo + xhi * ylo;
                    xlo = ylo * xlo + ( ( m % sqrtBase ) * sqrtBase ) + zc[j] + c;
                    c = ( xlo / base | 0 ) + ( m / sqrtBase | 0 ) + yhi * xhi;
                    zc[j--] = xlo % base;
                }

                zc[j] = c;
            }

            if (c) {
                ++e;
            } else {
                zc.shift();
            }

            return normalise( y, zc, e );
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
         * sd significant digits using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toDigits() precision out of range: {sd}'
         * 'toDigits() precision not an integer: {sd}'
         * 'toDigits() rounding mode not an integer: {rm}'
         * 'toDigits() rounding mode out of range: {rm}'
         */
        P.toDigits = function ( sd, rm ) {
            var n = new BigNumber(this);
            sd = sd == null || !isValidInt( sd, 1, MAX, 18, 'precision' ) ? null : sd | 0;
            rm = rm == null || !isValidInt( rm, 0, 8, 18, roundingMode ) ? ROUNDING_MODE : rm | 0;
            return sd ? round( n, sd, rm ) : n;
        };


        /*
         * Return a string representing the value of this BigNumber in exponential notation and
         * rounded using ROUNDING_MODE to dp fixed decimal places.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toExponential() decimal places not an integer: {dp}'
         * 'toExponential() decimal places out of range: {dp}'
         * 'toExponential() rounding mode not an integer: {rm}'
         * 'toExponential() rounding mode out of range: {rm}'
         */
        P.toExponential = function ( dp, rm ) {
            return format( this,
              dp != null && isValidInt( dp, 0, MAX, 19 ) ? ~~dp + 1 : null, rm, 19 );
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounding
         * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
         * but e.g. (-0.00001).toFixed(0) is '-0'.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toFixed() decimal places not an integer: {dp}'
         * 'toFixed() decimal places out of range: {dp}'
         * 'toFixed() rounding mode not an integer: {rm}'
         * 'toFixed() rounding mode out of range: {rm}'
         */
        P.toFixed = function ( dp, rm ) {
            return format( this, dp != null && isValidInt( dp, 0, MAX, 20 )
              ? ~~dp + this.e + 1 : null, rm, 20 );
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounded
         * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
         * of the FORMAT object (see BigNumber.config).
         *
         * FORMAT = {
         *      decimalSeparator : '.',
         *      groupSeparator : ',',
         *      groupSize : 3,
         *      secondaryGroupSize : 0,
         *      fractionGroupSeparator : '\xA0',    // non-breaking space
         *      fractionGroupSize : 0
         * };
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toFormat() decimal places not an integer: {dp}'
         * 'toFormat() decimal places out of range: {dp}'
         * 'toFormat() rounding mode not an integer: {rm}'
         * 'toFormat() rounding mode out of range: {rm}'
         */
        P.toFormat = function ( dp, rm ) {
            var str = format( this, dp != null && isValidInt( dp, 0, MAX, 21 )
              ? ~~dp + this.e + 1 : null, rm, 21 );

            if ( this.c ) {
                var i,
                    arr = str.split('.'),
                    g1 = +FORMAT.groupSize,
                    g2 = +FORMAT.secondaryGroupSize,
                    groupSeparator = FORMAT.groupSeparator,
                    intPart = arr[0],
                    fractionPart = arr[1],
                    isNeg = this.s < 0,
                    intDigits = isNeg ? intPart.slice(1) : intPart,
                    len = intDigits.length;

                if (g2) i = g1, g1 = g2, g2 = i, len -= i;

                if ( g1 > 0 && len > 0 ) {
                    i = len % g1 || g1;
                    intPart = intDigits.substr( 0, i );

                    for ( ; i < len; i += g1 ) {
                        intPart += groupSeparator + intDigits.substr( i, g1 );
                    }

                    if ( g2 > 0 ) intPart += groupSeparator + intDigits.slice(i);
                    if (isNeg) intPart = '-' + intPart;
                }

                str = fractionPart
                  ? intPart + FORMAT.decimalSeparator + ( ( g2 = +FORMAT.fractionGroupSize )
                    ? fractionPart.replace( new RegExp( '\\d{' + g2 + '}\\B', 'g' ),
                      '$&' + FORMAT.fractionGroupSeparator )
                    : fractionPart )
                  : intPart;
            }

            return str;
        };


        /*
         * Return a string array representing the value of this BigNumber as a simple fraction with
         * an integer numerator and an integer denominator. The denominator will be a positive
         * non-zero value less than or equal to the specified maximum denominator. If a maximum
         * denominator is not specified, the denominator will be the lowest value necessary to
         * represent the number exactly.
         *
         * [md] {number|string|BigNumber} Integer >= 1 and < Infinity. The maximum denominator.
         *
         * 'toFraction() max denominator not an integer: {md}'
         * 'toFraction() max denominator out of range: {md}'
         */
        P.toFraction = function (md) {
            var arr, d0, d2, e, exp, n, n0, q, s,
                k = ERRORS,
                x = this,
                xc = x.c,
                d = new BigNumber(ONE),
                n1 = d0 = new BigNumber(ONE),
                d1 = n0 = new BigNumber(ONE);

            if ( md != null ) {
                ERRORS = false;
                n = new BigNumber(md);
                ERRORS = k;

                if ( !( k = n.isInt() ) || n.lt(ONE) ) {

                    if (ERRORS) {
                        raise( 22,
                          'max denominator ' + ( k ? 'out of range' : 'not an integer' ), md );
                    }

                    // ERRORS is false:
                    // If md is a finite non-integer >= 1, round it to an integer and use it.
                    md = !k && n.c && round( n, n.e + 1, 1 ).gte(ONE) ? n : null;
                }
            }

            if ( !xc ) return x.toString();
            s = coeffToString(xc);

            // Determine initial denominator.
            // d is a power of 10 and the minimum max denominator that specifies the value exactly.
            e = d.e = s.length - x.e - 1;
            d.c[0] = POWS_TEN[ ( exp = e % LOG_BASE ) < 0 ? LOG_BASE + exp : exp ];
            md = !md || n.cmp(d) > 0 ? ( e > 0 ? d : n1 ) : n;

            exp = MAX_EXP;
            MAX_EXP = 1 / 0;
            n = new BigNumber(s);

            // n0 = d1 = 0
            n0.c[0] = 0;

            for ( ; ; )  {
                q = div( n, d, 0, 1 );
                d2 = d0.plus( q.times(d1) );
                if ( d2.cmp(md) == 1 ) break;
                d0 = d1;
                d1 = d2;
                n1 = n0.plus( q.times( d2 = n1 ) );
                n0 = d2;
                d = n.minus( q.times( d2 = d ) );
                n = d2;
            }

            d2 = div( md.minus(d0), d1, 0, 1 );
            n0 = n0.plus( d2.times(n1) );
            d0 = d0.plus( d2.times(d1) );
            n0.s = n1.s = x.s;
            e *= 2;

            // Determine which fraction is closer to x, n0/d0 or n1/d1
            arr = div( n1, d1, e, ROUNDING_MODE ).minus(x).abs().cmp(
                  div( n0, d0, e, ROUNDING_MODE ).minus(x).abs() ) < 1
                    ? [ n1.toString(), d1.toString() ]
                    : [ n0.toString(), d0.toString() ];

            MAX_EXP = exp;
            return arr;
        };


        /*
         * Return the value of this BigNumber converted to a number primitive.
         */
        P.toNumber = function () {
            return +this;
        };


        /*
         * Return a BigNumber whose value is the value of this BigNumber raised to the power n.
         * If m is present, return the result modulo m.
         * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
         * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using
         * ROUNDING_MODE.
         *
         * The modular power operation works efficiently when x, n, and m are positive integers,
         * otherwise it is equivalent to calculating x.toPower(n).modulo(m) (with POW_PRECISION 0).
         *
         * n {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         * [m] {number|string|BigNumber} The modulus.
         *
         * 'pow() exponent not an integer: {n}'
         * 'pow() exponent out of range: {n}'
         *
         * Performs 54 loop iterations for n of 9007199254740991.
         */
        P.toPower = P.pow = function ( n, m ) {
            var k, y, z,
                i = mathfloor( n < 0 ? -n : +n ),
                x = this;

            if ( m != null ) {
                id = 23;
                m = new BigNumber(m);
            }

            // Pass ±Infinity to Math.pow if exponent is out of range.
            if ( !isValidInt( n, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 23, 'exponent' ) &&
              ( !isFinite(n) || i > MAX_SAFE_INTEGER && ( n /= 0 ) ||
                parseFloat(n) != n && !( n = NaN ) ) || n == 0 ) {
                k = Math.pow( +x, n );
                return new BigNumber( m ? k % m : k );
            }

            if (m) {
                if ( n > 1 && x.gt(ONE) && x.isInt() && m.gt(ONE) && m.isInt() ) {
                    x = x.mod(m);
                } else {
                    z = m;

                    // Nullify m so only a single mod operation is performed at the end.
                    m = null;
                }
            } else if (POW_PRECISION) {

                // Truncating each coefficient array to a length of k after each multiplication
                // equates to truncating significant digits to POW_PRECISION + [28, 41],
                // i.e. there will be a minimum of 28 guard digits retained.
                // (Using + 1.5 would give [9, 21] guard digits.)
                k = mathceil( POW_PRECISION / LOG_BASE + 2 );
            }

            y = new BigNumber(ONE);

            for ( ; ; ) {
                if ( i % 2 ) {
                    y = y.times(x);
                    if ( !y.c ) break;
                    if (k) {
                        if ( y.c.length > k ) y.c.length = k;
                    } else if (m) {
                        y = y.mod(m);
                    }
                }

                i = mathfloor( i / 2 );
                if ( !i ) break;
                x = x.times(x);
                if (k) {
                    if ( x.c && x.c.length > k ) x.c.length = k;
                } else if (m) {
                    x = x.mod(m);
                }
            }

            if (m) return y;
            if ( n < 0 ) y = ONE.div(y);

            return z ? y.mod(z) : k ? round( y, POW_PRECISION, ROUNDING_MODE ) : y;
        };


        /*
         * Return a string representing the value of this BigNumber rounded to sd significant digits
         * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
         * necessary to represent the integer part of the value in fixed-point notation, then use
         * exponential notation.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toPrecision() precision not an integer: {sd}'
         * 'toPrecision() precision out of range: {sd}'
         * 'toPrecision() rounding mode not an integer: {rm}'
         * 'toPrecision() rounding mode out of range: {rm}'
         */
        P.toPrecision = function ( sd, rm ) {
            return format( this, sd != null && isValidInt( sd, 1, MAX, 24, 'precision' )
              ? sd | 0 : null, rm, 24 );
        };


        /*
         * Return a string representing the value of this BigNumber in base b, or base 10 if b is
         * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
         * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
         * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
         * TO_EXP_NEG, return exponential notation.
         *
         * [b] {number} Integer, 2 to 64 inclusive.
         *
         * 'toString() base not an integer: {b}'
         * 'toString() base out of range: {b}'
         */
        P.toString = function (b) {
            var str,
                n = this,
                s = n.s,
                e = n.e;

            // Infinity or NaN?
            if ( e === null ) {

                if (s) {
                    str = 'Infinity';
                    if ( s < 0 ) str = '-' + str;
                } else {
                    str = 'NaN';
                }
            } else {
                str = coeffToString( n.c );

                if ( b == null || !isValidInt( b, 2, 64, 25, 'base' ) ) {
                    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                      ? toExponential( str, e )
                      : toFixedPoint( str, e );
                } else {
                    str = convertBase( toFixedPoint( str, e ), b | 0, 10, s );
                }

                if ( s < 0 && n.c[0] ) str = '-' + str;
            }

            return str;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber truncated to a whole
         * number.
         */
        P.truncated = P.trunc = function () {
            return round( new BigNumber(this), this.e + 1, 1 );
        };



        /*
         * Return as toString, but do not accept a base argument, and include the minus sign for
         * negative zero.
         */
        P.valueOf = P.toJSON = function () {
            var str,
                n = this,
                e = n.e;

            if ( e === null ) return n.toString();

            str = coeffToString( n.c );

            str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                ? toExponential( str, e )
                : toFixedPoint( str, e );

            return n.s < 0 ? '-' + str : str;
        };


        // Aliases for BigDecimal methods.
        //P.add = P.plus;         // P.add included above
        //P.subtract = P.minus;   // P.sub included above
        //P.multiply = P.times;   // P.mul included above
        //P.divide = P.div;
        //P.remainder = P.mod;
        //P.compareTo = P.cmp;
        //P.negate = P.neg;


        if ( configObj != null ) BigNumber.config(configObj);

        return BigNumber;
    }


    // PRIVATE HELPER FUNCTIONS


    function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
    }


    // Return a coefficient array as a string of base 10 digits.
    function coeffToString(a) {
        var s, z,
            i = 1,
            j = a.length,
            r = a[0] + '';

        for ( ; i < j; ) {
            s = a[i++] + '';
            z = LOG_BASE - s.length;
            for ( ; z--; s = '0' + s );
            r += s;
        }

        // Determine trailing zeros.
        for ( j = r.length; r.charCodeAt(--j) === 48; );
        return r.slice( 0, j + 1 || 1 );
    }


    // Compare the value of BigNumbers x and y.
    function compare( x, y ) {
        var a, b,
            xc = x.c,
            yc = y.c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;

        // Either NaN?
        if ( !i || !j ) return null;

        a = xc && !xc[0];
        b = yc && !yc[0];

        // Either zero?
        if ( a || b ) return a ? b ? 0 : -j : i;

        // Signs differ?
        if ( i != j ) return i;

        a = i < 0;
        b = k == l;

        // Either Infinity?
        if ( !xc || !yc ) return b ? 0 : !xc ^ a ? 1 : -1;

        // Compare exponents.
        if ( !b ) return k > l ^ a ? 1 : -1;

        j = ( k = xc.length ) < ( l = yc.length ) ? k : l;

        // Compare digit by digit.
        for ( i = 0; i < j; i++ ) if ( xc[i] != yc[i] ) return xc[i] > yc[i] ^ a ? 1 : -1;

        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
    }


    /*
     * Return true if n is a valid number in range, otherwise false.
     * Use for argument validation when ERRORS is false.
     * Note: parseInt('1e+1') == 1 but parseFloat('1e+1') == 10.
     */
    function intValidatorNoErrors( n, min, max ) {
        return ( n = truncate(n) ) >= min && n <= max;
    }


    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }


    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. convertBase('255', 10, 16) returns [15, 15].
     * Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut( str, baseIn, baseOut ) {
        var j,
            arr = [0],
            arrL,
            i = 0,
            len = str.length;

        for ( ; i < len; ) {
            for ( arrL = arr.length; arrL--; arr[arrL] *= baseIn );
            arr[ j = 0 ] += ALPHABET.indexOf( str.charAt( i++ ) );

            for ( ; j < arr.length; j++ ) {

                if ( arr[j] > baseOut - 1 ) {
                    if ( arr[j + 1] == null ) arr[j + 1] = 0;
                    arr[j + 1] += arr[j] / baseOut | 0;
                    arr[j] %= baseOut;
                }
            }
        }

        return arr.reverse();
    }


    function toExponential( str, e ) {
        return ( str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str ) +
          ( e < 0 ? 'e' : 'e+' ) + e;
    }


    function toFixedPoint( str, e ) {
        var len, z;

        // Negative exponent?
        if ( e < 0 ) {

            // Prepend zeros.
            for ( z = '0.'; ++e; z += '0' );
            str = z + str;

        // Positive exponent
        } else {
            len = str.length;

            // Append zeros.
            if ( ++e > len ) {
                for ( z = '0', e -= len; --e; z += '0' );
                str += z;
            } else if ( e < len ) {
                str = str.slice( 0, e ) + '.' + str.slice(e);
            }
        }

        return str;
    }


    function truncate(n) {
        n = parseFloat(n);
        return n < 0 ? mathceil(n) : mathfloor(n);
    }


    // EXPORT


    BigNumber = constructorFactory();
    BigNumber.default = BigNumber.BigNumber = BigNumber;


    // AMD.
    if ( typeof define == 'function' && define.amd ) {
        define( function () { return BigNumber; } );

    // Node.js and other environments that support module.exports.
    } else if ( typeof module != 'undefined' && module.exports ) {
        module.exports = BigNumber;

        // Split string stops browserify adding crypto shim.
        if ( !cryptoObj ) try { cryptoObj = require('cry' + 'pto'); } catch (e) {}

    // Browser.
    } else {
        if ( !globalObj ) globalObj = typeof self != 'undefined' ? self : Function('return this')();
        globalObj.BigNumber = BigNumber;
    }
})(batavia.vendored);
