var weakref = {
    '__doc__': "",
    '__file__': "batavia/modules/sys.js",
    '__name__': "sys",
    '__package__': "",

    'CallableProxyType': null,  // not used directly in stdlib

    'ProxyType': null,  // not used directly in stdlib

    'ReferenceType': null  // not used directly in stdlib
};

weakref.getweakrefs = function(object) {
    return [];
}

weakref.getweakrefcount = function(object) {
    return 0;
}

weakref.proxy = function(object, callback) {
    // TODO: support the finalize callback
    return object;
}

weakref.ref = function(object) {
    return object;
}

module.exports = weakref;
