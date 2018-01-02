export var _weakref = {
    '__doc__': '',
    '__file__': 'batavia/modules/sys.js',
    '__name__': 'sys',
    '__package__': '',

    'CallableProxyType': null, // not used directly in stdlib

    'ProxyType': null, // not used directly in stdlib

    'ReferenceType': null // not used directly in stdlib
}

_weakref.getweakrefs = function(object) {
    return []
}

_weakref.getweakrefcount = function(object) {
    return 0
}

_weakref.proxy = function(object, callback) {
    // TODO: support the finalize callback
    return object
}

_weakref.ref = function(object) {
    return object
}
