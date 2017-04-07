var core = require('./core')
var exceptions = require('./core/exceptions')
var types = require('./types')

// global rendez-vous for error
var curexc_value = null
var curexc_type = null
var curexc_traceback = null

var errors = {}

errors.PyErr_SetString = function(exception, value) {
    return errors.PyErr_SetObject(exception, value)
}

errors.PyErr_Format = function(exception, format) {
    var args = [].slice.call(arguments, 2)
}

errors.PyErr_Restore = function(type, value, traceback) {
    if (traceback != null && !PyTraceBack_Check(traceback)) {
        /* XXX Should never happen -- fatal error instead? */
        /* Well, it could be None. */
        traceback = null
    }
    curexc_type = type
    curexc_value = value
    curexc_traceback = traceback
}

errors.PyErr_Clear = function() {
    PyErr_Restore(null, null, null)
}

errors.PyErr_Occurred = function() {
    return curexc_type
}

errors.PyErr_SetObject = function(exception, value) {
    // var tb
    //
    // // if (exception != null &&
    // //     !types.isinstance(exception, exceptions.BaseException)) {
    // //     errors.PyErr_Format(exceptions.SystemError,
    // //                  "exception %R not a BaseException subclass",
    // //                  exception)
    // //     return
    // // }
    // var exc_value = curexc_value
    // if (exc_value != null && exc_value != core.None) {
    //     /* Implicit exception chaining */
    //     if (value == null || !PyExceptionInstance_Check(value)) {
    //         /* We must normalize the value right now */
    //         var args
    //         var fixed_value
    //
    //         /* Issue #23571: PyEval_CallObject() must not be called with an
    //            exception set */
    //         errors.PyErr_Clear()
    //
    //         if (value == null || value == core.None) {
    //             args = new types.Tuple()
    //         } else if (types.isinstance(value, types.Tuple)) {
    //             args = value
    //         } else {
    //             args = types.Tuple([value])
    //         }
    //         fixed_value = args ?
    //             PyEval_CallObject(exception, args) : null
    //         if (fixed_value == null) {
    //             return
    //         }
    //         value = fixed_value
    //     }
    //     /* Avoid reference cycles through the context chain.
    //        This is O(chain length) but context chains are
    //        usually very short. Sensitive readers may try
    //        to inline the call to PyException_GetContext. */
    //     if (exc_value != value) {
    //         var o = exc_value
    //         var context
    //         while ((context = PyException_GetContext(o))) {
    //             if (context == value) {
    //                 PyException_SetContext(o, null)
    //                 break
    //             }
    //             o = context
    //         }
    //         PyException_SetContext(value, exc_value)
    //     }
    // }
    // if (value != null && PyExceptionInstance_Check(value)) {
    //     tb = PyException_GetTraceback(value)
    // }
    // TODO: do the above
    var tb = null
    errors.PyErr_Restore(exception, value, tb)
}

module.exports = errors
