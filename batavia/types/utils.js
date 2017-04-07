var types = require('../types')
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var errors = require('../errors')

var utils = {}

utils.inplace_call = function(f, operand_str, this_obj, other) {
    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    try {
        return this_obj[f](other)
    } catch (error) {
        if (error instanceof exceptions.TypeError.$pyclass) {
            throw new exceptions.TypeError.$pyclass(
                'unsupported operand type(s) for ' + operand_str + ": '" + type_name(this_obj) + "' and '" + type_name(other) + "'")
        } else {
            throw error
        }
    }
}

var FormatArgs = function(format, args) {
    this.format = format
    this.args = args
    this.f = 0
    this.a = 0
}

FormatArgs.prototype.next_char = function() {
    return this.format[this.f++]
}

FormatArgs.prototype.arg = function() {
    return this.args[this.a]
}

FormatArgs.prototype.char = function() {
    return this.format[this.f]
}

FormatArgs.prototype.countformat = function(endchar) {
    var count = 0
    var level = 0
    var f = this.f
    var format = this.format.substring(f)
    while (level > 0 || (f < format.length && format[f] != endchar)) {
        switch (format[f]) {
        case '\0':
            /* Premature end */
            errors.PyErr_SetString(exceptions.SystemError,
                            "unmatched paren in format")
            return -1
        case '(':
        case '[':
        case '{':
            if (level == 0) {
                count++
            }
            level++
            break
        case ')':
        case ']':
        case '}':
            level--
            break
        case '#':
        case '&':
        case ',':
        case ':':
        case ' ':
        case '\t':
            break
        default:
            if (level == 0) {
                count++
            }
        }
        f++
    }
    if (f >= format.length) {
        /* Premature end */
        errors.PyErr_SetString(exceptions.SystemError,
                        "unmatched paren in format")
    }
    return count
}

var do_mkvalue = function(fa) {
    for (;;) {
        switch (fa.next_char()) {
        case '(':
            return do_mktuple(fa, ')', fa.countformat(')'))

        case '[':
            return do_mklist(fa, ']', fa.countformat(']'))

        case '{':
            return do_mkdict(fa, '}', fa.countformat('}'))

        case 'b':
        case 'B':
        case 'h':
        case 'i':
        case 'H':
        case 'I':
        case 'n':
        case 'l':
        case 'k':
        case 'L':
        case 'K':
            return new types.Int(fa.arg())

        case 'u':
            return fa.arg()
        case 'f':
        case 'd':
            return new types.Float(fa.arg())

        case 'D':
            return new types.Complex(fa.arg())
        case 'c':
            return new types.Bytes(fa.arg())
        case 'C':
            return new String.fromCharCode(fa.arg())
        case 's':
        case 'z':
        case 'U':   /* XXX deprecated alias */
        case 'y':
            return fa.arg()
        case 'N':
        case 'S':
        case 'O':
            if (fa.char() == '&') {
                return new types.Function(fa.arg())
            } else {
                 if (!errors.PyErr_Occurred()) {
                     /* If a NULL was passed
                      * because a call that should
                      * have constructed a value
                      * failed, that's OK, and we
                      * pass the error on; but if
                      * no error occurred it's not
                      * clear that the caller knew
                      * what she was doing. */
                     errors.PyErr_SetString(exceptions.SystemError,
                         "NULL object passed to Py_BuildValue")
                 }
                 return fa.arg()
             }

           case ':':
           case ',':
           case ' ':
           case '\t':
               break

           default:
               errors.PyErr_SetString(exceptions.SystemError,
                   "bad format char passed to Py_BuildValue")
               return null

         }
     }
 }

 var do_mktuple = function(fa, endchar, n, flags) {
     if (n < 0) {
         return null
     }
     var v = []
     for (var i = 0; i < n; i++) {
         var w = do_mkvalue(fa, flags)
         if (w == null) {
             do_ignore(fa, endchar, n - i - 1, flags)
             return null
         }
         v.push(w)
     }
     if (fa.char() != endchar) {
         errors.PyErr_SetString(exceptions.SystemError,
                         "Unmatched paren in format")
         return null;
     }
     if (endchar) {
         fa.next_char()
     }
     return new types.Tuple(v)
 }

 utils.Py_BuildValue = function(format) {
     var args = [].slice.call(arguments, 1)
     var fa = new FormatArgs(format, args)
     return do_mkvalue(fa)
 }

module.exports = utils
