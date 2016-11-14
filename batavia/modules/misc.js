module.exports = {
    // needed by the operator python module
    '_operator': {
        __doc__: "Operator interface.\n\nThis module exports a set of functions corresponding\nto the intrinsic operators of Python.  For example, operator.add(x, y)\nis equivalent to the expression x+y.  The function names are those\nused for special methods; variants without leading and trailing\n'__' are also provided for convenience."
    },

    // stub "implementation" of _weakref
    // JS doesn't quite support weak references, though
    // in the future we might be able to use WeakMap or WeakSet to hack it.
    '_weakref': {
        __doc__: "",

        CallableProxyType: null, // not used directly in stdlib

        ProxyType: null, // not used directly in stdlib

        ReferenceType: null, // not used directly in stdlib

        getweakrefs: function(object) {
            return [];
        },
        getweakrefcount: function(object) {
            return 0;
        },
        proxy: function(object, callback) {
            // TODO: support the finalize callback
            return object;
        },
        ref: function(object) {
          return object;
        }
    }
}
